import { generalSettings, GeneralSettings } from '@/utils/export/generalSettings'
import { specificSettings, SpecificDownloadSettings } from '@/utils/export/specificSettings'
import { getSongsByIndices, Song, SongIndex } from '@/utils/lyrics'
// import { Mutation } from 'vuex'

export type GeneratorState = {
  generatorSongs: SongIndex[], // TODO: Perhaps should be stored using $store.
  generalSettings: GeneralSettings,
  specificSettings: SpecificDownloadSettings[]
}

export const generatorModule = {
  state: {
    generatorSongs: [[0, 0]],
    generalSettings: generalSettings,
    specificSettings: specificSettings
  } as GeneratorState,
  getters: {
    songHasBeenAdded: (state: GeneratorState) => (chapterid: number, songid: number): boolean => {
      // TODO: Can probably be done in a more vectorized fashion
      for (const indices of state.generatorSongs) {
        if (indices[0] === chapterid && indices[1] === songid) {
          return true
        }
      }
      return false
    },
    settingIsVisible: (state: GeneratorState) => (setting: SpecificDownloadSettings): boolean => {
      const currentIndicesGreek = getSongsByIndices(state.generatorSongs).map((s: Song) => s.index)
      return [...setting.indexes].filter((i: string) => currentIndicesGreek.indexOf(i) > -1).length > 0
    }
  },
  mutations: {
    add: (state: GeneratorState, idx: SongIndex): void => {
      !generatorModule.getters.songHasBeenAdded(state)(...idx) && state.generatorSongs.push(idx)
    },
    move: (state: GeneratorState, { index, direction }: { index: number, direction: number }): void => {
      // TODO: Can probably be done more elegantly.
      if (index + direction < 0 || index + direction > state.generatorSongs.length - 1) {
        return
      }
      const temp = state.generatorSongs[index]
      state.generatorSongs[index] = state.generatorSongs[index + direction]
      state.generatorSongs[index + direction] = temp
    },
    delete: (state: GeneratorState, listIdx: number): void => {
      state.generatorSongs.splice(listIdx, 1)
    },
    // TODO: These are kinda ugly...
    updateGeneralSettings: (state: GeneratorState, gs: GeneralSettings): void => { state.generalSettings = gs },
    updateSpecificSettings: (state: GeneratorState, ss: SpecificDownloadSettings[]): void => { state.specificSettings = ss }
  } // as { [key: string]: Mutation<any> }
}
