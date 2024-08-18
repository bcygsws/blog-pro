import {createRouter, createWebHistory} from "vue-router";
import {getToken} from "@/utils/token";

const routes = [
    {
        path: '/',
        redirect: '/home',
        children: [// 一级组件，两个/home和/login
            {
                path: '/home',
                component: () => import("@/views/home/HomeView.vue"),
                redirect: '/main',
                children: [
                    {
                        path: '/main',
                        component: () => import("@/components/main/MainView.vue")
                    },
                    {
                        path: '/category/:id',
                        component: () => import("@/components/category/CategoryView.vue")
                    }
                ]
            },
            {
                path: '/login',
                component: () => import("@/views/login/Login.vue")
            },
            {
                path: '/dashboard',
                component: () => import("@/views/dashboard/DashBoard.vue"),
                redirect: '/dashboard/manage_art',
                children: [
                    {
                        path: '/dashboard/manage_art',
                        component: () => import("@/components/manage/ManageArt.vue")

                    },
                    {
                        path: '/dashboard/manage_cat',
                        component: () => import("@/components/manage/ManageCat.vue")
                    }
                ]
            },
            {
                path: '/detail/:id',
                component: () => import("@/components/detail/Detail.vue")

            }

        ]
    },

];
const router = createRouter({
    history: createWebHistory(),
    routes
});
// 全局前置路由守卫
// 确保next()在任何导航守卫中，只严格执行一次
// 官网解释：https://v3.router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB
router.beforeEach((to, from, next) => {
    const whiteList = [/^\/login/, /^\/main/, /^\/category\/+/, /^\/detail\/+/];
    // 路由白名单
    let flag = whiteList.some(item => {
        return item.test(to.path);
    });
    const token = getToken();
    console.log(token);//
    if (flag) {
        next();
    } else {
        if (!token) {
            next('/login');// token不存在，重定向到登录页
        } else {
            next();
        }
    }

})
export default router;