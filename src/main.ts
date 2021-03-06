import { createApp } from 'vue'
import App from './App'
import router from './router'
import store, { key } from './store'
import Vue3TouchEvents from 'vue3-touch-events'
import runtime from 'serviceworker-webpack5-plugin/lib/runtime'

if ('serviceWorker' in navigator) {
  runtime.register()
}

createApp(App).use(store, key).use(router).use(Vue3TouchEvents).mount('#app')

// Webpack injected variables to be stored in the global scope
// Used for debugging
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __COMMIT__: string | undefined;
(window as any).__COMMIT__ = __COMMIT__;
(window as any).__VERSION__ = process.env.VERSION
