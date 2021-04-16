import Axios from 'axios';

//请求拦截--请求之前的拦截
Axios.interceptors.request.use(function(config) {
    //数据已formData传输到后台

    (config.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8");

    (config['transformRequest'][0] = function(data){
        if(config.JSON){
            return data;
        }else{
            let ret = ''
            for (let it in data) { 
                ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])=='null'?'':encodeURIComponent(data[it])}&`
            };
            return ret 
        }
    })

    return config;
});

//请求拦截--请求回来对响应体的拦截
Axios.interceptors.response.use(function(res) {
    //对请求回来的错误码进行判断处理
    // console.log(res);
    return res.data;

}, function(res) {

});

module.exports = Axios;
