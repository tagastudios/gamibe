<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { useUser } from '@/composables/useUser'

import HeaderWelcomeButtons from '@/components/layout/HeaderWelcomeButtons.vue'
import TabBar from '@/components/layout/TabBar.vue'

const { user } = useUser()
const router = useRouter()
const route = useRoute()

const isCurrentRouteAuthenticated = (_route: any) => {
    const requiresAuth = 'requiresAuth'
    return Object.keys(_route.meta).some((meta: string) => meta === requiresAuth)
}

const isCreateRoute = computed(() => route.matched.find((match) => match.name === 'Create'))

watch(user, async (currentUser, previousUser) => {
    // redirect to login if they logout and the current
    // route is only for authenticated users
    if (!currentUser && previousUser && isCurrentRouteAuthenticated(route)) {
        return router.push({
            path: '/login',
            query: {
                redirect: '/'
            }
        })
    }
    // redirect the user if they are logged in but were
    // rejected because the user wasn't ready yet, logged in
    // then got back to this page
    if (currentUser && typeof route.query.redirect === 'string') {
        return router.push(route.query.redirect)
    }
})

const isMobile = true
const filterIsOpen = ref(false)
</script>

<template>
    <HeaderWelcomeButtons
        v-if="user"
        id="header_welcome"
        class="fixed top-0 z-[9999] flex w-full select-none justify-center px-6 pb-8 pt-5 text-sm md:text-base lg:text-lg xl:text-xl"
    />

    <div class="flex w-full flex-col">
        <RouterView
            class="flex h-full w-full select-none flex-col justify-center p-6 text-sm transition-all delay-100 duration-700 md:text-base lg:text-lg xl:text-xl"
            :class="`${isCreateRoute ? 'pt-16' : 'pt-[90px]'} ${
                filterIsOpen ? 'pb-36' : isCreateRoute ? 'pb-10' : 'pb-20'
            }`"
        />
    </div>

    <TabBar
        v-if="user && isMobile"
        @filterStatusChanged="filterIsOpen = $event"
        class="fixed bottom-0 z-[9999] select-none"
    />
    <!-- INSERT ANOTHER COMPONENT MAYBE SIDE BAR when isMobile is false -->
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
* {
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

html,
body,
#app {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

#app {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow-y: auto;
}

#header_welcome {
    background: var(--color-background);
    background: linear-gradient(
        0deg,
        rgba(23, 23, 23, 0) 0%,
        rgba(23, 23, 23, 0.6) 20%,
        rgba(23, 23, 23, 0.95) 50%,
        rgba(23, 23, 23, 1) 100%
    );
}
</style>
