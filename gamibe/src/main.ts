import './assets/main.css'

// Libs
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

// Custom
import App from './App.vue'
import router from './router'
import { firebaseApp } from './configs/firebase'
import Notifications from '@/plugins/notifications'
import Icons from '@/plugins/icons'

// App Setup
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
})
app.use(VCalendar, {})
app.use(Notifications)
app.use(Icons)

app.mount('#app')
