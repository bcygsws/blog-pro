/**
 * @name:登录相关的API编写
 *
 * */
import ResType from './shared';
import http from '@/utils/http';

// login返回对象数据类型
// interface ILogin {
//     id: number;
//     account: string;
//     password: string;
//     token: string;
// }

export type IForm = {
    account: string;
    password: string;
    remember: boolean;
}
export  type IParams = {
    account: string;
    password: string;
}

// 接口为body参数
/**
 * @name:关于body参数
 * http.request({
 *     url:'',
 *     method:'',
 *     data:body参数对象 或者params：params查询参数对象
 *
 * })
 *
 * */
const loginAPI = (params: IParams) => {
    // 返回一个Promise
    return http.request<ResType<string>>({
        url: '/login',
        method: 'POST',
        data: params
    })
}
export {
    loginAPI
}