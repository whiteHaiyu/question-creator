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

const questionList = reactive([
  {
    name: '一般信息',
    id: 16
  },
  {
    name: '个人生活习惯',
    id: 18
  },
  {
    name: '生育生活质量问卷 (Fertility Quality of Life，FertiQoL)',
    id: 19
  },
  {
    name: '9条目患者健康问卷 (Patient Health Questionnaire，PHQ—9)',
    id: 20
  },
  {
    name: '广泛性焦虑障碍量表 (Generalized Anxiety Disorder，GAD—7)',
    id: 21
  }
]);

onMounted(() => {
  const sId = getQueryVariable('surveyId') || questionList[0].id;
  getData(sId);
});

const getData = async (id) => {
  isLoaded.value = false;
  surveyId.value = id;
  try {
      const [paperData, titleData] = await Promise.all([getPaper(surveyId.value), getTitle(surveyId.value)]);
      const target = questionList.find(item => item.id === +surveyId.value);
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
      try {
        if (data.length === 0) {
          result.value = [];
        } else {
          const resResult = [];
          data.forEach(item => {
            Object.keys(item).forEach(key => {
              resResult.push(`${key}: ${item[key]}分`);
            });
          });
          result.value = resResult;
        }
      } catch (e) {

      }
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
  const idx = questionList.findIndex(item => item.id === +surveyId.value) + 1;
  if (questionList[idx] && questionList[idx].id) {
      showResult.value = false;
      showSheet.value = false;
      showRequired.value = false;
      getData(questionList[idx].id);
  } else {
      Dialog.alert({
        message: '问卷全部填完了'
      });
  }
}

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
<van-overlay :show="showResult">
  <div class="wrapper" @click.stop>
    <div v-for="item in result">{{item}}</div>
    <div v-if="result.length === 0">提交完成</div>
    <div class="flex-row">
      <van-button round size="small" type="primary" @click="showResult = false" style="margin-top: 50px; width: 120px;">确定</van-button>
      <van-button round size="small" type="default" @click="handleNext" style="margin-top: 50px; width: 120px;">下一问卷</van-button>
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
  font-size: 15px;
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
  height: 80%;
  width: 80%;
  flex-direction: column;
  background-color: #fff;
  margin: 0 auto;
  transform: translateY(10%);
  border-radius: 5px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
