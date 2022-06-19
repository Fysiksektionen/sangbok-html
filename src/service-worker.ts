import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, PrecacheEntry } from 'workbox-precaching'

// Commit id. Injected by webpack
declare const __COMMIT__: string

// TODO: Find a non-global way of doing this
// eslint-disable-next-line
const assets = ((global as any).serviceWorkerOption.assets as string[]).map((url) => {
  return {
    url,
    // Disable revision caching in development mode
    revision: ((process.env.NODE_ENV !== 'development') && __COMMIT__) || undefined
  } as PrecacheEntry
})

//
// Regexes
//
const indexRE = /index\.html$/
const swRE = /sw\.js$/
const essentialsRE = /\.(js|css)$/
const mainImagesRE = /img\/.*\.(?:png|gif|jpg|jpeg|svg)$/
const msvgRE = /msvg\/.*\.(?:png|gif|jpg|jpeg|svg)$/

//
// Cache rules
//

// If the index.html is updated, the essentials will be updated due to them having a new hash.
registerRoute(
  indexRE,
  new NetworkFirst({
    cacheName: 'index',
    plugins: [new ExpirationPlugin({ maxEntries: 1 })]
  })
)

// Always try to update the service worker (TODO: Check if this works as intended)
registerRoute(
  swRE,
  new NetworkFirst({
    cacheName: 'sw',
    plugins: [new ExpirationPlugin({ maxEntries: 1 })]
  })
)

// These are hashed, hence we don't need to refresh them from the server every time.
registerRoute(
  essentialsRE,
  new CacheFirst({
    cacheName: 'essentials',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 })]
  })
)

// Images may be updated, but it's not very urgent
registerRoute(
  mainImagesRE,
  new StaleWhileRevalidate({
    cacheName: 'main-images',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 })]
  })
)

// Sheet music may be updated, but it's not very urgent. We also don't want to store a lot of these, since they take up a fair bit of space.
registerRoute(
  msvgRE,
  new StaleWhileRevalidate({
    cacheName: 'sheetmusic',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 6 * 60 * 60 // 6 Hours
      })
    ]
  })
)

//
// Pre-caching
//
const index = assets.filter((el) => indexRE.test(el.url))
precacheAndRoute(index)
if (index.length === 0) { console.warn('No index files was found. This will lead to improper caching, but usually resolve when the devServer is restarted.') }

const essentials = assets.filter((el) => essentialsRE.test(el.url))
precacheAndRoute(essentials)
if (essentials.length === 0) { console.warn('No essential files were found. This will lead to improper caching, but usually resolve when the devServer is restarted.') }

const mainImages = assets.filter((el) => mainImagesRE.test(el.url))
precacheAndRoute(mainImages)
if (mainImages.length === 0) { console.warn('No mainImages were found. This will lead to improper caching, but usually resolve when the devServer is restarted.') }
