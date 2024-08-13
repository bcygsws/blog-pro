import ResType, {IComment} from './shared';
import http from "@/utils/http";

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
export {
    getComByIdAPI
}