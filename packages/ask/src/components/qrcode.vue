<script setup>
import {ref, reactive, onMounted} from 'vue';
import QrcodeVue from 'qrcode.vue'
import vuedraggable from "vuedraggable"

const {surveyList} = defineProps({
    surveyList: Array
});

onMounted(() => {
    surveyList.forEach(item => {
        data.lists.push({
            surveyId: item.id,
            name: item.title
        });
    });
    createUrl();
})

const data = reactive({
    lists: []
});

const value = ref('www.baidu.com');

const dragend = () => {
    createUrl();
}

const createUrl = () => {
    const {origin} = window.location;
    const surverys = data.lists.map(item => item.surveyId);
    value.value = `${origin}/question_answer?surveyIds=${encodeURIComponent(JSON.stringify(surverys))}&surveyId=${surverys[0]}`
}

const qrcode = () => {
    window.open('https://cli.im/')
}

</script>

<template>
    <div class="title">拖拽可调整问题顺序</div>
    <vuedraggable
        class="vuedrag"
        v-model="data.lists"
        item-key="index"
        @dragend="dragend"
    >
        <template #item="{element, index}">
            <div class="image-box">{{`问卷${index+1}：${element.name}`}}</div>
        </template>
    </vuedraggable>
    <div class="qrcode">
        <div class="url">投放链接：{{value}}</div>
        <qrcode-vue :value="value" size="100" level="H" style="margin: 0 auto;"/>
        <el-button @click="qrcode" text>更多二维码样式，点击此处</el-button>
    </div>
</template>

<style scoped>
.qrcode {
    display: flex;
    flex-direction: column;
}
.title {
    margin-bottom: 20px;
}
.vuedrag {
    margin-bottom: 20px;
}
.url {
    word-break: break-all;
    margin-top: 20px;
}

.image-box  {
    border: 1px solid #dedede;
    margin-bottom: 5px;
}
</style>