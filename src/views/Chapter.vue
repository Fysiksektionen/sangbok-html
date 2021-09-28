<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/')"/>
  <div class="main" v-touch:release="releaseHandler" v-touch:press="pressHandler" v-touch:drag="dragHandler">
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
  <transition name="swipe-left">
    <div class="swipe-indicator left bg-orange" v-if="showSwipeIndicator.includes('left')">
      <img src="../assets/back.png"/>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import { SwipeIndicatorState, getCoordsFromEvent, genericDragHandler } from '@/utils/swipe.ts'
import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'ChapterView',
  components: {
    Navbar
  },
  data() {
    return {
      chapter: chapters[parseInt(this.$route.params.cid as string)],

      touchCoords: [undefined, undefined] as [number, number] | [undefined, undefined],
      showSwipeIndicator: 'none' as SwipeIndicatorState
    }
  },
    setup() {
      return { store: useStore(key) }
    },
  methods: {
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
  }
})
</script>
