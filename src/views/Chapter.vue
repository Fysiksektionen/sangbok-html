<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <h2>{{chapter.chapter}}</h2>
      <table class="songbook">
          <tr v-for="(song, idx) in chapter.songs"
              @click="$router.push('/chapter/'+$route.params.cid+'/song/'+idx)"
              v-bind:key="idx">
              <td class="index">
                {{ song.index }}
              </td>
              <td class="name">
                {{ song.title }}
                <span v-if="song.msvg" class="sheetmusicicon">𝄞</span>
              </td>
          </tr>
      </table>
    </div>
  </Swiper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Swiper from '@/components/Swiper.vue' // @ is an alias to /src
import { SwipeIndicatorState } from '@/utils/swipe.ts'
import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'ChapterView',
  components: {
    Swiper
  },
  data() {
    return {
      chapter: chapters[parseInt(this.$route.params.cid as string)]
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    swipeHandler (direction: SwipeIndicatorState) { (direction === 'left') && this.$router.push('/') }
  }
})
</script>
