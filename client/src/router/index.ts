import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        redirect: '/home',
        children: [// 一级组件，两个/home和/login
            {
                path: '/home',
                component: () => import("@/views/HomeView.vue"),
                redirect: '/main',
                children: [
                    {
                        path: '/main',
                        component: () => import("@/views/MainView.vue")
                    },
                    {
                        path: '/category',
                        component: () => import("@/views/CategoryView.vue")
                    }
                ]
            },
            {
                path: '/login',
                component: () => import("@/views/Login.vue")
            }

        ]
    },

];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;