/**
 *
 * 后端：分类管理接口
 *
 * */
import ResType from "@/apis/shared";
import http from "@/utils/http.ts";

// 1.分类管理，列表获取
export interface ICategory {
    id: number
    name: string
}

function getCatAPI() {
    return http.request<ResType<ICategory[]>>({
        url: '/manage_cat'
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

export {
    getCatAPI,
    changeCatAPI,
    addCatAPI
}
