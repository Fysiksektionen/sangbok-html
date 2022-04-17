import './ListModal.scss'

import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Modal from '@/components/Modal'

import { getSongFromRoute } from '@/lyrics'
import { SongList } from '@/store/lists'

/** Modal for selecting which list to add the current song (inferred from route) to. */
export default defineComponent({
  name: 'SongViewListModal',
  setup() { return { store: useStore(key) } },
  data() { return { lists: useStore(key).state.lists } },
  computed: {
    /** @returns The Song object associated with the current route. */
    song () {
      return getSongFromRoute(this.$route)
    }
  },
  methods: {
    /**
     * Method that adds the current song to the list given by `listIdx`
     * @param listIdx the index of the list to add the song to.
     */
    addToList(listIdx: number) {
      this.song && this.store.commit('addToList', { list: listIdx, index: this.song.index })
    }
  },
  render() {
    return (
      <Modal>
        <header><h3>Lägg till i lista</h3></header>

        <div class="component-listmodal">
          {this.lists.map((list: SongList, idx: number) => <div
            onClick={() => { this.song && list.songs.indexOf(this.song.index) === -1 && this.$emit('close'); this.addToList(idx) }}
            class={{ row: true, disabled: !this.song || (this.song && list.songs.indexOf(this.song.index) !== -1) }}>
            {list.name}
          </div>
          )}
        </div>

        <footer style="padding-top: 0.5em;">
          <div class="button button-2" onClick={() => this.store.commit('newList')}>Ny lista</div>
          <div class="button button-2" onClick={() => this.$emit('close')}>Avbryt</div>
        </footer>
      </Modal>
    )
  }
})
