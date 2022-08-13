<script setup>
import { computed } from 'vue';

const { question, idx } = defineProps({
    question: Object,
    idx: Number
});

const title = computed(() => {
    return `问题${idx}：${question.remark}`
})
</script>

<template>
    <van-cell-group inset>
        <van-cell>
            <template #title>
                <span v-if="question.required === 1" style="color: red">*</span>
                <span class="custom-title">{{ title }}</span>
            </template>
        </van-cell>
        <van-radio-group v-if="question.type === 0" v-model="question.result">
            <van-radio v-for="item in question.options" :name="item.opt" class="radio">
                {{ item.opt }}、{{ item.describe }}
            </van-radio>
        </van-radio-group>
        <van-field v-if="question.type === 1" v-model="question.result" rows="1" autosize label="" type="textarea"
            placeholder="请输入内容" />
    </van-cell-group>
</template>

<style scoped>
.radio {
    padding: 5px;
    text-align: left;
}

.custom-title {
    margin-right: 4px;
    vertical-align: middle;
}

::v-deep .van-cell__title {
    text-align: left;
}
</style>
