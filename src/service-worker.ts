import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'

//
// Cache rules
//

// TODO: Make NetworkFirst work with precaching (issue #39)
// registerRoute(
//   ({ url }: RouteMatchCallbackOptions) => { // The precached version doesn't end up here...
//     const isIndex = url.pathname.endsWith('index.html') || url.pathname.endsWith('/')
//     console.log(isIndex, url.href)
//     return isIndex
//   },
//   new NetworkFirst({ cacheName: 'index', plugins: [new ExpirationPlugin({ maxEntries: 2 })] })
// )

// These are hashed, hence we don't need to refresh them from the server every time.
registerRoute(/\.(js|css)$/, new CacheFirst({ cacheName: 'essentials', plugins: [new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })] }))

// Images may be updated, but it's not very urgent
registerRoute(
  /img\/.*\.(?:png|gif|jpg|jpeg|svg)$/,
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 24 * 60 * 60 })]
  })
)

// Sheet music may be updated, but it's not very urgent. We also don't want to store a lot of these, since they take up a fair bit of space.
registerRoute(
  /msvg\/.*\.(?:png|gif|jpg|jpeg|svg)$/,
  new StaleWhileRevalidate({
    cacheName: 'sheetmusic',
    plugins: [new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 })]
  })
)

//
// Pre-caching
//
// Pre-cached files always use CacheFirst, unless some other route matches it before.
// The way we use things now, however, the precached files generally don't overlap with the routes above, since any mismatch/unintentional duplicate can cause unexpected behavior
// (Such as the pre-cache being used instead of NetworkFirst, etc.)

// Make TypeScript less grumpy
declare const self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)
