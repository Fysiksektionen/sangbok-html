import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import { generatorModule, GeneratorState } from './generator'

// Store state typing
export interface State {
  settings: {
    translate: boolean,
    night: boolean,
    larger: boolean,
    generator: boolean
  },
  query: string,
  generator: GeneratorState
}

export const key: InjectionKey<Store<State>> = Symbol('storage')

export default createStore<State>({
  state: {
    settings: {
      translate: false,
      night: true,
      larger: false,
      generator: false
    },
    query: ''
  } as State, // We need to explicity say that this qualifies as State, since the generator property is loaded through a module.
  mutations: {
    toggleSetting (state, key: 'translate' | 'night' | 'larger' | 'generator') {
      state.settings[key] = !(state.settings[key])
      document.body.className = (state.settings.night === true) ? 'night' : ''
    },
    setQuery (state, query: string) {
      state.query = query
    }
  },
  // actions: {},
  modules: { generator: generatorModule },
  plugins: [createPersistedState({})]
})
