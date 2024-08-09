/**
 *
 * 后端：分类管理接口
 *
 * */
import ResType from "@/apis/shared";
import http from "@/utils/http";

// 1.分类管理，列表获取
export interface ICategory {
    id: number
    name: string
}

function getCatAPI() {
    return http.request<ResType<ICategory[]>>({
        url: '/manage_cat',
        // method:'GET' // 请求方式为get时，可以省略
    });
}
// 前端部分，获取分类列表；无需token验证
function _getCatAPI() {
    return http.request<ResType<ICategory[]>>({
        url: '/api/manage_cat',
        // method:'GET' // 请求方式为get时，可以省略
    });
}


// 2.修改分类
interface IBody {
    id: number;
    name: string;
}

function changeCatAPI(val: IBody) {
    return http.request({
        url: `/manage_cat/${val.id}`,
        method: 'PUT',
        data: {name: val.name}
    });
}

// 3.添加分类
function addCatAPI(val: string) {
    return http.request({
        url: `/manage_cat`,
        method: 'POST',
        data: {name: val}
    });
}

// 4.删除分类
function delCatAPI(id: number) {
    return http.request({
        url: `/manage_cat/${id}`,
        method: 'DELETE'
    });
}

export {
    getCatAPI,
    _getCatAPI,
    changeCatAPI,
    addCatAPI,
    delCatAPI
}
