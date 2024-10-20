import { defineComponent } from 'vue'

import { onlyAllowZoomOut } from '@/utils/swipe' // @ is an alias to /src
import { greekPrefix2latin } from '@/utils/other'
import { chapters } from '@/lyrics'
import { useStore } from 'vuex'
import { key } from '@/store'

// TODO: Refactor into a functional-style component
/** Main chapter list view */
export default defineComponent({
  name: 'ChaptersView',
  data() {
    return {
      chapters,
      onlyAllowZoomOut: onlyAllowZoomOut()
    }
  },
  methods: {
    dragHandler () { this.onlyAllowZoomOut = onlyAllowZoomOut() }
  },
  render() {
    const store = useStore(key)
    return (
      <div class="main" style={this.onlyAllowZoomOut} v-touch:drag={this.dragHandler}>
        <table class="songbook">
          {this.chapters.map((chapter, idx) => <tr
            onClick={() => this.$router.push('/chapter/' + idx)}>
            <td class="index">
              { store.state.settings.translate ? greekPrefix2latin(chapter.prefix) : chapter.prefix }
            </td>
            <td class="name">
              { chapter.chapter }
            </td>
          </tr>)}

          {/* We display a link to the lists view if the user has any non-empty lists, or is in the list-editing mode. */
            (store.getters.hasLists || store.state.settings.makelist) &&
            <tr onClick={() => this.$router.push('/list/')}>
              <td class="index">♥</td>
              <td class="name">Egna listor</td>
            </tr>
          }
        </table>
      </div>
    )
  }
})
