import http from "@/utils/http";
import {UnwrapRef} from "vue";
import ResType from "@/apis/shared";
// // 详情页中的评论列表
// export type IComment = {
//     id: number;
//     art_id: number;
//     img: string;
//     fav: number;
//     content: string;
//     com_time: number;
//     username: string;
//
// }
// 1.获取文章列表API
export type IList = {
    id: number;
    category_id: number;
    title: string;
    content: string;
    create_time: number;
    name?: string;
}


interface IData {
    count: number;
    list: IList[]
}

export interface IPage {
    categoryId: number;
    page: number;
    pageSize: number;
    keywords: string;
}

const getArtAPI = (val: IPage) => {
    return http.request<ResType<IData>>({
        url: "/manage_art",
        method: "GET",
        params: val
    });
}
// 前端部分，获取文章列表，无需token验证
const _getArtAPI = (val: IPage) => {
    return http.request<ResType<IData>>({
        url: "/api/manage_art",
        method: "GET",
        params: val
    });
}

// 2.根据id删除一篇博客文章
const delArtByIdAPI = (id: number) => {
    return http.request({
        url: `/manage_art/${id}`,
        method: "DELETE"
    })

}
// 3.向博客文章列表中添加数据
export type IAdd = {
    categoryId: string
    title: string
    name: string
}
const addArtAPI = (val: UnwrapRef<{ title: string; content: string; categoryId: null }>) => {
    return http.request({
        url: `/manage_art`,
        method: "POST",
        data: val
    })

}
// 4.根据id,查询博客列表中的一条记录
const getArtByIdAPI = (id: number) => {
    return http.request<ResType<IList>>({
        url: `/manage_art/${id}`
    })

}
const _getArtByIdAPI = (id: number) => {
    return http.request<ResType<IList>>({
        url: `/api/manage_art/${id}`
    })

}
// 5.put方法，提交body参数提交博客列表记录的修改
export type IModel = {
    id?: number;
    categoryId: string | null;
    title: string;
    content: string;
}
const submitModifiedAPI = (val: IModel) => {
    return http.request({
        url: `/manage_art`,
        method: 'PUT',
        data: val
    })
}
export {
    getArtAPI,
    _getArtAPI,
    delArtByIdAPI,
    addArtAPI,
    getArtByIdAPI,
    _getArtByIdAPI,
    submitModifiedAPI
}