import axios from 'axios';
import {clear, getToken} from "./token";
import useDiscreteAPI from "@/utils/useDiscreteAPI";


const {message} = useDiscreteAPI();


const http = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 5000
});
// 请求拦截器和响应拦截器
// 请求接后端接口前，插入一些个人配置
http.interceptors.request.use(config => {
    // 后端返回的数据中，已经添加了bearer 字符，设置请求头时就不用拼串了
    let token = getToken();
    // console.log('http', token);
    config.headers.Authorization = `${token}`;
    return config;
}, (err) => {
    return Promise.reject(err);
});
http.interceptors.response.use(response => {
    return response;
}, (err) => {
    // 打印错误，将  导航至登录页注释掉，才能看见错误
    console.log('http', err);
    // 处理 token过期或者其他未知错误的回调函数，超出2xx的状态码，在err回调中处理
    if (err.response.status === 401 || err.response.status === 501) {
        // a.清理掉无效token
        clear('MY_TOKEN');
        // b.使用message提示错误
        message.error("出现错误：" + err.message + ",状态码：" + err.response.status);
        // c.导航至登录页
        window.location.href = "/login";
        // d.返回错误
        return Promise.reject(err.message);// 返回错误信息
    }
});
export default http;