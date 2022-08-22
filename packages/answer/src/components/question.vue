<script setup>
import { computed } from 'vue';

const props = defineProps({
    question: Object,
    idx: Number,
    showRequired: Boolean
});

const emit = defineEmits(['handleEdit']);

const title = computed(() => {
    return `问题${props.idx}：${props.question.remark}`
});

const titleStyle = computed(() => {
    return (props.showRequired && !props.question.result) ? 'custom-title-require' : 'custom-title'
})
</script>

<template>
    <van-cell-group inset>
        <van-cell>
            <template #title>
                <span v-if="props.question.required === 1" style="color: red">*</span>
                <span :class="titleStyle" >{{ title }}</span>
            </template>
        </van-cell>
        <van-radio-group v-if="props.question.type === 0" v-model="props.question.result">
            <van-radio v-for="item in props.question.options" :name="item.opt" class="radio">
                {{ item.opt }}、{{ item.describe }}
            </van-radio>
        </van-radio-group>
        <van-field
            v-if="props.question.type === 1"
            v-model="props.question.result"
            rows="1"
            autosize
            label=""
            type="textarea"
            placeholder="请输入内容"
        />
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
    font-size: 16px;
}

.custom-title-require {
    margin-right: 4px;
    vertical-align: middle;
    color: red;
    font-size: 16px;
}

::v-deep .van-cell__title {
    text-align: left;
}

::v-deep .van-cell__title .van-field__label {
    font-size: 16px !important;
}

::v-deep .van-radio__label {
    font-size: 15px !important;
}

</style>
