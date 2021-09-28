<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/')" />
  <div class="main" v-touch:release="releaseHandler" v-touch:press="pressHandler" v-touch:drag="dragHandler">
    <SearchBox :query="$route.params.query" />
    <table class="songbook">
      <tr v-for="(hit, idx) in search($route.params.query)"
        @click="$router.push('/chapter/'+hit.item.chapterindex+'/song/'+hit.item.songindex)" v-bind:key="idx">
        <td class="index">
          {{ chapters[hit.item.chapterindex].songs[hit.item.songindex].index }}
        </td>
        <td class="name">
          {{ chapters[hit.item.chapterindex].songs[hit.item.songindex].title }}
          <span v-if="chapters[hit.item.chapterindex].songs[hit.item.songindex].msvg" class="sheetmusicicon">𝄞</span>
        </td>
      </tr>
      <tr class="nohits">
        <td>Inga sånger hittades.</td>
      </tr>
    </table>
    <transition name="swipe-left">
      <div class="swipe-indicator left bg-orange" v-if="showSwipeIndicator.includes('left')">
        <img src="../assets/back.png"/>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

  import { search } from '@/utils/search.ts' // @ is an alias to /src
  import Navbar from '@/components/Navbar.vue'
  import SearchBox from '@/components/SearchBox.vue'
  import { SwipeIndicatorState, getCoordsFromEvent, genericDragHandler } from '@/utils/swipe.ts'
  import { chapters } from '@/utils/lyrics.ts'

  export default defineComponent({
    name: 'Search',
    components: {
      Navbar,
      SearchBox
    },
    methods: {
      search: search,
      swipeHandler(direction: string) {
        if (direction === 'left') { this.$router.push('/') }
      },
      releaseHandler() {
        this.swipeHandler(this.showSwipeIndicator)
        this.showSwipeIndicator = 'none'
      },
      pressHandler(e: Event) { this.touchCoords = getCoordsFromEvent(e) },
      dragHandler(e: Event) {
        if (['swipe', 'all'].indexOf(this.store.state.settings.touchAction) === -1) { return }
        this.showSwipeIndicator = genericDragHandler(this.touchCoords, getCoordsFromEvent(e))
      }
    },
    data() {
      return {
        chapters: chapters,
        touchCoords: [undefined, undefined] as [number, number] | [undefined, undefined],
        showSwipeIndicator: 'none' as SwipeIndicatorState
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
