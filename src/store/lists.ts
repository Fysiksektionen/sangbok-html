import { SongIndex2 } from '@/utils/lyrics'
import { Mutation } from 'vuex'

export type SongList = {
  name: string,
  description: string,
  songs: SongIndex2[],
}

export const listsModule = {
  state: [{
    name: 'Lista 1',
    description: '',
    songs: ['α2']
  }] as SongList[],
  getters: {},
  mutations: {
    addToList: (state: SongList[], { list, index }: {list: number, index: SongIndex2}): void => {
      console.log(list)
      console.log(state)
      state[list].songs.indexOf(index) === -1 && state[list].songs.push(index)
    },
    deleteFromList: (state: SongList[], { list, index }: {list: number, index: number}): void => {
      state[list].songs.splice(index, 1)
    },
    moveInList: (state: SongList[], { list, index, direction }: {list: number, index: number, direction: number }): void => {
      // TODO: Can probably be done more elegantly.
      if (index + direction < 0 || index + direction > state[list].songs.length - 1) {
        return
      }
      const temp = state[list].songs[index]
      state[list].songs[index] = state[list].songs[index + direction]
      state[list].songs[index + direction] = temp
    },
    setListMeta: (state: SongList[], { list, name, description }: {list: number, name: string, description: string }): void => {
      state[list].name = name
      state[list].description = description
      console.log('SLM')
    },
    deleteList (state: SongList[], list: number): void {
      state.splice(list, 1)
    },
    newList (state: SongList[], list: number): void {
      state.push({
        name: 'Lista ' + (state.length + 1), description: '', songs: []
      })
    }
  } as { [key: string]: Mutation<any> }
}
