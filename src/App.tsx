import './App.scss'
import './Print.scss'

import { defineComponent, defineAsyncComponent } from 'vue'
import Navbar from '@/components/Navbar'
import { themes } from '@/themes'
import { key, stringKey } from '@/store/index'
import { useStore } from 'vuex'
import SearchBox from './components/SearchBox'
// TODO: Make async (and make vitest not complain about it).
// import GeneratorView from '@/views/Generator'

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
    const GeneratorView = defineAsyncComponent(() => import('@/views/Generator'))

    return (
      <>
        <Navbar hideBackButton={this.$route.meta.hideBackButton as boolean | undefined}/>
        <div class="flex-row">
          <div class="flex-col main">
            {this.$route.meta.showSearch && <SearchBox query={this.$route.params.query as string} />}
            <router-view/>
          </div>
          {this.store.state.settings.generator && <GeneratorView />}
        </div>
      </>
    )
  }
})
