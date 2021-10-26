import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router'

import Chapters from '../views/Chapters.vue'
import Chapter from '../views/Chapter.vue'
import Song from '../views/Song.vue'
import Search from '../views/Search.vue'

import { getChapterFromRoute, getSongByStringIndex, getSongFromRoute } from '@/lyrics'
import store from '@/store'

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
  {
    path: '/list/add/:data(.+)',
    name: 'AddList',
    redirect: to => {
      // TODO: Error-handle and validate data
      // TODO: The use of store here is somewhat sketchy...
      const data = JSON.parse(to.params.data as string)
      if (typeof data.name === 'string' && typeof data.description === 'string' && Array.isArray(data.songs)) {
        const i = store.state.lists.length
        store.commit('newList')
        store.commit('setListMeta', { list: i, name: data.name, description: data.description })
        for (const song of data.songs) {
          const s = getSongByStringIndex(song)
          if (s !== undefined) {
            store.commit('addToList', { list: i, index: song })
          } else { // TODO: Show error message when this happens (but only one per attempt, not one per song.)
            console.warn('Tried to import song with index ' + song + ', but it was not found.')
          }
        }
        return '/list/' + i
      } else { // TODO: Show error message after this redirect.
        return '/'
      }
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

router.beforeEach((to: RouteLocationNormalized) => {
  if (to.name?.toString().startsWith('Chapter')) {
    return getChapterFromRoute(to) === undefined ? '/' as RouteLocationRaw : undefined
  } else if (to.name?.toString().startsWith('Song')) {
    return getSongFromRoute(to) === undefined ? '/' as RouteLocationRaw : undefined
  } else if (to.name === 'List') {
    if (parseInt(to.params.listId as string) >= store.state.lists.length) { return '/' as RouteLocationRaw }
  } else if (['Home', 'Lists', 'Search'].indexOf(to.name ? to.name.toString() : '') !== -1) {
    /* Ignore */
  } else {
    console.warn('Route ' + (to.name && to.name.toString()) + ' has no navigation guard.')
  }
})

export default router
