import axios from 'axios';
import {getToken} from "./token.ts";

const http = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 5000
});
// 请求拦截器和响应拦截器
// 请求接后端接口前，插入一些个人配置
http.interceptors.request.use(config => {
    let token = getToken();
    if (token) {
        config.headers.Authorization = `bearer ${token}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
});
http.interceptors.response.use(response => {
    return response;
}, (err) => {
    return Promise.reject(err);
});
export default http;