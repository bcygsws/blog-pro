import axios from 'axios';
import {getToken} from "./token.ts";
import useLogin from "@/store/login.ts";

const loginStore = useLogin();

const http = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 5000
});
// 请求拦截器和响应拦截器
// 请求接后端接口前，插入一些个人配置
http.interceptors.request.use(config => {
    // 后端返回的数据中，已经添加了Bearer 字符，设置请求头时就不用拼串了
    let token = loginStore.token || getToken();
    console.log('http', token);
    if (token) {
        config.headers.Authorization = `${token}`;
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