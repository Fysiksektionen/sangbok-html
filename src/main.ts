import { createApp } from 'vue'
import App from './App'
import router from './router'
import store, { key } from './store'
import Vue3TouchEvents from 'vue3-touch-events'

createApp(App).use(store, key).use(router).use(Vue3TouchEvents).mount('#app')
