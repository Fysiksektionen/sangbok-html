// TODO: Move settings to own submodule.
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import { generatorModule, GeneratorState } from './generator'
import { listsModule, SongList } from './lists'

/* eslint-disable no-unused-vars */
/** Type declaration for the storage. */
export enum BooleanSettings {
  translate = 'translate', // Whether to translate greek icons to latin names
  larger = 'larger', // Whether to enlarge the song lyrics
  generator = 'generator', // Whether to show "sångbladsgeneratorn"
  makelist = 'makelist', // Whether to show list editing tools
  sheetmusic = 'sheetmusic', // Whether to show sheet music
  livesearch = 'livesearch', // Whether to update search results after each keypress
  fixednavbuttons = 'fixednavbuttons', // Whether fix the song navigation buttons at the bottom of the viewport rather than place them after the lyrics.
}

export enum MultipleStateSettings {
  theme = 'theme',
  touchAction = 'touchAction' // 'none' | 'swipe' | 'zoom' | 'all'
}

export interface State {
  settings: {[key in MultipleStateSettings]: string} & {[key in BooleanSettings]: boolean},
  version: string, // Settings version (could be useful on backwards-compatibility-breaking schema changes).
  generator: GeneratorState,
  lists: SongList[]
}
/* eslint-enable no-unused-vars */

/** Helpers. Should be integrated into the State interface */

/** Allowed arguments to the setSetting function, see `store.mutations.setSetting`. */
type SetSettingProps = {
  key: 'touchAction' | 'theme',
  value: string
}

// Keys for identifying this particular storage instance.
// The key is used internally, whereas stringKey is used for persistent state loading.
export const stringKey = 'sangbok'
export const key: InjectionKey<Store<State>> = Symbol(stringKey)

export default createStore<State>({
  state: {
    settings: {
      translate: false,
      larger: false,
      generator: false,
      makelist: false,
      sheetmusic: false,
      livesearch: false,
      fixednavbuttons: false,
      theme: 'night',
      touchAction: 'all'
    },
    version: '1'
  } as State, // We need to explicity say that this qualifies as State, since the generator property is loaded through a module. This can cause problems if you change the schema.
  mutations: {
    /**
     * Toggles a setting by the given `key`, to the opposite boolean value.
     * @param state The storage state. Not passed manually
     * @param key The key, identifying the setting.
     */
    toggleSetting(state, key: BooleanSettings) {
      state.settings[key] = !(state.settings[key])
    },
    /**
     * Sets a setting by the given `key`, to the given boolean value.
     * Note that `key` and `value` are passed as a dictionary.
     * @param state The storage state. Not passed manually
     * @param key The key, identifying the setting.
     * @param value The boolean value to set the setting to.
     */
    toggleSettingTo(state, { key, value }: { key: BooleanSettings, value: boolean }) {
      state.settings[key] = value
    },
    /**
     * Sets a setting by the given `key`, to the given value,
     * and updates the global state to reflect the change of settings.
     * Note that `key` and `value` are passed as a dictionary.
     * @param key The key, identifying the setting.
     * @param value The boolean value to set the setting to.
     */
    setSetting(state, props: SetSettingProps) { // Only used by multiple-choice settings.
      state.settings[props.key] = props.value

      // setSetting may have changed touchActions or theme, hence we update them here.
      document.body.style.touchAction = (['zoom', 'all'].indexOf(state.settings.touchAction) === -1) ? 'pan-x pan-y' : ''
      document.body.className = state.settings.theme
    }
  },
  modules: { generator: generatorModule, lists: listsModule },
  plugins: [createPersistedState({ key: stringKey })]
})
