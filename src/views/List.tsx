// View to list all songs in a chapter.
import './List.scss'

import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { key } from '@/store'
import { SongList } from '@/store/lists'

import copy from 'copy-to-clipboard'

import Swiper from '@/components/Swiper.vue' // @ is an alias to /src
import Modal from '@/components/Modal'
import { SwipeIndicatorState } from '@/utils/swipe'
import { Song, param2int, getSongsByStringIndices, hasSheetMusic } from '@/lyrics'

export default defineComponent({
  name: 'ListView',
  setup() { return { store: useStore(key) } },
  data() {
    const route: RouteLocationNormalized = useRoute()
    const listIdx = param2int(route.params.listId)
    const store = useStore(key)
    return {
      listIdx: listIdx,
      qrVisible: false,
      qrImage: undefined as string | undefined,
      // Only used for updates. This initialization method may be problematic if this view is used as a component (which it's not supposed to be).
      name: store.state.lists[listIdx].name,
      description: store.state.lists[listIdx].description
    }
  },
  computed: {
    /** @returns The current list object, as well as the list songs. */
    list () {
      const store = useStore(key)
      const route: RouteLocationNormalized = useRoute()

      const listIdx = param2int(route.params.listId)
      const list: SongList = store.state.lists[listIdx]
      return { ...list, songs: getSongsByStringIndices(list.songs) }
    },
    /** @returns A link that can be used to share the list. */
    link (): string {
      return window.location.origin + window.location.pathname + '#/list/add/' + encodeURI(JSON.stringify({ ...this.list, songs: this.list.songs.map(s => s.index) }))
    }
  },
  methods: {
    hasSheetMusic: hasSheetMusic,
    swipeHandler (direction: SwipeIndicatorState) {
      // Go back one step if the user swipes to the right (which shows the indicator on the 'left')
      (direction === 'left') && this.$router.go(-1)
    },
    /** Sends the user to a song in the list. */
    clickHandler (song: Song, idx: number) {
      this.$router.push('/list/' + this.$route.params.listId + '/song/' + idx)
    },
    /** Updates the stored list name and description. */
    updateMeta () {
      this.store.commit('setListMeta', { list: this.listIdx, name: this.name, description: this.description })
    },
    /** Sends the user to the sångblad generator, with the list songs added. */
    goToGenerator () {
      // Clear generator stuff
      this.store.commit('clear')
      const l = this.list
      for (const song of l.songs) { // TODO: Not really efficient (O(n^2)), but it will do for now
        song && this.store.commit('add', song.index)
      }
      this.store.commit('toggleSettingTo', { key: 'generator', value: true })
    },
    /** Shows the sharing modal, with a QR code. */
    async showQR () {
      this.qrVisible = true
      const QRCode = await import(/* webpackChunkName: "qrcodelib" */ 'qrcode')
      this.qrImage = await QRCode.toDataURL(this.link)
    },
    /** Copies the sharing link to the user's clipboard. */
    copyLink () {
      const success = copy(this.link)
      if (success) {
        this.qrVisible = false
      }
    }
  },
  render() {
    return (<>
      <Swiper swipeHandler={this.swipeHandler} right="hide">
        <div class="main">
          {/* Action buttons */}
          {this.store.state.settings.makelist && <button class="button left" onClick={this.goToGenerator} title="Skapa sångblad">🖶</button>}
          <button class="button right" onClick={this.showQR} title="Dela">📤</button>

          {/* Title */}
          {!this.store.state.settings.makelist &&
        <div class="titlecontainer">
          <h2>{this.list.name}</h2>
          <p style="text-align: center;">{this.list.description}</p>
        </div>}

          {/* If we are in the list-editing view, we display a name and description editor instead. */}
          {this.store.state.settings.makelist &&
        <div style="text-align: center;margin-top: 1em;">
          <input type="text" class="secondary" v-model={this.name} onKeyup={this.updateMeta} placeholder="Listans namn" style="margin-bottom:0.5em;" />
          <br />
          <input type="text" class="secondary" v-model={this.description} onKeyup={this.updateMeta} placeholder="Beskrivning" />
        </div>
          }

          {/* List songs */}
          <table class="songbook">
            {this.list.songs.map((song, idx) => <tr>
              <td class="index" v-html={song.index} onClick={() => this.clickHandler(song, idx)}></td>
              <td class="name" onClick={() => this.clickHandler(song, idx)}>
                <span v-html={song.title}></span>
                {hasSheetMusic(song) && this.store.state.settings.sheetmusic && !this.store.state.settings.makelist &&
                    <span class="sheetmusicicon">𝄢</span> /* 𝄞 */}
              </td>
              {/* Song order editing controls. */}
              {this.store.state.settings.makelist && <td class="icon">
                <span class={{ operation: true, up: true, disabled: idx === 0 }}
                  onClick={() => this.store.commit('moveInList', { list: this.listIdx, index: idx, direction: -1 })}>▲</span>
                <span class={{ operation: true, down: true, disabled: idx === this.list.songs.length - 1 }}
                  onClick={() => this.store.commit('moveInList', { list: this.listIdx, index: idx, direction: 1 })}>▼</span>
                <span class="operation delete"
                  onClick={() => this.store.commit('deleteFromList', { list: this.listIdx, index: idx })}>✖</span>
              </td>}
            </tr>)}
          </table>
        </div>
      </Swiper>

      {/* Sharing modal */}
      {this.qrVisible && <Modal>
        <header><h3>Dela</h3></header>
        <div style="text-align: center;"><img src="qrImage" style="text-align: center;"/></div>
        <footer style="margin-top: 0.5em;">
          <div class="button button-2" onClick={this.copyLink}>Kopiera länk</div>
          <div class="button button-2" onClick={() => { this.qrVisible = false }}>Avbryt</div>
        </footer>
      </Modal>}
    </>
    )
  }
})
