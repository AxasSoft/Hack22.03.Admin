import './assets/main.css'

import { registerPlugins } from '@/plugins/index'
// import router from '@/router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
// Composables
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'

const app = createApp(App)
const options = {
  position: POSITION.TOP_RIGHT,
}

app.use(Toast, options).use(PrimeVue)
registerPlugins(app)

app.mount('#app')
