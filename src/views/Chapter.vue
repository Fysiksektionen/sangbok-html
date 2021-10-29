<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <h2>{{chapter.chapter}}</h2>
      <table class="songbook">
          <tr v-for="(song, idx) in chapter.songs"
              @click="clickHandler(song, idx)"
              v-bind:key="idx">
              <td class="index" v-html="song.index"></td>
              <td class="name">
                <span v-html="song.title"></span>
                <span v-if="hasSheetMusic(song) && $store.state.settings.sheetmusic" class="sheetmusicicon">𝄢</span>
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
import { SwipeIndicatorState } from '@/utils/swipe'
import { Song, getChapterFromRoute, Chapter, hasSheetMusic } from '@/lyrics'

export default defineComponent({
  name: 'ChapterView',
  components: {
    Swiper
  },
  data() {
    const chapter = getChapterFromRoute(this.$route)
    if (chapter === undefined) {
      alert('Något gick riktigt snett. Kapitlet kan inte bestämmas.')
    }
    return { chapter: chapter as Chapter }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    hasSheetMusic: hasSheetMusic,
    swipeHandler (direction: SwipeIndicatorState) { (direction === 'left') && this.$router.push('/') },
    clickHandler (song: Song, idx: number) {
      if (this.$route.name === 'ChapterByIndex') {
        this.$router.push('/chapter/' + this.chapter.prefix + '/song/' + idx)
      } else {
        this.$router.push('/chapter/' + this.$route.params.cid + '/song/' + idx)
      }
    }
  }
})
</script>
