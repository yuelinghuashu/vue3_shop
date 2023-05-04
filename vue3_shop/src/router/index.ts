import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const Login = () => import('../views/Login.vue')
const Home = () => import('../views/Home.vue')
const Welcome = () => import('../views/Welcome.vue')
const Users = () => import('../views/user/Users.vue')
const Roles = () => import('../views/power/Roles.vue')
const Rights = () => import('../views/power/Rights.vue')
const Goods = () => import('../views/goods/GoodList.vue')
const Params = () => import('../views/goods/Params.vue')
const Categories = () => import('../views/goods/Categories.vue')
const Add = () => import('../views/goods/Add.vue')
const Orders = () => import('../views/orders/Orders.vue')
const Reports = () => import('../views/reports/Reports.vue')


const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/roles', component: Roles },
            { path: '/rights', component: Rights },
            { path: '/goods', component: Goods },
            { path: '/params', component: Params },
            { path: '/categories', component: Categories },
            { path: '/add', component: Add },
            { path: '/orders', component: Orders },
            { path: '/reports', component: Reports },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router