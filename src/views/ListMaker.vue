<!-- TODO: Generator should be split into subcomonents, which could be used here as well. -->
<template>
  <div class="view-generator">
    <div class="generatorsettings">
      <h2>Redigera listor</h2>
      <button class="button" @click="newList">Ny lista</button>
      <button class="button" @click="deleteList">Ta bort</button>
      <button class="button" @click="goToGenerator">Skapa sångblad</button>
      <hr>
      <div v-if="store.state.lists.length > 0">
        <div class="setting">
          Lista: <select v-model="currentListIndex" @change="fetchMeta; qr()"><option v-for="val, idx in $store.state.lists" v-bind:key="idx" v-bind:value="idx">{{ val.name }}</option></select>
        </div>
        <div class="setting">
          Namn: <input placeholder="Listans namn" type="text" v-model="currentListMeta.name" @keyup="updateMeta(); qr()" />
        </div>
        <div class="setting">
          Beskrivning: <input placeholder="Beskrivning" type="text" v-model="currentListMeta.description" @keyup="updateMeta(); qr()" />
        </div>
      </div>
      <div v-if="store.state.lists.length === 0">Inga listor hittades. Du kan skapa en ny ovan.</div>
      <hr>
    </div>

    <div class="generatorbuttons">
      <div v-bind:class="{ 'disabled': !canAdd() }" @click="add() && qr()" title="Lägg till">+</div>
    </div>

    <table class="songbook" v-if="currentList!==undefined && currentList.songs.length > 0">
      <tr v-for="songidx, listIdx in currentList.songs" v-bind:key="listIdx">
        <td class="name">{{ getSongByStringIndex(songidx).title }}</td>
        <td class="operation up" v-bind:class="{ 'disabled': listIdx == 0 }"
          @click="$store.commit('moveInList', {list: currentListIndex, index: listIdx, direction: -1}); qr()">▲
        </td>
        <td class="operation down" v-bind:class="{ 'disabled': listIdx == currentList.songs.length-1 }"
          @click="$store.commit('moveInList', {list: currentListIndex, index: listIdx, direction: 1}); qr()">▼</td>
        <td class="operation delete" @click="$store.commit('deleteFromList', {list: currentListIndex, index: idx}); qr()">✖</td>
      </tr>
    </table>

    <p style="font-size:0.75em; opacity: 0.5; text-align: center;">
      Listskaparen är experimentell, och är ännu ej optimerad för mobila enheter.
    </p>
    <!-- <div style="text-align-last: center;"><canvas id="lmCanvas"></canvas></div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

// import QRCode from 'qrcode'

import { chapters, getSongByStringIndex, getSongFromRoute } from '@/lyrics'

export default defineComponent({
  name: 'ListMakerView',
  data() {
    const lists = useStore(key).state.lists
    return {
      chapters: chapters,
      currentListIndex: lists.length === 0 ? -1 : 0,
      currentListMeta: {
        name: lists.length === 0 ? '' : lists[0].name,
        description: lists.length === 0 ? '' : lists[0].description
      }
    }
  },
  computed: {
    currentList () {
      return this.store.state.lists[this.currentListIndex]
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  mounted () { this.qr() },
  props: ['songid', 'chapterid'],
  methods: {
    getSongByStringIndex: getSongByStringIndex,
    qr () {
      // const target = window.location.origin + window.location.pathname + "#/list/add/" + encodeURI(JSON.stringify(this.currentList))
      // console.log(target)
      // QRCode.toCanvas(document.getElementById("lmCanvas"), target, (err: Error) => {})
    },
    add() {
      const route: RouteLocationNormalized = this.$route
      if (route.name && route.name.toString().startsWith('Song')) { // TODO: Use a switch here isntead of if-else if
        const song = getSongFromRoute(route)
        song && this.store.commit('addToList', { list: this.currentListIndex, index: song.index })
      }
    },
    canAdd(): boolean { // TODO: Move to computed
      const route: RouteLocationNormalized = useRoute()
      if (route.name && route.name.toString().startsWith('Song')) {
        const song = getSongFromRoute(route)
        return (song !== undefined) && (this.currentList !== undefined) && this.currentList.songs.indexOf(song.index) === -1
      } else { return false }
    },
    updateMeta () {
      this.store.commit('setListMeta', { ...this.currentListMeta, list: this.currentListIndex })
    },
    fetchMeta () {
      if (this.currentList !== undefined) {
        this.currentListMeta = {
          name: this.currentList.name,
          description: this.currentList.description
        }
      } else {
        this.currentListMeta = {
          name: '',
          description: ''
        }
      }
    },
    deleteList () {
      this.store.commit('deleteList', this.currentListIndex)
      this.currentListIndex = this.store.state.lists.length === 0 ? -1 : 0
      this.fetchMeta()
    },
    newList () {
      this.store.commit('newList')
      this.currentListIndex = this.store.state.lists.length - 1
      this.fetchMeta()
    },
    goToGenerator () {
      // Clear generator stuff
      this.store.commit('clear')
      const l = this.currentList
      for (const song of l.songs) { // TODO: Not really efficient O(n^2), but it will do for now
        const s = getSongByStringIndex(song)
        s && this.store.commit('add', s.index)
      }
      this.store.commit('toggleSettingTo', { key: 'makelist', value: false })
      this.store.commit('toggleSettingTo', { key: 'generator', value: true })
    }
  }
})
</script>

<style scoped lang="css">
  .button {
    width: calc(33% - 12px);
    display: inline-block
  }
</style>
