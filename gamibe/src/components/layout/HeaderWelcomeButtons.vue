<template>
    <header class="item items-center justify-between">
        <div class="flex items-center">
            <img alt="Vue logo" class="rounded-full bg-blue-900" src="@/assets/person.svg" />
            <div class="ml-5">
                <h3 class="text-2xl font-bold">Welcome John</h3>
                <p class="text-lg">Your finances are looking good!</p>
            </div>
        </div>
        <div class="flex select-none items-center gap-5">
            <PlusIcon class="w-6 transition-colors hover:text-blue-900 active:text-blue-700" />
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
import { PlusIcon, MagnifyingGlassIcon, BellIcon, BellAlertIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
const hasNotifications = ref(false)
</script>

<style scoped></style>
