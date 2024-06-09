/* eslint-disable vue/multi-word-component-names */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/mdc-dark-deeppurple/theme.css'

// Primevue imports
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Ripple from 'primevue/ripple'
import Message from 'primevue/message'
import Checkbox from 'primevue/checkbox'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Menu from 'primevue/menu'

import Password from 'primevue/password'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('Menubar', Menubar)
app.component('MainButton', Button)
app.component('InputText', InputText)
app.component('Badge', Badge)
app.component('Avatar', Avatar)
app.component('Message', Message)
app.component('Password', Password)
app.component('Checkbox', Checkbox)
app.component('Card', Card)
app.component('MainDialog', Dialog)
app.component('Toast', Toast)
app.component('MainMenu', Menu)

app.directive('ripple', Ripple)

app.use(createPinia())
app.use(router)
app.use(ToastService)

app.use(PrimeVue, {
  inputStyle: 'outlined',
  ripple: true
})

app.mount('#app')
