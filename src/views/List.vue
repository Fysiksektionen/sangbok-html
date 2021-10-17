<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <h2>{{list.name}}</h2>
      <table class="songbook">
          <tr v-for="(song, idx) in list.songs"
              @click="clickHandler(song, idx)"
              v-bind:key="idx">
              <td class="index" v-html="song.index"></td>
              <td class="name">
                <span v-html="song.title"></span>
                <span v-if="song.msvg" class="sheetmusicicon">𝄢<!--𝄞--></span>
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
    const store = useStore(key)
    const route: RouteLocationNormalized = useRoute()
    const list = store.state.lists[param2int(route.params.listId)]
    return {
      list: { ...list, songs: getSongsByStringIndices(list.songs) }
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    swipeHandler (direction: SwipeIndicatorState) { (direction === 'left') && this.$router.push('/') },
    clickHandler (song: Song, idx: number) {
      this.$router.push('/list/' + this.$route.params.listId + '/song/' + idx)
    }
  }
})
</script>
