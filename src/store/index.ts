import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

import createPersistedState from 'vuex-persistedstate'

// Store state typing
export interface State {
  settings: {
    translate: boolean,
    night: boolean,
    larger: boolean,
    generator: boolean
  },
  query: string
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
  },
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
  // modules: {},
  plugins: [createPersistedState({})]
})
