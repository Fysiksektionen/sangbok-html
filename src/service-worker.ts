import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, PrecacheEntry } from 'workbox-precaching'

// Commit id. Injected by webpack
declare const __COMMIT__: string

// TODO: Find a non-global way of doing this
// eslint-disable-next-line
const assets = ((global as any).serviceWorkerOption.assets as string[]).map((url) => {
  return {
    url: url,
    // Disable revision caching in development mode
    revision: ((process.env.NODE_ENV !== 'development') && __COMMIT__) || undefined
  } as PrecacheEntry
})

//
// Regexes
//
const essentialsRE = /\.(html|js|css)$/
const mainImagesRE = /img\/.*\.(?:png|gif|jpg|jpeg|svg)$/
const msvgRE = /msvg\/.*\.(?:png|gif|jpg|jpeg|svg)$/

//
// Pre-caching
//
const essentials = assets.filter((el) => essentialsRE.test(el.url))
precacheAndRoute(essentials)
if (essentials.length === 0) { console.warn('No essential files were found. This will lead to improper caching, but usually resolve when the devServer is restarted.') }

const mainImages = assets.filter((el) => mainImagesRE.test(el.url))
precacheAndRoute(mainImages)
if (mainImages.length === 0) { console.warn('No mainImages were found. This will lead to improper caching, but usually resolve when the devServer is restarted.') }

//
// Cache rules
//
registerRoute(
  essentialsRE,
  new StaleWhileRevalidate({
    cacheName: 'essentials',
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })
    ]
  })
)

registerRoute(
  mainImagesRE,
  new StaleWhileRevalidate({
    cacheName: 'main-images',
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })
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
