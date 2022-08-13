import axios from 'axios'

axios.defaults.timeout = 50000

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.error(error)
})

const getPaper = (params) => {
    return axios.get(`xx/xx/${params}`)
}

const createPaper = (params) => {
    return axios.get(`xx/xx/${params}`)
};

// 创建问卷
const createSurvey = (data) => {
  return axios({
    method: 'post',
    url: '/api/survey/create',
    data
  })
}

// 问卷添加题目
const createQuestions = (data) => {
  return axios({
    method: 'post',
    url: '/api/question/create_s',
    data
  })
}

// 问卷添加算分规则
const createScore = (data) => {
  return axios({
    method: 'post',
    url: '/api/inform/createScoreRule',
    data
  })
}

export {
    getPaper,
    createPaper,
    createSurvey,
    createQuestions,
    createScore
}