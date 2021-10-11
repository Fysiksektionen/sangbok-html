import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import Chapters from '../views/Chapters.vue'
import Chapter from '../views/Chapter.vue'
import Song from '../views/Song.vue'
import Search from '../views/Search.vue'
import { chapters } from '@/utils/lyrics'

// Certain components may benefit from async loading. For now (v1.0) this adds about 3 KiB to the total size (transferred)
// while reducing the entrypoint size by about 30 KiB. Hence the difference is pretty negligible for now, especially since
// all users will use the Song component, and most will use the Search component.
// import { defineAsyncComponent } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Chapters,
    meta: { hideBackButton: true }
  },
  {
    path: '/chapter/:cid(\\d+)',
    name: 'Chapter',
    component: Chapter
  },
  {
    path: '/chapter/:chapterId(\\d+)/song/:songId(\\d+)',
    name: 'Song',
    component: Song
    // component: defineAsyncComponent(() => import(/* webpackChunkName: "songview", webpackPreload: true */ '../views/Song.vue'))
  },
  {
    path: '/song/:songIndex',
    name: 'SongByIndex',
    component: Song
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: Search
    // component: defineAsyncComponent(() => import(/* webpackChunkName: "searchview", webpackPreload: true */ '../views/Search.vue'))
  },
  { path: '/:pathMatch(.*)*', redirect: '/' } // Redirect 404:s to the start page.
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to: RouteLocationNormalized) => {
  if (to.name === 'Chapter') {
    const cid = parseInt(to.params.cid as string)
    if (cid >= chapters.length) {
      console.warn(`Chapter id ${cid} is too large. Redirecting to home.`)
      return '/' as RouteLocationRaw
    }
  } else if (to.name === 'Song') {
    const cid = parseInt(to.params.chapterId as string)
    const sid = parseInt(to.params.songId as string)
    if (cid >= chapters.length || sid >= chapters[cid].songs.length) {
      console.warn(`Chapter id ${cid} or song id ${sid} is too large. Redirecting to home.`)
      return '/' as RouteLocationRaw
    }
  }
})

export default router
