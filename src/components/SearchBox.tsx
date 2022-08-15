import { BooleanSettings, key } from '@/store'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

/** Search box component. Locally memorizes the query. */
export default defineComponent({
  name: 'SearchBox',
  props: { query: String },
  render({ query }: { query: string }) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore(key)
    query = query || ''

    function search(evt: Event) {
      evt.preventDefault()
      if (evt.type === 'submit' || store.state.settings[BooleanSettings.livesearch]) {
        if (route.name === 'Search') {
          // Replace the history entry if we stay on the search page.
          router.replace('/search/' + query)
        } else {
          // If we come from somewhere else, we push a new history item.
          router.push('/search/' + query)
        }
      }
    }

    return (
      <form onSubmit={search} onKeyup={search} class="component-search">
        <input type="search" v-model={query} placeholder="Sök i sångboken" />
      </form>
    )
  }
})
