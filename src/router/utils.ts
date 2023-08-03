import { RouteLocationNormalized } from 'vue-router'

import store from '@/store'
import { getSongByStringIndex } from '@/lyrics'

/**
 * Given a list adder route, adds the list to the users lists, and redirects the user to that list.
 * Error handling is not very well implemented right now.
 * @param to The target route object.
 * @returns
 */
export function addListHandler(to: RouteLocationNormalized): string {
  // TODO: Error-handle and validate data
  // TODO: The use of store here is somewhat sketchy...
  const data = JSON.parse(to.params.data as string)
  if (typeof data.name === 'string' && typeof data.description === 'string' && Array.isArray(data.songs)) {
    const newListIndex = store.state.lists.length
    store.commit('newList')
    store.commit('setListMeta', { list: newListIndex, name: data.name, description: data.description })
    for (const songIndex of data.songs) {
      const song = getSongByStringIndex(songIndex)
      if (song !== undefined) {
        store.commit('addToList', { list: newListIndex, index: songIndex })
      } else { // TODO: Show error message when this happens (but only one per attempt, not one per song.)
        console.warn('Tried to import song with index ' + songIndex + ', but it was not found.')
      }
    }
    return '/list/' + newListIndex
  } else { // TODO: Show error message after this redirect.
    return '/'
  }
}
