/**
 * @定义基本返回数据类型
 *
 * */
interface ResType<T> {
    code: number
    message: string
    data?: T
}

export type ILabel = {
    label: string;
    value: string;
}
export default ResType;