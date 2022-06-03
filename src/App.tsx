import './App.scss'

import { defineComponent, defineAsyncComponent } from 'vue'
import Navbar from '@/components/Navbar'
import { themes } from '@/themes'
import { key, stringKey } from '@/store/index'
import { useStore } from 'vuex'

/** Main app. */
export default defineComponent({
  name: 'SångbokApp',
  setup() { return { store: useStore(key) } },
  created () {
    // Ugly fix that updates the theme. Also done in store.
    try {
      const theme = JSON.parse(window.localStorage.getItem(stringKey) || '{"settings":{"theme": undefined}}').settings.theme
      if (theme !== undefined && Object.keys(themes).indexOf(theme) !== -1) {
        document.body.className = theme
      } else {
        document.body.className = 'night'
      }
    } catch {
      document.body.className = 'night'
    }
  },
  render() {
    // This loads Generator component and generator helper functions on-demand.
    const GeneratorView = defineAsyncComponent(() => import(/* webpackChunkName: "generator" */ '@/views/Generator'))

    return (
      <>
        <Navbar hideBackButton={this.$route.meta.hideBackButton as boolean | undefined}/>
        <div class="flex-row">
          <router-view/>
          {this.store.state.settings.generator && <GeneratorView />}
        </div>
      </>
    )
  }
})
