import { SongIndex2 } from '@/lyrics'
// import { Mutation } from 'vuex'

export type SongList = {
  name: string,
  description: string,
  songs: SongIndex2[],
}

export const listsModule = {
  state: [] as SongList[],
  getters: {
    hasLists: (state: SongList[]): boolean => {
      for (const list of state) {
        if (list.songs.length > 0) return true
      } return false
    }
  },
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
    newList (state: SongList[]): void {
      state.push({
        name: 'Lista ' + (state.length + 1), description: '', songs: []
      })
    },
    moveList: (state: SongList[], { index, direction }: {index: number, direction: number }): void => {
      // TODO: Can probably be done more elegantly.
      if (index + direction < 0 || index + direction > state.length - 1) {
        return
      }
      const temp = state[index]
      state[index] = state[index + direction]
      state[index + direction] = temp
    }
  } // as { [key: string]: Mutation<any> }
}
