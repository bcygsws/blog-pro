import ResType from './shared';
import http from "@/utils/http";

// 获取文章列表API
export type IList = {
    id: number;
    category_id: number;
    title: string;
    content: string;
    create_time: number;
}

interface IData {
    count: number;
    list: IList[]
}

export type IPage = {
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
export {
    getArtAPI
}