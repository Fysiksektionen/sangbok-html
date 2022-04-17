import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router'

// Helper functions
import { getChapterFromRoute, getSongFromRoute } from '@/lyrics'
import { addListHandler } from './utils'
import store from '@/store'

// Views
import Chapters from '@/views/Chapters'
import Chapter from '@/views/Chapter'
import Song from '@/views/Song'
import Search from '@/views/Search'

// Certain components may benefit from async loading. For now (v1.0) this adds about 3 KiB to the total size (transferred)
// while reducing the entrypoint size by about 30 KiB. Hence the difference is pretty negligible for now, especially since
// all users will use the Song component, and most will use the Search component.

const routes: Array<RouteRecordRaw> = [
  //
  // Chapter views
  //
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
    path: '/chapter/:chapterIndex',
    name: 'ChapterByIndex',
    component: Chapter
  },
  //
  // Song views
  //
  {
    path: '/chapter/:chapterId(\\d+)/song/:songId(\\d+)',
    name: 'Song',
    component: Song
  },
  {
    path: '/chapter/:chapterIndex(.+)/song/:songId(\\d+)',
    name: 'SongByChapterIndex',
    component: Song
  },
  {
    path: '/song/:songIndex',
    name: 'SongByIndex',
    component: Song
  },
  {
    path: '/list/:listId(\\d+)/song/:songId(\\d+)',
    name: 'SongFromList',
    component: Song
  },
  //
  // Search view
  //
  {
    path: '/search/:query',
    name: 'Search',
    component: Search
  },
  //
  // List views
  //
  {
    path: '/list/:listId(\\d+)',
    name: 'List',
    component: () => import(/* webpackChunkName: "listview" */ '../views/List')
  },
  {
    path: '/list/',
    name: 'Lists',
    component: () => import(/* webpackChunkName: "listsview" */ '../views/Lists')
  },
  {
    path: '/list/add/:data(.+)',
    name: 'AddList',
    redirect: addListHandler
  },
  //
  // Other
  //
  { // Redirect 404:s to the start page.
    path: '/:pathMatch(.*)*',
    redirect: '/',
    name: 'Unmatched'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guards. Prevents navigation to things that do not exist.
router.beforeEach((to: RouteLocationNormalized) => {
  if (to.name?.toString().startsWith('Chapter')) {
    return getChapterFromRoute(to) === undefined ? '/' as RouteLocationRaw : undefined
  } else if (to.name?.toString().startsWith('Song')) {
    return getSongFromRoute(to) === undefined ? '/' as RouteLocationRaw : undefined
  } else if (to.name === 'List') {
    if (parseInt(to.params.listId as string) >= store.state.lists.length) { return '/' as RouteLocationRaw }
  } else if (['Home', 'Lists', 'Search'].indexOf(to.name ? to.name.toString() : '') !== -1) {
    /* Ignore. These can always be shown. */
  } else {
    console.warn('Route ' + (to.name && to.name.toString()) + ' has no navigation guard.')
  }
})

export default router
