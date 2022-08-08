<script setup>
import {ref, reactive} from 'vue';
import { ElMessage } from 'element-plus'
import {createPaper, createSurvey} from './utils/request'

// 操作步骤 0: '创建问卷' 1: '创建试题' 2: '算分规则'
const stage = ref(0);

const surveyName = ref('');

const surveyId = ref(null);

const defaultQuestion = {
  questionId: '', // 问题Id
  remark: '', // 题干
  type: 0, // 问题类型 0选择 1填空
  required: 0, //是否必填，1必填，0不必填
  test: 0, // 是否计分：1计分，0不计分
  options: [
    {
      opt: '', // 选项
      describe: '', //选项的描述
      score: 0 //该选项的分数
    }
  ] //每个题的选项
};

const questions = reactive([]);


const handleSurvey = async () => {
  try {
    if (surveyName.value) {
      const res = await createSurvey({
        surveyName: surveyName.value
      });
      surveyId.value = res.data;
      stage.value ++;
    } else {
      ElMessage.warning('请输入问卷名称');
    }
  } catch (e) {
    ElMessage.error(e);
  }
};

</script>

<template>
<div class="container">
    <el-steps :active="stage" finish-status="success" simple>
      <el-step title="创建问卷" />
      <el-step title="创建题目" />
      <el-step title="算分规则" />
    </el-steps>
    <div v-if="stage === 0" class="box-card">
      <!-- stage 创建问卷 -->
      <h4>请输入问卷名称：</h4>
      <el-input v-model="surveyName" placeholder="请输入问卷名称" style="margin-top: 50px;"/>
      <el-button type="primary" @click="handleSurvey" style="margin-top: 150px;">下一步</el-button>
    </div>
    <div v-if="stage === 1">
      <!-- stage 创建题目 -->
    </div>
    <div v-if="stage === 2">
      <!-- stage 创建算分规则 -->
    </div>
</div>
</template>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.box-card {
  margin: 0 auto;
  width: 80%;
  margin-top: 100px;
  text-align: center;
}
</style>
