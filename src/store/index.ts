import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import { generatorModule, GeneratorState } from './generator'
import { listsModule, SongList } from './lists'

// Store state typing
export interface State {
  settings: {
    translate: boolean,
    theme: string,
    larger: boolean,
    generator: boolean,
    makelist: boolean,
    touchAction: string // 'none' | 'swipe' | 'zoom' | 'all'
  },
  query: string,
  generator: GeneratorState,
  lists: SongList[]
}

type SetSettingProps = {key: 'touchAction' | 'theme', value: string}

export const key: InjectionKey<Store<State>> = Symbol('storage')

export default createStore<State>({
  state: {
    settings: {
      translate: false,
      theme: 'night',
      larger: false,
      generator: false,
      makelist: false,
      touchAction: 'all'
    },
    query: ''
  } as State, // We need to explicity say that this qualifies as State, since the generator property is loaded through a module.
  mutations: {
    toggleSetting (state, key: 'translate' | 'larger' | 'generator') {
      state.settings[key] = !(state.settings[key])
    },
    setSetting (state, props: SetSettingProps) {
      state.settings[props.key] = props.value

      // On update
      document.body.style.touchAction = (['zoom', 'all'].indexOf(state.settings.touchAction) === -1) ? 'pan-x pan-y' : ''
      document.body.className = state.settings.theme
    },
    setQuery (state, query: string) {
      state.query = query
    }
  },
  // actions: {},
  modules: { generator: generatorModule, lists: listsModule },
  plugins: [createPersistedState({})]
})
