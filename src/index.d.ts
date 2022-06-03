// General TypeScript Declarations

// .vue files
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Convince TypeScript that importing images is perfectly fine.
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'

// Taken from @types/serviceworker-webpack-plugin/lib/runtime
declare module 'serviceworker-webpack5-plugin/lib/runtime' {
  export interface ServiceWorkerWebpackPluginRuntime {
      /**
       * Register the service worker registered using serviceworker-webpack-plugin.
       *
       * @param options Forwarded to `navigator.serviceWorker.register()`
       * @returns A promise if the runtime supports service workers, otherwise false.
       */
      register(options?: RegistrationOptions): false | Promise<ServiceWorkerRegistration>
  }
  declare const runtime: ServiceWorkerWebpackPluginRuntime
  export default runtime
}
