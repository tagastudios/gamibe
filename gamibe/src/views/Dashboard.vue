<template>
    <GeneralDashboard v-if="profile.settings.showGeneralDashboard" />
    <BillsDashboard v-else />
</template>

<script setup lang="ts">
import GeneralDashboard from '@/views/dashboard/GeneralDashboard.vue'
import BillsDashboard from '@/views/dashboard/BillsDashboard.vue'
import { useUser } from '@/composables/useUser'

const { profile } = useUser()
</script>
