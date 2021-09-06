import { createStore } from 'vuex'
import { downloadSettings } from './downloadSettings'

// TODO: This is an ugly workaround for state not being type declared
const gs: [number, number][] = []

export default createStore({
  state: {
    settings: {
      translate: false,
      night: true,
      larger: false,
      generator: false,
      download: downloadSettings
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
  actions: {
  },
  modules: {
  }
})
