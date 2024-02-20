import { createApp } from 'vue'
import App from './App'
import router from './router'
import store, { key } from './store'
import Vue3TouchEvents from 'vue3-touch-events'

// TODO: We use any here for now, but this is not ideal. This is due the package not being updated, see https://github.com/robinrodricks/vue3-touch-events/issues/39.
createApp(App).use(store, key).use(router).use<any>(Vue3TouchEvents, { dragFrequency: 50 }).mount('#app')
