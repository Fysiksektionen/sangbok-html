import { SongIndex, getSongByStringIndex } from '@/lyrics'
// import { Mutation } from 'vuex'

/** Represents a list of songs, identified by their string index. The list has a name and a description. */
export type SongList = {
  name: string,
  description: string,
  songs: SongIndex[]
}

/** Store module for handling SongLists. */
export const listsModule = {
  state: [] as SongList[],
  getters: {
    /**
     *
     * @param state The storage state. Not passed manually.
     * @returns a boolean indicating whether there is any non-empty user-lists or not.
     */
    hasLists: (state: SongList[]): boolean => {
      for (const list of state) {
        if (list.songs.length > 0) return true
      } return false
    }
  },
  mutations: {
    /**
     * Adds a song given by `index` to the list indexed by the parameter `list`.
     * Note that the `list` and `index` arguments are passed as a dictionary.
     * @param state The storage state. Not passed manually.
     * @param list The list index.
     * @param index The song string index.
     */
    addToList: (state: SongList[], { list, index }: { list: number, index: SongIndex }): void => {
      if (getSongByStringIndex(index) !== undefined &&
          state.length > list && list >= 0 &&
          state[list].songs.indexOf(index) === -1
      ) {
        state[list].songs.push(index)
      }
    },
    /**
     * Deletes a song given by `index` from the list indexed by the parameter `list`.
     * Note that the `list` and `index` arguments are passed as a dictionary.
     * @param state The storage state. Not passed manually.
     * @param list The list index.
     * @param index The song string index.
     */
    deleteFromList: (state: SongList[], { list, index }: { list: number, index: number }): void => {
      if (state.length > list && list >= 0) {
        state[list].songs.splice(index, 1)
      }
    },
    /**
     * Moves a song at position `index` in the list indexed by the parameter `list`, by `direction` steps.
     * Note that the `list`, `index`, and `direction` arguments are passed as a dictionary.
     * @param state The storage state. Not passed manually.
     * @param list The list index.
     * @param index The index of the song in the list.
     * @param direction The direction to move the song in. -1 moves it closer to the top, and 1 closer to the bottom.
     */
    moveInList: (state: SongList[], { list, index, direction }: { list: number, index: number, direction: number }): void => {
      if (state.length > list && list >= 0 && (index + direction >= 0 && index + direction < state[list].songs.length)) {
        [state[list].songs[index], state[list].songs[index + direction]] = [state[list].songs[index + direction], state[list].songs[index]]
      }
    },
    /**
     * Sets the name and description of the list with index `list`.
     * Note that the `list`, `name`, and `description` arguments are passed as a dictionary.
     * @param state The storage state. Not passed manually.
     * @param list The list index.
     * @param name The index of the song in the list.
     * @param description The index of the song in the list.
     */
    setListMeta: (state: SongList[], { list, name, description }: { list: number, name: string, description: string }): void => {
      state[list].name = name
      state[list].description = description
    },
    /**
     * Deletes the list given by the index `list` from the storage.
     * @param state The storage state. Not passed manually.
     * @param list The list index.
     */
    deleteList(state: SongList[], list: number): void {
      state.splice(list, 1)
    },
    /**
     * Adds a new list. The lists index will be given by `store.state.lists.length-1`.
     * @param state The storage state. Not passed manually.
     */
    newList(state: SongList[]): void {
      state.push({
        name: 'Lista ' + (state.length + 1), description: '', songs: []
      })
    },
    /**
     * Moves a list given by `list`, by `direction` steps.
     * Note that the `list`, and `direction` arguments are passed as a dictionary.
     * @param state The storage state. Not passed manually.
     * @param list The list index.
     * @param direction The direction to move the song in. -1 moves it closer to the top, and 1 closer to the bottom.
     */
    moveList: (state: SongList[], { index, direction }: { index: number, direction: number }): void => {
      if (index + direction < 0 || index + direction > state.length - 1) { return }
      [state[index], state[index + direction]] = [state[index + direction], state[index]]
    }
  } // as { [key: string]: Mutation<any> }
}
