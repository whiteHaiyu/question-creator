<script setup>
const { userInfo } = defineProps({
    userInfo: Object
});

</script>

<template>
    <van-cell-group inset>
        <!-- 输入任意文本 -->
        <van-field v-model="userInfo.name" label="姓名" />
        <!-- 调起手机号键盘 -->
        <van-field v-model="userInfo.userId" type="tel" label="身份证号" />
        <!-- 调起纯数字键盘 -->
        <van-field v-model="userInfo.age" type="digit" label="年龄" />
    </van-cell-group>
</template>
