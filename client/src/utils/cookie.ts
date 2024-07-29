/**
 * @name:设置cookie
 * @description:
 *
 * */
import {IParams} from "@/apis/login.ts";
import {Ref} from 'vue';
import {decode} from 'js-base64';

function setCookie(user: string, pwd: string, day: number) {
    // 1.获取当前时间
    const date = new Date();
    // 2.setTime()方法的含义是：从1970午夜开始，添加或减少传入的毫秒数的时间
    date.setTime(date.getTime() + 24 * 60 * 60 * 10000 * day);
    // 3.字符串拼接，设置cookie;由于目前UTC已经取代GMT作为新的世界时间标准，使用toGMTString()和toUTCString()两种方法返回字符串的格式和内容均相同
    window.document.cookie = "account=" + user + ";path=/;expires=" + date.toUTCString();
    // 继续添加cookie字符串
    window.document.cookie = "password=" + pwd + ";path=/;expires=" + date.toUTCString();

}

// 读取账号或密码，将其回显到文本输入框和密码框中

const getCookie = (model: Ref<IParams>) => {
    if (document.cookie.length > 0) {
        const arr = document.cookie.split(";");
        let i = 0;
        while (i < arr.length) {
            let arr2 = arr[i].split("=");
            if (arr2[0] === "account") {
                model.value.account = arr2[1];
            } else if (arr2[0] === "password") {
                model.value.password = decode(arr2[1]);// base64解密
            }
        }


    }

}

export {
    setCookie,
    getCookie
}