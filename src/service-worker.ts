import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const self: any

//
// Regexes
//
const mainImagesRE = /img\/.*\.(?:png|gif|jpg|jpeg|svg)$/
const msvgRE = /msvg\/.*\.(?:png|gif|jpg|jpeg|svg)$/

//
// Cache rules
//

// If the index.html is updated, the essentials will be updated due to them having a new hash.
registerRoute(/index\.html/, new NetworkFirst({ cacheName: 'index' }))

// These are hashed, hence we don't need to refresh them from the server every time.
registerRoute(
  /\.(js|css)$/,
  new CacheFirst({ cacheName: 'essentials', plugins: [new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })] })
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
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
)

//
// Pre-caching
//

precacheAndRoute(self.__WB_MANIFEST)
