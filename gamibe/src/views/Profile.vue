<script setup lang="ts">
import RadioBtnGroup from '@/components/UI/RadioBtnGroup.vue'
import { useUser } from '@/composables/useUser'

const { profile } = useUser()

const options = [
    {
        id: 'general-dashboard',
        label: 'See all info (Earnings, Savings, Transactions)',
        altLabel: ''
    },
    { id: 'bills-dashboard', label: 'See only recent bills and due payments soon', altLabel: '' }
]
</script>

<template>
    <main>
        <h1 class="m-auto text-5xl font-black">Profile</h1>
        <fieldset class="rounded-lg border-2 p-4">
            <legend>
                <h2 class="px-4 text-lg">Settings</h2>
            </legend>
            <h3>Dashboard view mode:</h3>
            <RadioBtnGroup
                v-model="profile.settings.dashboardViewMode"
                group="dashboard-view-mode"
                :options="options"
            />
        </fieldset>
    </main>
</template>
