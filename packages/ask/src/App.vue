<script setup>
import {reactive, onMounted} from 'vue';
import {createPaper} from './utils/request'
const paper = reactive({
  surveyId: '',
  test: ''
});

const defaultQuestion = {
  questionId: '',
  type: '',
  required: 0,
  options: []
};

const questions = reactive([]);

onMounted(() => {
  console.log(defaultQuestion);
  createPaper();
});

</script>

<template>
<div class="container">

</div>
</template>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  height: 100px;
}
</style>
