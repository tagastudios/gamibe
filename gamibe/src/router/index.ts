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
