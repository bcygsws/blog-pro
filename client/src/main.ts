import {createApp} from 'vue'
import './style.scss'
import App from '@/App.vue';
import router from "@/router/index.ts";

const app = createApp(App);
// 配置路由
app.use(router);
// 渲染index.html中app
app.mount('#app');
