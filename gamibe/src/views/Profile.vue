<script setup lang="ts">
import { ref } from 'vue'
import { useWebNotification } from '@vueuse/core'
import type { UseWebNotificationOptions } from '@vueuse/core'
import RadioBtnGroup from '@/components/UI/RadioBtnGroup.vue'
import { useUser } from '@/composables/useUser'

const { profile } = useUser()

const options = [
    {
        id: 'general-dashboard',
        label: 'See all info (Earnings, Savings, Transactions)',
        altLabel: ''
    },
    { id: 'bills-dashboard', label: 'See only recent bills and due payments soon', altLabel: '' },
    { id: 'bills-and-earnings-dashboard', label: 'See All Bills and Earnings' }
]

const notificacionLabel = ref('')
const notificationLoading = ref(false)

const baseOptions: UseWebNotificationOptions = {
    title: 'Original Test',
    body: '',
    dir: 'auto',
    lang: 'en',
    tag: 'test',
    icon: '',
    renotify: true,
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    requestPermissions: true
}

const {
    isSupported,
    notification,
    ensurePermissions,
    permissionGranted,
    show,
    close,
    onClick,
    onShow,
    onError,
    onClose
} = useWebNotification(baseOptions)

const not1 = {
    ...baseOptions,
    title: 'Hello World!',
    body: 'This is the first notification',
    icon: 'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-light-512.png'
}

const handleNotification = (hasWorker: boolean) => {
    if (hasWorker) {
        // console.log('Creating notification with worker...')
        // const worker = new Worker(new URL('@/workers/notification.worker.ts', import.meta.url))
        // worker.postMessage({ label: notificacionLabel.value })
        // worker.onmessage = (e) => {
        //     console.log('Worker response:', e.data)
        //     notificacionLabel.value = ''
        // }
        notificacionLabel.value = ''
    } else {
        notificationLoading.value = true
        show()
        setTimeout(() => {
            not1.title = notificacionLabel.value
            not1.tag = Math.random().toString()
            const notificationAPI = useWebNotification(not1)
            notificationAPI.show()
            notificacionLabel.value = ''
            notificationLoading.value = false
        }, 1000 * 5)
    }
}

const isUAT = true
// const isUAT = import.meta.env.VITE_APP_ENV === 'uat'
</script>

<template>
    <main>
        <h1 class="sr-only m-auto text-5xl font-black">Profile</h1>
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
        <fieldset v-if="isUAT" class="mt-4 rounded-lg border-2 p-4">
            <legend>
                <h2 class="px-4 text-lg">Test</h2>
            </legend>
            <h3>Create a Notification:</h3>
            <p>Are Notifications Supported: {{ isSupported }}</p>
            <p>Are Notifications Permission Granted: {{ permissionGranted }}</p>
            <button
                v-if="!permissionGranted && isSupported"
                @click="ensurePermissions()"
                class="mt-2 w-full rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 active:bg-blue-800"
            >
                Ensure Permissions
            </button>
            <input
                :disabled="notificationLoading"
                type="text"
                name="notificacionLabel"
                id="notificacionLabel"
                class="mt-2 w-full rounded-lg border-2 p-2 text-black"
                v-model="notificacionLabel"
            />
            <button
                @click="handleNotification(false)"
                class="mt-2 w-full rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 active:bg-blue-800"
            >
                Without Worker > 1min > Hello World!
            </button>
            <button
                @click="handleNotification(true)"
                class="mt-2 w-full rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 active:bg-blue-800"
            >
                Worker > 1min > Hello World!
            </button>
        </fieldset>
    </main>
</template>
