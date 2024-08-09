import {createApp} from 'vue'
import './style.scss'
import App from '@/App.vue';
import router from "@/router/index";
import naive from "naive-ui"
import {createPinia} from "pinia";

const app = createApp(App);
// 配置路由
app.use(router);
// 全局引入naive-ui组件
app.use(naive);
// 渲染index.html中app
// 注册pinia转态管理器
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
/**
 *
 * @技术栈：vue3+ts+naive-ui
 * 参考naive ui官方文档：
 * naive ui说明：
 * 1.全局引入，打包将会出现冗余代码，但使用方便，无数逐个审视引入了哪些组件,使用全局引入
 * 2.在tsconfig.js中配置对Volar的支持
 *
 * */
