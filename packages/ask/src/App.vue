<script setup>
import {ref, reactive, computed} from 'vue';
import {ElMessage} from 'element-plus';
import {createSurvey, createQuestions, createScore} from './utils/request';
import {deepClone, guid} from './utils/utils';
import Question from './components/question.vue';
import Score from './components/score.vue';

// 操作步骤 0: '创建问卷' 1: '创建试题' 2: '算分规则'
const stage = ref(0);

const surveyName = ref('');

const surveyId = ref('');

const title = computed(() => {
  if (surveyId.value) {
    return `${surveyName.value} - ${surveyId.value}`
  }
  return '欢迎使用问卷创建器';
})

const defaultQuestion = {
  questionId: '', // 问题Id
  remark: '', // 题干
  type: 0, // 问题类型 0选择 1填空
  required: 0, //是否必填，1必填，0不必填
  test: 0, // 是否计分：1计分，0不计分
  options: [
    {
      opt: 'A', // 选项
      describe: '', //选项的描述
      score: 0 //该选项的分数
    }
  ] //每个题的选项
};

const questions = ref([]);

// 得分类别
const defaultScore = {
  questionIds: [],
  scoreName: '',
  scoreRate: 1
};
const scoreList = ref([]);

// 创建问卷
const handleSurvey = async () => {
  stage.value ++;
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

// 新建题目
const handleCreateQuestion = () => {
  const uid = guid();
  questions.value.push({
    uid,
    ...deepClone(defaultQuestion)
  });
};
// 复制题目
const handleCloneQuestion = (uid) => {
  const target = questions.value.find(item => item.uid === uid);
  const new_uid = guid();
  questions.value.push({
    ...deepClone(target),
    uid: new_uid
  })
};
// 删除题目
const handleDeleteQuestion = (uid) => {
  questions.value = questions.value.filter(item => item.uid !== uid);
};
// 提交问题创建
const handleQuestion = async () => {
  stage.value ++;
  try {
    if (questions.value.length) {
      const res = await createQuestions({
        questions: questions.value
      });
      if (res.status === 200) {
        stage.value ++;
        ElMessage.success('创建成功');
      } else {
        ElMessage.warning(res.msg);
      }
    } else {
      ElMessage.warning('请至少创建一道问题');
    }
  } catch (e) {
    ElMessage.error(e);
  }
};
// 添加分数规则
const handleCreateScore = () => {
  const uid = guid();
  scoreList.value.push({
    uid,
    ...deepClone(defaultScore)
  });
};
// 删除分数规则
const handleDeleteScore = (uid) => {
  scoreList.value = scoreList.value.filter(item => item.uid !== uid);
};
// 提交分数规则
const handleScore = async () => {
  stage.value ++;
  try {
      const res = await createScore({
        scoreList: scoreList.value
      });
      if (res.status === 200) {
        ElMessage.success('创建成功');
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
    <div class="title">{{title}}</div>
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
      <div class="buttons">
        <el-button type="success" @click="handleQuestion" style="margin-left: 10px">完成</el-button>
        <el-button type="primary" @click="handleCreateQuestion">添加</el-button>
      </div>
      <Question
        v-for="(item, index) in questions"
        :key="item.uid"
        :index="index + 1"
        :question="item"
        @handleCopy="handleCloneQuestion"
        @handleDelete="handleDeleteQuestion"
      />
      <el-empty v-if="questions.length === 0" description="请添加题目~" />
    </div>
    <div v-if="stage === 2">
      <!-- stage 创建算分规则 -->
      <div class="buttons">
        <el-button type="success" @click="handleScore" style="margin-left: 10px">完成</el-button>
        <el-button type="primary" @click="handleCreateScore">添加</el-button>
      </div>
      <Score
        v-for="item in scoreList"
        :key="item.uid"
        :score="item"
        :questionIds="item.questionIds"
        :questions="questions"
        @handleDelete="handleDeleteScore"
      /> 
      <el-empty v-if="scoreList.length === 0" description="请设置算分规则~" />
    </div>
</div>
</template>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.title {
  font-size: 20px;
  text-align: center;
  margin: 20px 0;
}

.box-card {
  margin: 0 auto;
  width: 80%;
  margin-top: 100px;
  text-align: center;
}

.buttons {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
}
</style>
