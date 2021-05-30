import Axios from './axios.js'

export const login = params => Axios.post('/api/login', params);
export const regist = params => Axios.post('/api/regist', params);


export const getArticle = params => Axios.post('/api/article', params);
export const getArticleList = params => Axios.get('/api/article/list', params);
export const publishArticle = params => Axios.post('/api/article/publish', params);
export const editArticle = params => Axios.post('/api/article/edit', params);