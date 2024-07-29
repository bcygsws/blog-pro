/**
 * @定义基本返回数据类型
 *
 * */
interface ResType<T> {
    code: number
    message: string
    data: T
}

export default ResType;