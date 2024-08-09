/**
 * @时间格式化
 * "compilerOptions": {
 *     "esModuleInterop": true,
 *     "allowSyntheticDefaultImports": true,
 *   }
 *   若tsconfig.js，dayjs引入方式：
 *   import dayjs from 'dayjs';
 *
 * */
// import dayjs from 'dayjs';
import {format} from 'date-fns';
// val || new Date() ,这种或运算，避免了val值，没有及时获取时，该函数报Invalid value的错误

const timeFormat = (val: number | Date) => {
    // return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    return format(val || new Date(), 'yyyy-MM-dd HH:mm:ss')
}
export {
    timeFormat
};