import Axios from './axios.js'

export const login = params => Axios.post('/api/login', params);
export const regist = params => Axios.post('/api/regist', params);


export const getArticle = params => Axios.post('/api/article', params);
export const getArticleList = params => Axios.get('/api/getArticleList', params);