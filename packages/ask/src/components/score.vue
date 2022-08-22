<script setup>
import {computed} from 'vue';

const {questions, score, questionIds} = defineProps({
    questions: Array,
    questionIds: Array,
    score: Object
});

const emit = defineEmits(['handleDelete']);

const computedQuestions = computed(() => {
    return questions.filter(item => item.test === 1);
});

</script>

<template>
<div class="question-card">
    <el-button type="primary" @click="emit('handleDelete', score.uid)">删除</el-button>
    <div class="question-container">
        <el-form :model="score" label-width="80px">
            <el-form-item label="得分类别:">
                <el-input v-model="score.title"/>
            </el-form-item>
            <el-form-item label="参与题目:">
                <el-select v-model="score.questionIds" multiple placeholder="请选择">
                    <el-option
                        v-for="item in computedQuestions"
                        :key="item.uid"
                        :label="'第' + item.questionId + '题'"
                        :value="item.questionId"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="系数:">
                <el-input v-model="score.factor"/>
            </el-form-item>
            <el-form-item label="描述:">
                <el-input v-model="score.remark"/>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<style scoped>
.question-card {
    width: 100%;
    border: 1px solid #999;
    border-radius: 5px;
    min-height: 10px;
    padding: 10px;
    margin-bottom: 15px;
    box-sizing: border-box;
}

.header-container {
    display: flex;
    justify-content: space-between;
}
.question-container {
    padding: 20px;
}

.question-index {
    font-weight: 600;
}
</style>
