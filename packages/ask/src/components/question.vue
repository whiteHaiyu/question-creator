<script setup>
import {convert} from '../utils/utils';
import {watchEffect} from 'vue';

const defaultOption = {
    opt: '', // 选项
    describe: '', //选项的描述
    score: 0 //该选项的分数
};

const {question, index} = defineProps({
    index: Number,
    question: Object
});

const emit = defineEmits(['handleCopy', 'handleDelete']);

const handleAddOption = () => {
    const optionsIdx = question.options.length + 1;
    question.options.push({
        ...defaultOption,
        opt: convert(optionsIdx)
    })
};

</script>

<template>
<div class="question-card">
    <div class="header-container">
        <span class="question-index">第{{index}}题</span>
        <div>
            <el-button v-if="question.type === 0" type="primary" @click="handleAddOption">添加选项</el-button>
            <el-button type="primary" @click="emit('handleCopy', question.uid)">复制题目</el-button>
            <el-button type="primary" @click="emit('handleDelete', question.uid)">删除题目</el-button>
        </div>
    </div>
    <div class="question-container">
        <el-form :model="question" label-width="80px">
            <el-form-item label="题干:">
                <el-input v-model="question.remark" type="textarea"/>
            </el-form-item>
            <el-form-item label="问题类型:">
                <el-select v-model="question.type" placeholder="请选择">
                    <el-option label="选择" :value="0" />
                    <el-option label="填空" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否必填:">
                <el-radio-group v-model="question.required">
                    <el-radio :label="0">不必填</el-radio>
                    <el-radio :label="1">必填</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否计分:" v-if="question.type === 0">
                <el-radio-group v-model="question.test">
                    <el-radio :label="0">不计分</el-radio>
                    <el-radio :label="1">计分</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                v-for="(item, index) in question.options"
                v-if="question.type === 0"
                :key="new Date().getTime() + index"
                :label="'选项' + item.opt"
            >
                <el-input v-model="item.describe" style="width: 900px; margin-right: 20px"/>
                <span v-if="question.test === 1">分数： <el-input v-model="item.score" style="width: 60px" /></span>
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
