
import { createStore } from 'vuex'
import lyrics from '@/assets/lyrics.json'

export default createStore({
  state: {
    settings: {
      translate: false,
      night: true,
      larger: false,
      generator: false
    },
    lyrics: lyrics
  },
  mutations: {
    toggleSetting (state, key: 'translate' | 'night' | 'larger' | 'generator') { state.settings[key] = !(state.settings[key]) }
  },
  actions: {
  },
  modules: {
  }
})
