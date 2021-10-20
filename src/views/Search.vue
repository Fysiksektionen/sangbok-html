<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <SearchBox :query="$route.params.query" />
      <table class="songbook">
        <tr v-for="(hit, idx) in search($route.params.query)"
            @click="goto(hit)"
            v-bind:key="idx">
            <!-- TODO: Prevent XSS from list titles without CSP. -->
            <td class="index" v-html="hit.item.index"></td>
            <td class="name">
              {{ hit.item.title }}
              <span v-if="hit.item.msvg && $store.state.settings.sheetmusic" class="sheetmusicicon">𝄢<!--𝄞--></span>
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
import Fuse from 'fuse.js'
import { useStore } from 'vuex'
import { key } from '@/store'

import { search } from '@/utils/search.ts' // @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'
import { chapters, SongHit } from '@/lyrics'
import Swiper from '@/components/Swiper.vue'
import { SwipeIndicatorState } from '@/utils/swipe.ts'

export default defineComponent({
  name: 'Search',
  components: {
    Swiper,
    SearchBox
  },
  methods: {
    search: search,
    goto (hit: Fuse.FuseResult<SongHit>) {
      if (hit.item.chapterindex !== undefined && hit.item.songindex !== undefined) {
        this.$router.push('/chapter/' + hit.item.chapterindex + '/song/' + hit.item.songindex)
      } else if (hit.item.chapterindex !== undefined && hit.item.songindex === undefined) {
        this.$router.push('/chapter/' + hit.item.chapterindex)
      } else {
        this.$router.push('/song/' + hit.item.index)
      }
    },
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
