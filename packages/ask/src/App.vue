<template>
    <router-view />
</template>

<script setup>
import {onMounted} from 'vue';

onMounted(() => {
    console.log('欢迎使用问卷创建器~')
});
</script>   