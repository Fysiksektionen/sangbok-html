import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// query is a parameter setting the default value of the input box.
// Internally, this component uses query2



export default defineComponent({
  name: 'SearchBox',
  props: { query: String },
  render({ query }: { query: string }) {
    const router = useRouter();
    const route = useRoute();
    const query2 = query || ''

    function search(evt: Event) {
      evt.preventDefault()
        if (route.name === 'Search') {
          // Replace the history entry if we stay on the search page.
          router.replace('/search/' + query2)
        } else {
          // If we come from somewhere else, we push a new history item.
          router.push('/search/' + query2)
        }
    }

    return (
      <form onSubmit={search} class="component-search">
        <input type="search" v-model={query2} placeholder="Sök i sångboken" />
      </form>
    )
  }
})