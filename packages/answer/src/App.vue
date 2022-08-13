<script setup>
import { ref, reactive, onMounted } from 'vue';
import {getQueryVariable} from './utils/utils';
import {getPaper, submitPaper, getTitle } from './utils/request';
import Common from './components/common.vue';
import Question from './components/question.vue';
import { Dialog, Toast } from 'vant';

const title = ref('问卷星');
const surveyId = ref('');
const questions = reactive([]);
const userInfo = reactive({});

onMounted(async () => {
  surveyId.value = getQueryVariable('surveyId');
  if (surveyId.value) {
    const {data} = await getPaper(surveyId.value);
    getTitle(surveyId.value);
    questions.push(...data);
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
        Toast(`请完成第${idx+1}个问题`);
        return;
      }
    }
    const postData = {...userInfo};
    postData.answers = questions.map(item => {
      const {questionId, result, type} = item;
      return {
        questionId: +questionId,
        result,
        type: +type,
        surveyId: +surveyId.value,
        userId: userInfo.userId
      }
    })
    submitPaper(postData).then(res => {

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
</style>
