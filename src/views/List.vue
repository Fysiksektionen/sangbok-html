<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <button class="button left" @click="goToGenerator" v-if="$store.state.settings.makelist" title="Skapa sångblad">🖶</button>
      <h2>{{list.name}}</h2>
      <table class="songbook">
          <tr v-for="(song, idx) in list.songs"
              v-bind:key="idx">
              <td class="index" v-html="song.index" @click="clickHandler(song, idx)"></td>
              <td class="name" @click="clickHandler(song, idx)">
                <span v-html="song.title"></span>
                <span v-if="song.msvg && $store.state.settings.sheetmusic && !$store.state.settings.makelist" class="sheetmusicicon">𝄢<!--𝄞--></span>
              </td>
            <td v-if="$store.state.settings.makelist" class="icon">
              <span class="operation up" v-bind:class="{ 'disabled': idx == 0 }" @click="$store.commit('moveInList', {list: listIdx, index: idx, direction: -1})">▲</span>
              <span class="operation down" v-bind:class="{ 'disabled': idx == list.songs.length-1 }" @click="$store.commit('moveInList', {list: listIdx, index: idx, direction: 1})">▼</span>
              <span class="operation delete" @click="$store.commit('deleteFromList', {list: listIdx, index: idx})">✖</span>
            </td>
          </tr>
      </table>
    </div>
  </Swiper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { key } from '@/store'

import Swiper from '@/components/Swiper.vue' // @ is an alias to /src
import { SwipeIndicatorState } from '@/utils/swipe.ts'
import { Song, param2int, getSongsByStringIndices } from '@/lyrics'

export default defineComponent({
  name: 'ListView',
  components: {
    Swiper
  },
  data() {
    // const store = useStore(key)
    const route: RouteLocationNormalized = useRoute()
    const listIdx = param2int(route.params.listId)
    return {
      listIdx: listIdx
    }
  },
  computed: {
    list () {
      // TODO: use "this" for store and route...
      const store = useStore(key)
      const route: RouteLocationNormalized = useRoute()
      const listIdx = param2int(route.params.listId)
      const list = store.state.lists[listIdx]
      return { ...list, songs: getSongsByStringIndices(list.songs) }
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    swipeHandler (direction: SwipeIndicatorState) { (direction === 'left') && this.$router.push('/') },
    clickHandler (song: Song, idx: number) {
      this.$router.push('/list/' + this.$route.params.listId + '/song/' + idx)
    },
    goToGenerator () {
      // Clear generator stuff
      this.store.commit('clear')
      const l = this.list
      for (const song of l.songs) { // TODO: Not really efficient O(n^2), but it will do for now
        song && this.store.commit('add', song.index)
      }
      this.store.commit('toggleSettingTo', { key: 'generator', value: true })
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
