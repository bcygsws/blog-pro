import {createRouter, createWebHistory} from "vue-router";

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
                path: '/manage_art/:id',
                component: () => import("@/components/detail/Detail.vue")

            }

        ]
    },

];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;