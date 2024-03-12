import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard,
            meta: { requiresAuth: true }
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
            ],
            meta: { requiresAuth: true }
        },
        {
            path: '/charts',
            name: 'Charts',
            component: () => import('@/views/Charts.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/calendar',
            name: 'Calendar',
            component: () => import('@/views/Calendar.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/social',
            name: 'Social',
            component: () => import('@/views/Social.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('@/views/Profile.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('@/views/Register.vue')
        },
        {
            path: '/:pathMatch(.*)*', // 404
            name: 'NotFound',
            component: () => import('@/views/NotFound.vue')
        }
    ]
})

router.beforeEach(async (to) => {
    // routes with `meta: { requiresAuth: true }` will check for
    // the users, others won't
    if (to.meta.requiresAuth) {
        const currentUser = await getCurrentUser()
        // if the user is not logged in, redirect to the login page
        if (!currentUser) {
            return {
                path: '/login',
                query: {
                    // we keep the current path in the query so we can
                    // redirect to it after login with
                    // `router.push(route.query.redirect || '/')`
                    redirect: to.fullPath
                }
            }
        }
    }
})

export default router
