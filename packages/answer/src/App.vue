<script setup>
import { ref, reactive, onMounted } from 'vue';
import {getQueryVariable} from './utils/utils';
import {getPaper, submitPaper, getTitle } from './utils/request';
import Common from './components/common.vue';
import Question from './components/question.vue';
import { Dialog, Toast } from 'vant';

const isLoaded = ref(false);
const title = ref('问卷收集器');
const surveyId = ref('');
const questions = reactive([]);
const userInfo = reactive({});
const result = ref([]);
const showResult = ref(false);

onMounted(async () => {
  surveyId.value = getQueryVariable('surveyId');
  if (surveyId.value) {
    try {
      const [paperData, titleData] = await Promise.all([getPaper(surveyId.value), getTitle(surveyId.value)]);
      questions.push(...paperData.data);
      title.value = titleData.data;
      isLoaded.value = true;
    } catch (e) {
      Dialog.alert({
        message: e.message,
        theme: 'round-button'
      });
    }
  } else {
    Dialog.alert({
      message: '解析问卷id失败',
      theme: 'round-button'
    });
  }
})

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
        Toast(tips[item]);
        return;
      }
    }
    for (let idx in questions) {
      if (questions[idx].required === 1 && !questions[idx].result) {
        Toast(`请完成第${(+idx)+1}个问题`);
        return;
      }
    }
    const postData = {...userInfo};
    postData.surveyId = +surveyId.value;
    postData.answers = questions.map(item => {
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
        message: '服务器故障'
      });
    })
  } catch (e) {
    console.log(e);
  }
}

</script>

<template>
<div v-if="isLoaded">
  <div class="title">{{title}}</div>
  <van-form @submit="onSubmit">
    <Common
      :userInfo="userInfo"
    />
    <Question
      v-for="(item, index) in questions"
      :question="item"
      :idx="index + 1"
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
    <van-button round size="small" type="primary" @click="() => {showResult = false}" style="margin-top: 50px; width: 150px;">确定</van-button>
  </div>
</van-overlay>
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
</style>
