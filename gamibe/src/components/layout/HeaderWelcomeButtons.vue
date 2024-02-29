<template>
    <header v-if="isCreateRoute" class="items-center justify-between pb-14 pt-10">
        <div
            @click="router.back"
            class="active:tbg-zinc-200 relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-zinc-100 transition-colors hover:bg-zinc-300"
        >
            <ChevronLeftIcon class="absolute left-[-1px] w-full text-slate-600" />
        </div>
        <p class="tracking-wide">{{ currentStep }} of {{ maxSteps }}</p>
        <div></div>
    </header>
    <header v-else class="items-center justify-between">
        <div class="flex items-center">
            <UserCircleIcon class="w-14 rounded-full bg-blue-900 shadow-inner" />
            <div class="ml-5">
                <h3 class="text-2xl font-bold">Welcome John</h3>
                <p class="text-lg">Your finances are looking good!</p>
            </div>
        </div>
        <div class="flex select-none items-center gap-5">
            <RouterLink to="/create">
                <PlusIcon
                    class="w-6 cursor-pointer transition-colors hover:text-blue-900 active:text-blue-700"
                />
            </RouterLink>
            <MagnifyingGlassIcon
                class="w-6 transition-colors hover:text-blue-900 active:text-blue-700"
            />
            <component
                :is="hasNotifications ? BellAlertIcon : BellIcon"
                class="w-6 transition-colors hover:text-blue-900 active:text-blue-700"
            />
        </div>
    </header>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
    PlusIcon,
    MagnifyingGlassIcon,
    BellIcon,
    BellAlertIcon,
    ChevronLeftIcon,
    UserCircleIcon
} from '@heroicons/vue/24/solid'
import { ref, computed } from 'vue'

const hasNotifications = ref(false)

const route = useRoute()
const router = useRouter()

const isCreateRoute = computed(() => route.matched.find((match) => match.name === 'Create'))

const currentStep = computed(() => {
    const currentPath = route.matched.find((match) => match.name === route.name)?.path ?? ''
    return currentPath.split('/').length - 1
})
const maxSteps = 3
</script>
