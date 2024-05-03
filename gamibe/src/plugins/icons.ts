import type { App } from 'vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'

// List of icons
// Search on: https://oh-vue-icons.js.org/
import { FaFacebookF, BiGoogle, BiApple, BiDiscord, HiChevronLeft } from 'oh-vue-icons/icons'

// Add the icons to the library
addIcons(FaFacebookF, BiGoogle, BiApple, BiDiscord, HiChevronLeft)

// To use the icons, add the following to your template:
// <v-icon name="bi-google" />
// <v-icon name="fa-facebook-f" />

export default {
    install: (app: App) => {
        app.component('v-icon', OhVueIcon)
    }
}
