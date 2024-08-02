import {defineStore} from "pinia";

/**
 * @name:
 * @description：管理登录状态
 *
 *
 * */
const useLogin = defineStore('login', {
    state: () => ({
        token: ''
    }),
    getters: {},
    actions: {}
});
export default useLogin;