import axios from 'axios'

axios.defaults.timeout = 50000
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.error(error)
})

// 创建问卷
export const createSurvey = (data) => {
  return axios({
    method: 'post',
    url: '/api/creator/create_survey',
    data
  })
}

// 问卷添加题目
export const createQuestions = (data) => {
  return axios({
    method: 'post',
    url: '/api/question/create_s',
    data
  })
}

// 问卷添加算分规则
export const createScore = (data) => {
  return axios({
    method: 'post',
    url: '/api/inform/createScoreRule',
    data
  })
}

// 用户注册
export const register = (data) => {
  return axios({
    method: 'post',
    url: '/api/creator/register',
    params: data
  })
}

// 用户登录
export const login = (data) => {
  return axios({
    method: 'post',
    url: '/api/creator/login',
    data
  })
}

// 问卷列表
export const surveyList = (params) => {
  return axios({
    method: 'get',
    url: '/api/creator/personal/home',
    params
  })
}

// 删除问卷
export const deleteSurvey = (data) => {
  return axios({
    method: 'post',
    url: '/api/creator/delete_survey',
    data
  })
}

// 编辑试题
export const modifyQuestion = (data) => {
  return axios({
    method: 'post',
    url: '/api/creator/update_question',
    data
  })
}