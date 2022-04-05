<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <SearchBox :query="$route.params.query" />
      <table class="songbook">
        <tr v-for="(hit, idx) in search($route.params.query)"
            @click="goto(hit)"
            v-bind:key="idx">
            <!-- TODO: As of now, lists are not visible in search. Don't forget to prevent XSS from list titles without using CSP if you implement this. -->
            <td class="index"><Index :index="hit.item.index || hit.item.chapterindex" /></td>
            <td class="name">
              {{ hit.item.title }}
              <span v-if="hasSheetMusic(hit.item) && $store.state.settings.sheetmusic" class="sheetmusicicon">𝄢</span>
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

import { SongHit, hasSheetMusic } from '@/lyrics'
import { search } from '@/utils/search' // @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'
import Index from '@/components/Index'
import Swiper from '@/components/Swiper.vue'
import { SwipeIndicatorState } from '@/utils/swipe'

export default defineComponent({
  name: 'Search',
  components: {
    Swiper,
    SearchBox,
    Index
  },
  methods: {
    search: search,
    hasSheetMusic: hasSheetMusic,
    /** Sends the user to the target of the hit. */
    goto (hit: Fuse.FuseResult<SongHit>) {
      if (hit.item.chapterindex !== undefined && hit.item.songindex !== undefined) {
        this.$router.push('/chapter/' + hit.item.chapterindex + '/song/' + hit.item.songindex)
      } else if (hit.item.chapterindex !== undefined && hit.item.songindex === undefined) {
        this.$router.push('/chapter/' + hit.item.chapterindex)
      } else {
        this.$router.push('/song/' + hit.item.index)
      }
    },
    swipeHandler(direction: SwipeIndicatorState) {
      // Send the user to the main view if they swipe right (which gives an indicator on the 'left').
      if (direction === 'left') { this.$router.push('/') }
    }
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
