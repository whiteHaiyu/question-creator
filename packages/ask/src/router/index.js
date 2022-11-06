import {createRouter, createWebHashHistory} from 'vue-router'
import { ElMessage } from 'element-plus'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('@/pages/login/index.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/pages/admin/index.vue'),
        meta: {
            title: '问卷管理'
        }
    },
    {
        path: '/creator',
        name: 'Creator',
        component: () => import('@/pages/creator/index.vue'),
        meta: {
            title: '创建问卷'
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const userName = localStorage.getItem('userName');
    if (to.name !== 'Login' && !userName) {
        ElMessage.error('用户未登录');
        next({
            name: 'Login'
        })
    } else {
        next();
    }
})

export default router