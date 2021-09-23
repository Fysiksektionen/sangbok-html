import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import Chapters from '../views/Chapters.vue'
import Chapter from '../views/Chapter.vue'
import Song from '../views/Song.vue'
import Search from '../views/Search.vue'
import { chapters } from '@/utils/lyrics'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Chapters
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
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: Search
  },
  { path: '/:pathMatch(.*)*', redirect: '/' } // Redirect 404:s to the start page.
]

// for route level code-splitting
// that generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited, use the below code in the routes constant above.
// component: () => import('../views/Generator.vue')

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
