<!-- TODO: Generator should be split into subcomonents, which could be used here as well. -->
<template>
  <div class="view-generator">
    <div class="generatorsettings">
      <h2>Redigera lista</h2>
      <button class="button" @click="newList">Ny lista</button><button class="button" @click="deleteList">Ta bort</button>
      <hr>
      <div>
        <div class="setting">
          Lista: <select v-model="currentListIndex" @change="fetchMeta"><option v-for="val, idx in $store.state.lists" v-bind:key="idx" v-bind:value="idx">{{ val.name }}</option></select>
        </div>
        <div class="setting">
          Namn: <input placeholder="Listans namn" type="text" v-model="currentListMeta.name" @keyup="updateMeta" />
        </div>
        <div class="setting">
          Beskrivning: <input placeholder="Beskrivning" type="text" v-model="currentListMeta.description" @keyup="updateMeta" />
        </div>
      </div>
      <hr>
    </div>

    <div class="generatorbuttons">
      <div v-bind:class="{ 'disabled': !canAdd() }" @click="add()" title="Lägg till">+</div>
    </div>

    <table class="songbook" v-if="currentList!==undefined && currentList.songs.length > 0">
      <tr v-for="songidx, listIdx in currentList.songs" v-bind:key="listIdx">
        <td class="name">{{ getSongByStringIndex(songidx).title }}</td>
        <td class="operation up" v-bind:class="{ 'disabled': listIdx == 0 }"
          @click="$store.commit('moveInList', {list: currentListIndex, index: listIdx, direction: -1})">▲
        </td>
        <td class="operation down" v-bind:class="{ 'disabled': listIdx == currentList.songs.length-1 }"
          @click="$store.commit('moveInList', {list: currentListIndex, index: listIdx, direction: 1})">▼</td>
        <td class="operation delete" @click="$store.commit('delete', listIdx)">✖</td>
      </tr>
    </table>

    <p style="font-size:0.75em;color:gray; text-align: center;">
      Listskaparen är experimentell.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import { chapters, getSongByStringIndex, getSongFromRoute } from '@/lyrics'

import getStage from '@/utils/stageChecker'

export default defineComponent({
  name: 'GeneratorView',
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
  setup() { return { store: useStore(key) } },
  props: ['songid', 'chapterid'],
  methods: {
    getSongByStringIndex: getSongByStringIndex,
    add() {
      const route: RouteLocationNormalized = this.$route
      if (getStage(route) === 'song') { // TODO: Use a switch here isntead of if-else if
        const song = getSongFromRoute(route)
        song && this.store.commit('addToList', { list: this.currentListIndex, index: song.index })
      }
    },
    canAdd(): boolean { // TODO: Move to computed
      const route: RouteLocationNormalized = useRoute()
      if (getStage(route) === 'song') {
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
    }
  }
})
</script>

<style scoped lang="css">
  .button {
    width: calc(50% - 12px);
    display: inline-block
  }
</style>
