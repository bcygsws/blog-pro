import {clear} from "@/utils/token.ts";
import {IForm} from "@/apis/login.ts";
import {Ref} from "vue";

/**
 * @name:resetForm
 * @description:表单重置方法
 *
 *
 * */
function resetForm(model: Ref<IForm>, username: string, password: string, remember: string, token: string) {
    model.value.account = "";
    model.value.password = "";
    model.value.remember = false;
    clear(username);// 清除保存的account
    clear(password);// 清除保存的password
    clear(remember);// 清除保存的remember状态
    clear(token);// 清除保存的token
}

export default resetForm;