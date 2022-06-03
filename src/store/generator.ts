import { generalSettings, GeneralSettings } from '@/utils/export/generalSettings'
import { specificSettings, SpecificDownloadSettings } from '@/utils/export/specificSettings'
import { SongIndex } from '@/lyrics'
// import { Mutation } from 'vuex'

/** The schema for the storage module. */
export type GeneratorState = {
  generatorSongs: SongIndex[],
  generalSettings: GeneralSettings,
  specificSettings: SpecificDownloadSettings[],
  version: string
}

export const generatorModule = {
  state: {
    generalSettings,
    specificSettings,
    generatorSongs: [],
    version: '1'
  } as GeneratorState,
  getters: {
    /**
     * @deprecated
     * Returns a function that can be used to check whether a song has been added to the generator songs.
     * In practice, this returned function is called directly, through store.getters.songHasBeenAdded(songindex).
     * This was more important when GeneratorSongs was a list of chapter-song-index-indices. It should be replaced with `store.state.generatorSongs.indexOf(songindex) !== -1`.
     * @param state The storage state. Not passed manually.
     * @param songindex The string index of the song. Parameter of the returned function.
     * @returns A function that takes `songindex` as a parameter, and returns a boolean indicating whether it is in the generator-songs list or not.
     */
    songHasBeenAdded: (state: GeneratorState) => (songindex: SongIndex): boolean => state.generatorSongs.indexOf(songindex) !== -1,
    /**
     * Returns a function that can be used to check whether a song-specific setting should be visible or not.
     * That is, if there is a song in generator-songs to which it can be applied.
     * In practice, this returned function is called directly, through store.getters.settingIsVisible(setting).
     * @param state The storage state. Not passed manually.
     * @param setting A SpecificDownloadSetting. Parameter of the returned function.
     * @returns A function that takes `setting` as a parameter, and returns a boolean indicating whether it should be shown or not.
     */
    settingIsVisible: (state: GeneratorState) => (setting: SpecificDownloadSettings): boolean => {
      return [...setting.indexes].filter((i: string) => state.generatorSongs.indexOf(i) > -1).length > 0
    }
  },
  mutations: {
    /**
     * Adds a song given by `idx` to the song generator, if it hasn't been added already.
     * @param state The storage state. Not passed manually.
     * @param index The song string index.
     */
    add: (state: GeneratorState, idx: SongIndex): void => {
      !generatorModule.getters.songHasBeenAdded(state)(idx) && state.generatorSongs.push(idx)
    },
    /**
     * Moves a song at position `index` in the generator songs by `direction` steps.
     * Note that the `index`, and `direction` arguments are passed as a dictionary.
     * @param state The storage state. Not passed manually.
     * @param index The index of the song in the list.
     * @param direction The direction to move the song in. -1 moves it closer to the top, and 1 closer to the bottom.
     */
    move: (state: GeneratorState, { index, direction }: { index: number, direction: number }): void => {
      if (index + direction < 0 || index + direction > state.generatorSongs.length - 1) { return }
      [state.generatorSongs[index], state.generatorSongs[index + direction]] = [state.generatorSongs[index + direction], state.generatorSongs[index]]
    },
    /**
     * Deletes the song at index `listIdx` from the generator songs.
     * @param state The storage state. Not passed manually.
     * @param listIdx The index of the song, in the list. (Not the string index of the song).
     */
    delete: (state: GeneratorState, listIdx: number): void => {
      state.generatorSongs.splice(listIdx, 1)
    },
    /**
     * Removes all songs from the generator songs list.
     * @param state The storage state. Not passed manually.
     */
    clear: (state: GeneratorState): void => {
      // This may seem like a stupid way to clear an array, but vuex only keeps track of changes to the set array.
      // If we create a new array, vuex, won't recognize that it's been updated.
      state.generatorSongs.splice(0, state.generatorSongs.length)
    },
    // TODO: These two beloware kinda ugly and redundant...
    /**
     * Updates the generator's general settings to the passed GeneralSettings object.
     * @param state The storage state. Not passed manually.
     * @param gs A new GeneralSettings object.
     */
    updateGeneralSettings: (state: GeneratorState, gs: GeneralSettings): void => { state.generalSettings = gs },
    /**
     * Updates the generator's specific settings to the passed SpecificDownloadSettings object.
     * @param state The storage state. Not passed manually.
     * @param ss A new SpecificDownloadSettings object.
     */
    updateSpecificSettings: (state: GeneratorState, ss: SpecificDownloadSettings[]): void => { state.specificSettings = ss }
  } // as { [key: string]: Mutation<any> }
}
