<script setup>
import { ref, reactive, onMounted } from 'vue';
import {getQueryVariable, guid} from './utils/utils';
import {getPaper, submitPaper, getTitle } from './utils/request';
import Common from './components/common.vue';
import Question from './components/question.vue';
import { Dialog, Notify } from 'vant';

const isLoaded = ref(false);
const title = ref('问卷收集器');
const surveyId = ref('');
const questions = ref([]);
const userInfo = reactive({});
const result = ref([]);
const showResult = ref(false);
const showSheet = ref(false);

const showRequired = ref(false);

const questionList = ref([
  {
    name: '一般信息',
    id: 16
  },
  {
    name: '个人生活习惯',
    id: 18
  },
  {
    name: '9条目患者健康问卷 (Patient Health Questionnaire，PHQ—9)',
    id: 20
  },
  {
    name: '广泛性焦虑障碍量表 (Generalized Anxiety Disorder，GAD—7)',
    id: 21
  },
  {
    name: '生育生活质量问卷 (Fertility Quality of Life，FertiQoL)',
    id: 19
  }
]);

onMounted(async () => {
  let sIds = getQueryVariable('surveyIds');
  if (sIds) {
    sIds = JSON.parse(decodeURIComponent(sIds));
    await Promise.all(sIds.map(surveyId => {
      return getTitle(surveyId)
    })).then(res => {
      console.log(res)
      questionList.value = sIds.map((surveyId, idx) => {
        return {
          name: res[idx].data,
          id: +surveyId
        }
      })
    })
  }
  const sId = getQueryVariable('surveyId') || questionList.value[0].id;
  getData(sId);
});

const getData = async (id) => {
  isLoaded.value = false;
  surveyId.value = id;
  try {
      const [paperData, titleData] = await Promise.all([getPaper(surveyId.value), getTitle(surveyId.value)]);
      const target = questionList.value.find(item => item.id === +surveyId.value);
      questions.value = paperData.data.map(item => {
        item.uid = guid();
        return item;
      });
      title.value = titleData.data || target.name;
      isLoaded.value = true;
    } catch (e) {
      Dialog.alert({
        message: e.message,
        theme: 'round-button'
      });
    }
}

const onSubmit = () => {
  try {
    const requestCommon = ['name', 'userId', 'age'];
    const tips = {
      name: '请输入姓名',
      userId: '请输入身份证号',
      age: '请输入年龄'
    };
    for (let item of requestCommon) {
      if (!userInfo[item]) {
        Notify({
          message: tips[item],
          color: '#FFFFFF',
          background: '#EE0A24'
         })
        return;
      }
    }
    for (let idx in questions.value) {
      if (questions.value[idx].required === 1 && !questions.value[idx].result) {
        Notify({
          message: `请完成第${(+idx)+1}个问题`,
          color: '#FFFFFF',
          background: '#EE0A24'
        })
        showRequired.value = true;
        return;
      }
    }
    const postData = {...userInfo};
    postData.surveyId = +surveyId.value;
    postData.answers = questions.value.map(item => {
      const {questionId, result, type} = item;
      return {
        questionId: +questionId,
        result,
        type: +type,
        surveyId: +surveyId.value,
        userId: userInfo.userId
      }
    }).filter(item => item.result);
    submitPaper(postData).then(res => {
      const {data} = res;
      result.value = data.map(item => {
        const {title, score, remark = ''} = item;
        return {
          title,
          score,
          remark: remark.split(/[\;\；]/g)
        }
      });
      showResult.value = true;
    }).catch(err => {
      Dialog.alert({
        message: err.message
      });
    })
  } catch (e) {
    console.log(e);
  }
}

const handleNext = () => {
  const idx = questionList.value.findIndex(item => item.id === +surveyId.value) + 1;
  if (questionList.value[idx] && questionList.value[idx].id) {
      showResult.value = false;
      showSheet.value = false;
      showRequired.value = false;
      getData(questionList.value[idx].id);
      try {
        scrollTo(0,0);
      } catch (e) {
        console.log('scroll error');
      }
  } else {
      Dialog.alert({
        message: '问卷全部填完了,感谢您的配合~'
      });
  }
}

const noop = () => {};

</script>

<template>
<div v-if="isLoaded">
  <div class="title" @click="showSheet = true">{{title}}
    <van-icon name="arrow-down" />
  </div>
  <van-form @submit="onSubmit">
    <Common
      :userInfo="userInfo"
    />
    <Question
      v-for="(item, index) in questions"
      :key="item.uid"
      :question="item"
      :idx="index + 1"
      :showRequired="showRequired"
      :handleEdit="() => showRequired = false"
      style="margin-top: 10px"
    />
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
  <div class="copyright">
      Copyright © w_haiyu@foxmail.com
  </div>
</div>
<van-loading v-else color="#1989fa" class="fix-center"/>
<van-overlay :show="showResult" @click="showResult = false">
  <div class="wrapper" @click.stop="noop">
    <div v-for="item in result">
        <div class="score">{{item.title}}：{{item.score}}分</div>
        <div class="remark" v-for="tips in item.remark">{{tips}}</div>
    </div>
    <div v-if="result.length === 0">提交完成</div>
    <div class="flex-row">
      <!-- <van-button round size="small" type="primary" @click="showResult = false" style="margin-top: 50px; width: 120px;">确定</van-button> -->
      <!-- FIXME 这里想要在最后一个问卷的时候展示 【确定提交】 -->
      <van-button round size="small" type="primary" @click="handleNext" style="margin-top: 50px; width: 120px;">{{
        surveyId === questionList[4].id ? '确定提交' : '下一问卷'
      }}</van-button>
    </div>
  </div>
</van-overlay>
<van-action-sheet
  v-model:show="showSheet"
  :actions="questionList"
  cancel-text="取消"
  description="选择问卷"
  close-on-click-action
  @select="(e) => getData(e.id)"
  @cancel="showSheet = false"
/>
</template>

<style scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 0 15px;
  margin-bottom: 20px;
}
.copyright {
  font-size: 12px;
  transform: scale(.8);
  color: #999;
  margin-top: 50px;
  transform-origin: center center;
}

.fix-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%， -50%);
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  padding-top: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.score {
  font-size: 14px;
}

.remark {
  font-size: 12px;
  color: #999;
}
</style>
