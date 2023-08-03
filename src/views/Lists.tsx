import './Lists.scss'

import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Swiper from '@/components/Swiper' // @ is an alias to /src
import { SwipeIndicatorState } from '@/utils/swipe'

/** View for showing all lists. */
export default defineComponent({
  name: 'ListsView',
  components: {
    Swiper
  },
  data() {
    return {
      lists: useStore(key).state.lists // .filter(l => l.songs.length > 0), // TODO: Show icon for empty list
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    swipeHandler (direction: SwipeIndicatorState) { (direction === 'left') && this.$router.push('/') },
    /** Creates a new list. */
    newList() {
      this.store.commit('newList')
    },
    /** Deletes a list, given by the parameter `idx`. */
    deleteList(idx: number) {
      this.store.commit('deleteList', idx)
    }
  },
  render() {
    return (
      <Swiper swipeHandler={this.swipeHandler} right="hide">
        <div class="main">
          {/* Title */}
          {this.store.state.settings.makelist && <button class="button left" onClick={this.newList}>+</button>}
          <h2>Listor</h2>

          {/* The list of lists. */}
          <table class="songbook">
            {this.lists.map((list, idx) =>
              <tr>
                <td class="index" onClick={() => this.$router.push('/list/' + idx)}>
                  { list.name }
                </td>
                <td class="name" onClick={() => this.$router.push('/list/' + idx)}>
                  { list.description }
                </td>
                {/* List order editing */}
                {this.store.state.settings.makelist && <td class="icon">
                  <span class={{ operation: true, up: true, disabled: idx === 0 }}
                    onClick={() => this.store.commit('moveList', { index: idx, direction: -1 })}>▲</span>
                  <span class={{ operation: true, down: true, disabled: idx === this.lists.length - 1 }}
                    onClick={() => this.store.commit('moveList', { index: idx, direction: 1 })}>▼</span>
                  <span class="operation delete"
                    onClick={() => this.deleteList(idx)}>✖</span>
                </td>}
              </tr>
            )}
          </table>
        </div>
      </Swiper>
    )
  }
})
