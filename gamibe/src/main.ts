import './assets/main.css'

// Libs
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import VueDragscroll from 'vue-dragscroll'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

// Custom
import App from './App.vue'
import router from './router'
import { firebaseApp } from './configs/firebase'

// App Setup
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()]
})
app.use(VueDragscroll)
app.use(VCalendar, {})

app.mount('#app')
