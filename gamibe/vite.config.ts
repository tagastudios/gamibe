import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({ script: { defineModel: true } }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
                cleanupOutdatedCaches: false
            },
            manifest: {
                name: 'Gamibe',
                short_name: 'Gamibe',
                description: 'Gamify your personal finances!',
                theme_color: '#181818',
                background_color: '#181818',
                display: 'standalone',
                start_url: '/',
                icons: [
                    {
                        src: '/logo_192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/logo_256.png',
                        sizes: '256x256',
                        type: 'image/png'
                    },
                    {
                        src: '/logo_384.png',
                        sizes: '384x384',
                        type: 'image/png'
                    },
                    {
                        src: '/logo_512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
