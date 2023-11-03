import './assets/main.css'

// Libs
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import VueDragscroll from 'vue-dragscroll'

// Custom
import App from './App.vue'
import router from './router'
import { firebaseApp } from './configs/firebase'

// App Setup
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
        // we will see other modules later on
        VueFireAuth()
    ]
})
app.use(VueDragscroll)

app.mount('#app')
