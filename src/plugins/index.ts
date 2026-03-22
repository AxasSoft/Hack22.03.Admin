/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import createVuetify from './vuetify'
import { createPinia } from 'pinia'
import router from '@/router'
import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// Use the plugin
pinia.use(piniaPluginPersistedstate)

export function registerPlugins(app: App) {
  app.use(createVuetify).use(router).use(createPinia()).use(pinia)
}
