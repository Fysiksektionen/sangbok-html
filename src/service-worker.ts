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
const essentialsRE = /\.(js|css)$/
const mainImagesRE = /img\/.*\.(?:png|gif|jpg|jpeg|svg)$/
const msvgRE = /msvg\/.*\.(?:png|gif|jpg|jpeg|svg)$/

//
// Cache rules
//
registerRoute(
  essentialsRE,
  new NetworkFirst({
    cacheName: 'index',
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 12 * 60 * 60 })
    ]
  })
)

registerRoute(
  essentialsRE,
  new CacheFirst({
    cacheName: 'essentials',
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 4 * 60 * 60 })
    ]
  })
)

registerRoute(
  mainImagesRE,
  new StaleWhileRevalidate({
    cacheName: 'main-images',
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
)

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
