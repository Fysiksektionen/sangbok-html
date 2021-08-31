
import { createStore } from 'vuex'

export default createStore({
  state: {
    translate: false,
    night: true,
    larger: false,
    generator: false
  },
  mutations: {
    toggleSetting (state, key: 'translate' | 'night' | 'larger' | 'generator') { state[key] = !(state[key]) }
  },
  actions: {
  },
  modules: {
  }
})
