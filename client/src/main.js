/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from 'primevue/themes/aura'
import 'primeicons/primeicons.css'

// Primevue imports
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Ripple from 'primevue/ripple'
import Message from 'primevue/message'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('Menubar', Menubar)
app.component('MainButton', Button)
app.component('InputText', InputText)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('Message', Message)

app.directive('ripple', Ripple)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  ripple: true
})

app.mount('#app')
