import Axios from './axios.js'

export const login = params => Axios.post('/api/login', params);
export const regist = params => Axios.post('/api/regist', params);