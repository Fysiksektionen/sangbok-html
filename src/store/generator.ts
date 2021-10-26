import { generalSettings, GeneralSettings } from '@/utils/export/generalSettings'
import { specificSettings, SpecificDownloadSettings } from '@/utils/export/specificSettings'
import { SongIndex } from '@/lyrics'
// import { Mutation } from 'vuex'

export type GeneratorState = {
  generatorSongs: SongIndex[],
  generalSettings: GeneralSettings,
  specificSettings: SpecificDownloadSettings[]
}

export const generatorModule = {
  state: {
    generatorSongs: [],
    generalSettings: generalSettings,
    specificSettings: specificSettings
  } as GeneratorState,
  getters: {
    songHasBeenAdded: (state: GeneratorState) => (songindex: SongIndex): boolean => state.generatorSongs.indexOf(songindex) !== -1,
    settingIsVisible: (state: GeneratorState) => (setting: SpecificDownloadSettings): boolean => {
      return [...setting.indexes].filter((i: string) => state.generatorSongs.indexOf(i) > -1).length > 0
    }
  },
  mutations: {
    add: (state: GeneratorState, idx: SongIndex): void => {
      !generatorModule.getters.songHasBeenAdded(state)(idx) && state.generatorSongs.push(idx)
    },
    move: (state: GeneratorState, { index, direction }: { index: number, direction: number }): void => {
      if (index + direction < 0 || index + direction > state.generatorSongs.length - 1) { return }
      [state.generatorSongs[index], state.generatorSongs[index + direction]] = [state.generatorSongs[index + direction], state.generatorSongs[index]]
    },
    delete: (state: GeneratorState, listIdx: number): void => {
      state.generatorSongs.splice(listIdx, 1)
    },
    clear: (state: GeneratorState): void => {
      // This may seem like a stupid way to clear an array, but vuex only keeps track of changes to the set array.
      // If we create a new array, vuex, won't recognize that it's been updated.
      state.generatorSongs.splice(0, state.generatorSongs.length)
    },
    // TODO: These are kinda ugly...
    updateGeneralSettings: (state: GeneratorState, gs: GeneralSettings): void => { state.generalSettings = gs },
    updateSpecificSettings: (state: GeneratorState, ss: SpecificDownloadSettings[]): void => { state.specificSettings = ss }
  } // as { [key: string]: Mutation<any> }
}
