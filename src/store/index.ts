import { createStore } from 'vuex'

export default createStore({
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
  actions: {
  },
  modules: {
  }
})
