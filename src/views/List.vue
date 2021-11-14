<!-- View to list all songs in a chapter. -->
<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <!-- Action buttons -->
      <button class="button left" @click="goToGenerator" v-if="$store.state.settings.makelist" title="Skapa sångblad">🖶</button>
      <button class="button right" @click="showQR" title="Dela">📤</button>

      <!-- Title -->
      <div v-if="!$store.state.settings.makelist" class="titlecontainer">
        <h2>{{list.name}}</h2>
        <p style="text-align: center;">{{list.description}}</p>
      </div>

      <!-- If we are in the list-editing view, we display a name and description editor instead. -->
      <div v-if="$store.state.settings.makelist" style="text-align: center;margin-top: 1em;">
        <input type="text" class="secondary" v-model="name" @keyup="updateMeta" placeholder="Listans namn" style="margin-bottom:0.5em;">
        <br>
        <input type="text" class="secondary" v-model="description" @keyup="updateMeta" placeholder="Beskrivning">
      </div>

      <!-- List songs -->
      <table class="songbook">
          <tr v-for="(song, idx) in list.songs"
              v-bind:key="idx">
              <td class="index" v-html="song.index" @click="clickHandler(song, idx)"></td>
              <td class="name" @click="clickHandler(song, idx)">
                <span v-html="song.title"></span>
                <span v-if="hasSheetMusic(song) && $store.state.settings.sheetmusic && !$store.state.settings.makelist" class="sheetmusicicon">𝄢<!--𝄞--></span>
              </td>
            <!-- Song order editing controls. -->
            <td v-if="$store.state.settings.makelist" class="icon">
              <span class="operation up" v-bind:class="{ 'disabled': idx == 0 }" @click="$store.commit('moveInList', {list: listIdx, index: idx, direction: -1})">▲</span>
              <span class="operation down" v-bind:class="{ 'disabled': idx == list.songs.length-1 }" @click="$store.commit('moveInList', {list: listIdx, index: idx, direction: 1})">▼</span>
              <span class="operation delete" @click="$store.commit('deleteFromList', {list: listIdx, index: idx})">✖</span>
            </td>
          </tr>
      </table>
    </div>
  </Swiper>

  <!-- Sharing modal -->
  <Modal v-if="qrVisible">
    <header><h3>Dela</h3></header>
    <div style="text-align: center;"><img v-bind:src="qrImage" style="text-align: center;"/></div>
    <footer style="margin-top: 0.5em;">
      <div class="button button-2" @click="copyLink">Kopiera länk</div>
      <div class="button button-2" @click="qrVisible=false">Avbryt</div>
    </footer>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { key } from '@/store'
import { SongList } from '@/store/lists'

import copy from 'copy-to-clipboard'

import Swiper from '@/components/Swiper.vue' // @ is an alias to /src
import Modal from '@/components/Modal.vue'
import { SwipeIndicatorState } from '@/utils/swipe'
import { Song, param2int, getSongsByStringIndices, hasSheetMusic } from '@/lyrics'

export default defineComponent({
  name: 'ListView',
  components: {
    Swiper,
    Modal
  },
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
  setup() {
    return { store: useStore(key) }
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
  }
})
</script>

<style scoped lang="scss">
  .button.left {
    float: left;
    position: absolute;
    min-width: 3em;
    margin-left: 12px;
  }
  .button.right {
    float: right;
    min-width: 3em;
    margin-right: 12px;
  }

  div.main h2 {margin-bottom: 24px;}

    td.icon {
    /* TODO: Share with sheetmusicicon */
    padding-right: 1em;
    text-align: right;
    /* Doesn't really work for tables */
    width: min-content;

    & > span {
      padding: 0.25em;
    }
  }
</style>
