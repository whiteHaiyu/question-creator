<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import {createSurvey, createQuestions, createScore, modifyQuestion} from '@/utils/request';
import {deepClone, guid} from '@/utils/utils';
import Question from '@/components/question.vue';
import Score from '@/components/score.vue';


const route = useRoute();
const router = useRouter();

const pageType = ref('create'); // create || modify

onMounted(() => {
  if (route.query && route.query.surveyId && sessionStorage.getItem('survey')) { // 编辑试卷
    pageType.value = 'modify';
    const surveyData = JSON.parse(sessionStorage.getItem('survey'));
    surveyId.value = surveyData.id;
    surveyName.value = surveyData.title;
    questions.value = surveyData.questions.map(question => {
      return {
        ...question,
        uid: guid()
      }
    })
  }
});

// 操作步骤 0: '创建问卷' 1: '创建试题' 2: '算分规则'
const stage = ref(0);

const surveyName = ref('');

const surveyId = ref('');

const title = computed(() => {
  if (surveyId.value) {
    return `${surveyName.value} - ${surveyId.value}`
  }
  return '欢迎使用问卷创建器';
});

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
  title: '',
  factor: 1,
  remark: ''
};
const scoreList = ref([]);

// 创建问卷
const handleSurvey = async () => {
  try {
    if (surveyName.value) {
      const res = await createSurvey({
        title: surveyName.value,
        creator: localStorage.getItem('userName')
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

// 编辑题目
const handleModifyQuestion = (uid) => {
  const target = questions.value.find(item => item.uid === uid);
  modifyQuestion(target).then(res => {
    if (res.data === 1) {
      ElMessage.success('题目修改成功')
    }
  })
};

// 删除题目
const handleDeleteQuestion = (uid) => {
  questions.value = questions.value.filter(item => item.uid !== uid);
};

// 提交问题创建
const handleQuestion = async () => {
  try {
    if (questions.value.length) {
      const postData = deepClone(questions.value).map((item, index) => {
        item.surveyId = surveyId.value;
        item.questionId = index + 1;
        return item;
      });
      const res = await createQuestions(postData);
      if (res.status === 200) {
        // HACK [组件中props被解构] 更新questionId
        questions.value = postData;
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
    surveyId: surveyId.value,
    ...deepClone(defaultScore)
  });
};

// 删除分数规则
const handleDeleteScore = (uid) => {
  scoreList.value = scoreList.value.filter(item => item.uid !== uid);
};

// 提交分数规则
const handleScore = async () => {
  try {
      const res = await createScore(scoreList.value);
      if (res.status === 200) {
        ElMessage.success('创建成功');
        stage.value ++;
      } else {
        ElMessage.warning('请输入问卷名称');
      }
  } catch (e) {
    ElMessage.error(e);
  }
};

const handleFinish = () => {
  router.back();
};

const handleNextStage = () => {
  if (stage.value < 3) {
    stage.value++;
  } else {
    handleFinish();
  }
};

const handlePrevStage = () => {
  if (stage.value > 0){
    stage.value--;
  } else {
    handleFinish();
  }
}

</script>

<template>
<div class="container">
    <div class="title">{{title}}</div>
    <el-button v-if="pageType === 'modify'" @click="handleNextStage" class="next-stage">下一项</el-button>
    <el-button v-if="pageType === 'modify'" @click="handlePrevStage" class="prev-stage">上一项</el-button>
    <el-steps :active="stage" finish-status="success" simple>
      <el-step title="创建问卷" />
      <el-step title="创建题目" />
      <el-step title="算分规则" />
    </el-steps>
    <div v-if="stage === 0" class="box-card">
      <!-- stage 创建问卷 -->
      <h4>请输入问卷名称：</h4>
      <el-input v-model="surveyName" :disabled="pageType === 'modify'" placeholder="请输入问卷名称" style="margin-top: 50px;"/>
      <el-button v-if="pageType === 'create'" type="primary" @click="handleSurvey" style="margin-top: 150px;">
        创建问卷
      </el-button>
    </div>
    <div v-if="stage === 1">
      <!-- stage 创建题目 -->
      <div v-if="pageType === 'create'" class="buttons">
        <el-button type="success" @click="handleQuestion" style="margin-left: 10px">完成</el-button>
        <el-button type="primary" @click="handleCreateQuestion">添加</el-button>
      </div>
      <Question
        v-for="(item, index) in questions"
        :key="item.uid"
        :index="index + 1"
        :question="item"
        :isModify="pageType === 'modify'"
        @handleModify="handleModifyQuestion"
        @handleCopy="handleCloneQuestion"
        @handleDelete="handleDeleteQuestion"
      />
      <el-empty v-if="questions.length === 0" description="请添加题目~" />
    </div>
    <div v-if="stage === 2">
      <!-- stage 创建算分规则 -->
      <div v-if="pageType === 'create'" class="buttons">
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
      <el-empty v-if="scoreList.length === 0" :description="
        `${pageType === 'create' ? '请设置算分规则~' : '算分规则暂不支持编辑，详情咨询管理员~'}`
      " />
    </div>
    <div v-if="stage === 3">
      <!-- stage 创建算分规则 -->
      <div class="result">
          <span class="tips">
            {{`问卷${pageType === 'create' ? '创建' : '编辑'}完成`}}
          </span>
          <span class="tips">问卷名: {{surveyName}}</span>
          <span class="tips">问卷ID: {{surveyId}}</span>
          <el-button @click="handleFinish" type="primary" style="margin-top: 20px">完成</el-button>
      </div>
    </div>
</div>
</template>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 20px);
}

.next-stage {
  position: fixed;
  right: 10px;
  top: 45%;
}

.prev-stage {
  position: fixed;
  left: 10px;
  top: 45%;
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

.result {
  margin-top: 80px;
  text-align: center;
}

.tips {
  display: block;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  margin-top: 20px;
}
</style>
