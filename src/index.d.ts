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
