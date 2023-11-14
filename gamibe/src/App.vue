<script setup lang="ts">
import NavigationBar from '@/components/layout/NavigationBar.vue'
import HeaderWelcomeButtons from '@/components/layout/HeaderWelcomeButtons.vue'
import { RouterView } from 'vue-router'
</script>

<template>
    <HeaderWelcomeButtons
        id="header_welcome"
        class="fixed top-0 z-[9999] flex w-full justify-center px-6 pb-8 pt-5"
    />

    <div class="flex h-full w-full flex-col">
        <RouterView class="flex w-full flex-col justify-center p-6 pb-20 pt-28" />
    </div>

    <NavigationBar
        :is-mobile="false"
        class="fixed bottom-0 z-[9999] flex w-full items-center justify-center bg-blue-900 px-6"
    />
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
}

#app {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
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
