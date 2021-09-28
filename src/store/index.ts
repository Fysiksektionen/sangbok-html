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
    generator: boolean,
    touchAction: 'none' | 'swipe' | 'zoom' | 'all'
  },
  query: string,
  generator: GeneratorState
}

type SetSettingProps = {key: 'touchAction', value: 'none' | 'swipe' | 'zoom' | 'all'}

export const key: InjectionKey<Store<State>> = Symbol('storage')

export default createStore<State>({
  state: {
    settings: {
      translate: false,
      night: true,
      larger: false,
      generator: false,
      touchAction: 'swipe'
    },
    query: ''
  } as State, // We need to explicity say that this qualifies as State, since the generator property is loaded through a module.
  mutations: {
    toggleSetting (state, key: 'translate' | 'night' | 'larger' | 'generator') {
      state.settings[key] = !(state.settings[key])
      document.body.className = (state.settings.night === true) ? 'night' : ''
    },
    setSetting (state, props: SetSettingProps) {
      state.settings[props.key] = props.value
      document.body.style.touchAction = (['zoom', 'all'].indexOf(state.settings.touchAction) === -1) ? 'pan-x pan-y' : ''
    },
    setQuery (state, query: string) {
      state.query = query
    }
  },
  // actions: {},
  modules: { generator: generatorModule },
  plugins: [createPersistedState({})]
})
