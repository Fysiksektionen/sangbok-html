import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import Chapters from '../views/Chapters.vue'
import Chapter from '../views/Chapter.vue'
import Song from '../views/Song.vue'
import Search from '../views/Search.vue'
import { chapters, getChapterByStringIndex, getSongByStringIndex } from '@/lyrics'

// Certain components may benefit from async loading. For now (v1.0) this adds about 3 KiB to the total size (transferred)
// while reducing the entrypoint size by about 30 KiB. Hence the difference is pretty negligible for now, especially since
// all users will use the Song component, and most will use the Search component.

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
    path: '/chapter/:chapterIndex',
    name: 'ChapterByIndex',
    component: Chapter
  },
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
    path: '/search/:query',
    name: 'Search',
    component: Search
  },
  {
    path: '/list/:listId(\\d+)',
    name: 'List',
    component: () => import(/* webpackChunkName: "listview" */ '../views/List.vue')
  },
  {
    path: '/list/',
    name: 'Lists',
    component: () => import(/* webpackChunkName: "listsview" */ '../views/Lists.vue')
  },
  {
    path: '/list/:listId(\\d+)/song/:songId(\\d+)',
    name: 'SongFromList',
    component: Song
  },
  {
    path: '/chapter/list/:listId(\\d+)/song/:songId(\\d+)',
    name: 'ListRedirect',
    redirect: to => { // TODO: Replace
      console.warn('ListRedirect is an ugly solution, and should be replaced. It causes back-button bugs.')
      return '/list/' + to.params.listId + '/song/' + to.params.songId
    }
  },
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

// TODO: Add navigation guard for lists
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
  } else if (to.name === 'SongByIndex') {
    const song = getSongByStringIndex(to.params.songIndex as string)
    if (!song) {
      console.warn(`Song ${to.params.songIndex} not found. Redirecting to home.`)
      return '/' as RouteLocationRaw
    }
  } else if (to.name === 'ChapterByIndex') {
    const chapter = getChapterByStringIndex(to.params.chapterIndex as string)
    if (!chapter) {
      console.warn(`Chapter ${to.params.chapterIndex} not found. Redirecting to home.`)
      return '/' as RouteLocationRaw
    }
  } else if (to.name === 'SongByChapterIndex') {
    const chapter = getChapterByStringIndex(to.params.chapterIndex as string)
    if (!chapter) {
      console.warn(`Chapter ${to.params.chapterIndex} not found. Redirecting to home.`)
      return '/' as RouteLocationRaw
    }
    const sid = parseInt(to.params.songId as string)
    if (sid >= chapter.songs.length) {
      console.warn(`Song id ${sid} is too large for chapter ${chapter.prefix}. Redirecting to home.`)
      return '/' as RouteLocationRaw
    }
  } else if (['Home'].indexOf(to.name ? to.name.toString() : '') !== -1) { /* Ignore */ } else {
    console.warn('Route ' + (to.name && to.name.toString()) + ' has no navigation guard.')
  }
})

export default router
