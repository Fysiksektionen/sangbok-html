// Modal for selecting which list to add a song to.
import './ListModal.scss'

import { defineComponent, SetupContext } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Modal from '@/components/Modal'

import { getSongFromRoute } from '@/lyrics'
import { useRoute } from 'vue-router'

export default function SongViewListModal({ }, { emit }: Omit<SetupContext, 'expose'>) {
  const store = useStore(key);
  const route = useRoute();
  const lists = store.state.lists;
  let song = getSongFromRoute(route)

  /**
 * Method that adds the current song to the list given by `listIdx`
 * @param listIdx the index of the list to add the song to.
 */
  function addToList(listIdx: number) {
    song && store.commit('addToList', { list: listIdx, index: song.index })
  }

  return (
    <Modal>
      <header><h3>Lägg till i lista</h3></header>
      <div class="component-listmodal">
        {lists.map((list, idx) => <div
          onClick={() => { song && list.songs.indexOf(song.index) === -1 && emit('close'); addToList(idx) }}
          class={{ 'row': true, 'disabled': !song || song && list.songs.indexOf(song.index) !== -1 }}>
          {list.name}
        </div>
        )}
      </div>
      <footer style="padding-top: 0.5em;">
        <div class="button button-2" onClick={() => store.commit('newList')}>Ny lista</div>
        <div class="button button-2" onClick={() => emit('close')}>Avbryt</div>
      </footer>
    </Modal>
  )
}