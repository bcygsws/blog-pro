/**
 * @定义基本返回数据类型
 *
 * */
interface ResType<T> {
    code: number
    message: string
    data?: T
}

// 详情页中的评论列表
export type IComment = {
    id: number;
    art_id: number;
    img: string;
    fav: number;
    content: string;
    com_time: number;
    username: string;

}
export type ILabel = {
    label: string;
    value: string;
}
export default ResType;