import ResType, {IComment} from './shared';
import http from "@/utils/http";

export type ICommentList = {
    id?: number;
    content: string;
    artId: number;
    fav?: number;
    page?: number;
    pageSize?: number;
    timestamp?: number;
};
// 6.post方法，comment列表添加新纪录
const submitCommentAPI = (val: ICommentList) => {
    return http.request({
        url: '/api/comment',
        method: 'POST',
        data: val
    });
}

/**
 * @name:getComById
 * @description:根据文章列表id,路由参数，以及page pageSize，分页获取评论列表
 *
 * */
type IPageParams = {
    artId: number;
    page: number;
    pageSize: number;
}

const getComByIdAPI = (val: IPageParams) => {
    const {artId, page, pageSize} = val;
    return http.request<ResType<IComment[]>>({
        url: `/api/comment/${artId}`,
        params: {
            page,
            pageSize
        }
    })
}
/**
 * @根据返回的时间戳pre_timestamp分页查询
 * 1.路径参数id:文章列表id,即 my_list表art_id
 * 2.查询参数
 * pageSize
 * timestamp
 *
 * */
type ITimestamp = {
    pre_timestamp: number;
    list: IComment[]
}
export type ITimeParams = {
    artId: number;
    pageSize: number;
    timestamp: number;
}
const getComByTimeAPI = (val: ITimeParams) => {
    const {artId, pageSize, timestamp} = val;
    return http.request<ResType<ITimestamp>>({
        method: 'GET',
        url: `/api/comment/${artId}`,
        params: {
            pageSize,
            timestamp
        }
    })

}
/**
 * @name:putComFavAPI
 * @description:根据评论列表id,修改点赞次数，put方式
 *
 * */
export type IFav = {
    id: number;
    fav: number;
}
const putComFavAPI = (val: IFav) => {
    const {id, fav} = val;
    return http.request({
        method: 'PUT',
        url: '/api/comment',
        data: {
            id,
            fav
        }
    })
}
/**
 * @name:delComByIdAPI
 * @description:根据id删除一条记录
 *
 * */
const delComByIdAPI = (id: number) => {
    return http.request({
        method: 'delete',
        url: `/api/comment/${id}`
    })

}

export {
    getComByIdAPI,
    submitCommentAPI,
    putComFavAPI,
    delComByIdAPI,
    getComByTimeAPI
}