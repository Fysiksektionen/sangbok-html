<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <SearchBox :query="$route.params.query" />
      <table class="songbook">
        <tr v-for="(hit, idx) in search($route.params.query)"
          @click="$router.push('/chapter/'+hit.item.chapterindex+'/song/'+hit.item.songindex)" v-bind:key="idx">
          <td class="index">
            {{ chapters[hit.item.chapterindex].songs[hit.item.songindex].index }}
          </td>
          <td class="name">
            <span v-html="chapters[hit.item.chapterindex].songs[hit.item.songindex].title "></span>
            <span v-if="chapters[hit.item.chapterindex].songs[hit.item.songindex].msvg" class="sheetmusicicon">𝄞</span>
          </td>
        </tr>
        <tr class="nohits">
          <td>Inga sånger hittades.</td>
        </tr>
      </table>
    </div>
  </Swiper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import { search } from '@/utils/search.ts' // @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'
import Swiper from '@/components/Swiper.vue'
import { SwipeIndicatorState } from '@/utils/swipe.ts'
import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'Search',
  components: {
    Swiper,
    SearchBox
  },
  methods: {
    search: search,
    swipeHandler(direction: SwipeIndicatorState) { if (direction === 'left') { this.$router.push('/') } }
  },
  data() {
    return {
      chapters: chapters
    }
  },
  setup() {
    return { store: useStore(key) }
  }
})
</script>

<style scoped lang="scss">
  .nohits {
    text-align: center;
    box-shadow: unset !important;
    border-bottom: unset !important;

    &:not(:first-child) {
      /* Hide the nohits row if there are hits. */
      display: none;
    }
  }
</style>
