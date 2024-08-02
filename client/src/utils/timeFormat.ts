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

const timeFormat = (val: number | Date) => {
    // return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    return format(val, 'yyyy-MM-dd HH:mm:ss')
}
export {
    timeFormat
};