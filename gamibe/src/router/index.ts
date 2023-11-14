import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/create',
            name: 'Create',
            children: [
                {
                    path: '',
                    name: 'CreateSet',
                    component: () => import('@/views/create/CreateStep1.vue')
                },
                {
                    path: '/create/:type',
                    name: 'CreateEdit',
                    component: () => import('@/views/create/CreateStep2.vue')
                },
                {
                    path: '/create/:type/confirm',
                    name: 'CreateConfirm',
                    component: () => import('@/views/create/CreateStep3.vue')
                }
            ]
        },
        {
            path: '/charts',
            name: 'Charts',
            component: () => import('@/views/Charts.vue')
        },
        {
            path: '/social',
            name: 'Social',
            component: () => import('@/views/Social.vue')
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('@/views/Profile.vue')
        }
    ]
})

export default router
