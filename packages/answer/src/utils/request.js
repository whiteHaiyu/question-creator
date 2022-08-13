import axios from 'axios'

axios.defaults.timeout = 50000

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.error(error)
})

// 获取问卷
const getPaper = (surveyId) => {
    return axios.get(`/api/inform/showSurvey?surveyId=${surveyId}`)
}

const getTitle = (surveyId) => {
    return axios.get(`/api/survey/getSurveyTitle?surveyId=${surveyId}`)
}

// 提交问卷
const submitPaper = (data) => {
  return axios({
    method: 'post',
    url: '/api/inform/submit',
    data
  })
}

export {
    getPaper,
    getTitle,
    submitPaper
}