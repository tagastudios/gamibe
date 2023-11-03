<template>
    <nav v-if="isMobile" aria-label="mobile-menu"></nav>
    <nav v-else aria-label="web-menu">
        <ul class="flex w-full select-none list-none justify-center gap-6 text-xl">
            <RouterLink
                v-slot="{ href, route, navigate, isActive, isExactActive }"
                :to="tab"
                :key="tab"
                custom
                v-for="tab in tabPaths"
            >
                <li
                    :class="`p-5 ${
                        isActive
                            ? 'font-black text-emerald-400'
                            : 'text-white hover:text-emerald-600 active:font-bold active:text-emerald-400'
                    }`"
                >
                    <a :href="href" @click="navigate">{{ route.name }}</a>
                </li>
            </RouterLink>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
const tabPaths = ['/', '/charts', '/social', '/profile']
const props = defineProps({
    isMobile: Boolean
})
</script>
