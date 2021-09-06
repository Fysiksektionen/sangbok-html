import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Chapters from '../views/Chapters.vue'
import Chapter from '../views/Chapter.vue'
import Song from '../views/Song.vue'
import Search from '../views/Search.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Chapters
  },
  {
    path: '/chapter/:id',
    name: 'Chapter',
    component: Chapter
  },
  {
    path: '/chapter/:chapterId/song/:songId',
    name: 'Song',
    component: Song
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: Search
  },
  { path: '/search/', redirect: '/' }/* Redirect empty searches back to the start page. */
]

// for route level code-splitting
// that generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited, use the below code in the routes constant above.
// component: () => import('../views/Generator.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
