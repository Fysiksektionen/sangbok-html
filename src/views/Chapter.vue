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
                <span v-if="song.msvg && $store.state.settings.sheetmusic" class="sheetmusicicon">𝄢<!--𝄞--></span>
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
import { chapters, getChapterByStringIndex, Chapter, Song } from '@/lyrics'

export default defineComponent({
  name: 'ChapterView',
  components: {
    Swiper
  },
  computed: {
    chapter () {
      if (this.$route.name === 'ChapterByIndex') {
        // console.log(getChapterByStringIndex(this.$route.params.chapterIndex as string))
        return getChapterByStringIndex(this.$route.params.chapterIndex as string) as Chapter
      } else {
        return chapters[parseInt(this.$route.params.cid as string)] as Chapter
      }
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
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
