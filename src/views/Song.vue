<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="goToParent" />
  <div class="main">
    <div class="lyrics" v-touch:release="releaseHandler" v-touch:press="pressHandler" v-touch:drag="dragHandler">
      <button v-if="song().msvg && song().text" @click="showMsvg = !showMsvg" class="button musicbutton">{{ showMsvg ?
        'Dölj noter' : 'Visa noter'}}</button>
      <SheetMusicRenderer v-if="song().msvg && (!song().text || showMsvg)" :src="song().msvg" />
      <div v-if="song().text">
        <div class="titlecontainer" v-bind:style="{'minHeight':(song().msvg && !showMsvg ? '5em' : undefined)}">
          <h2>{{song().title}}</h2>
          <div v-if="song().melody" class="melody" v-html="toHTML(song().melody)"></div>
        </div>
        <div class="textcontainer" v-html="toHTML(song().text)" v-bind:class="{'larger': $store.state.settings.larger}">
        </div>
        <div v-if="song().author" class="author" v-html="toHTML(song().author)"></div>
      </div>
      <NavButtons :chapterid="$route.params.chapterId" :songid="$route.params.songId" />
    </div>
    <transition name="swipe-right">
      <div class="swipe-indicator right bg-orange" v-if="showSwipeIndicator.includes('right')"
        v-bind:class="{'disabled': showSwipeIndicator.includes('x')}">
        <img src="../assets/back.png" style="transform: scaleX(-1);" v-if="!showSwipeIndicator.includes('x')" />
        {{ showSwipeIndicator.includes('x') ? "⊘" : "" }}
      </div>
    </transition>
    <transition name="swipe-left">
      <div class="swipe-indicator left bg-orange" v-if="showSwipeIndicator.includes('left')"
        v-bind:class="{'disabled': showSwipeIndicator.includes('x')}">
        <img src="../assets/back.png" v-if="!showSwipeIndicator.includes('x')" />
        {{ showSwipeIndicator.includes('x') ? "⊘" : "" }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import NavButtons from '@/components/SongNavButtons.vue'
import { SwipeIndicatorState, getCoordsFromEvent } from '@/utils/swipe.ts'
import { chapters, Song } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'SongView',
  components: {
    Navbar,
    NavButtons,
    SheetMusicRenderer: defineAsyncComponent(() => import(/* webpackChunkName: "musicrenderer" */ '@/components/SheetMusicRenderer.vue'))
  },
  data() {
    const route: RouteLocationNormalized = useRoute()
    const param2int = (s: string | string[]): number => parseInt((typeof s === 'string') ? s : s[0])
    return {
      chapters: chapters,
      // TODO: This is an ugly fix for the song not updating when pressing NavButtons. It can probably be done using computed()
      song: () => chapters[param2int(route.params.chapterId)].songs[param2int(route.params.songId)] as Song,
      showMsvg: false,
      touchCoords: [undefined, undefined] as [number, number] | [undefined, undefined],
      showSwipeIndicator: 'none' as SwipeIndicatorState
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    toHTML(text: string): string {
      return text.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/igm, '<br />')
    },
    goToParent() { // store.state.query is set if the user came from search. If that's the case, send them back to the search page, else go to the chapter page.
      if (this !== undefined) {
        if (this.store.state.query !== '') {
          this.$router.push('/search/' + this.store.state.query)
        } else {
          this.$router.push('/chapter/' + this.$route.params.chapterId)
        }
      }
    },
    swipeHandler(direction: string) {
      const songId = parseInt(this.$route.params.songId as string)
      const chapterId = parseInt(this.$route.params.chapterId as string)
      if (direction === 'right' && chapters[chapterId].songs.length - 1 > songId) {
        this.$router.push('/chapter/' + chapterId + '/song/' + (songId + 1))
      } else if (direction === 'left' && songId > 0) {
        this.$router.push('/chapter/' + this.$route.params.chapterId + '/song/' + (songId - 1))
      }
    },
    releaseHandler() {
      this.swipeHandler(this.showSwipeIndicator)
      this.showSwipeIndicator = 'none'
    },
    pressHandler(e: Event) { this.touchCoords = getCoordsFromEvent(e) },
    dragHandler(e: Event) {
      if (['swipe', 'all'].indexOf(this.store.state.settings.touchAction) === -1 || window.visualViewport.scale > 1) {
        return
      }
      const [x, y] = getCoordsFromEvent(e)
      const songId = parseInt(this.$route.params.songId as string)
      const chapterId = parseInt(this.$route.params.chapterId as string)
      if (this.touchCoords[0] !== undefined && this.touchCoords[1] !== undefined && x !== undefined && y !== undefined) {
        // Absolute angle of touch path, relative to the vertical line.
        const phi = Math.abs(Math.atan2(this.touchCoords[0] - x, this.touchCoords[1] - y))
        if (Math.PI / 4 <= phi && phi <= 3 * Math.PI / 4) {
          if (this.touchCoords[0] - x > 30) {
            this.showSwipeIndicator = (chapters[chapterId].songs.length - 1 > songId) ? 'right' : 'xright'
            return
          } else if (this.touchCoords[0] - x < -30) {
            this.showSwipeIndicator = (songId > 0) ? 'left' : 'xleft'
            return
          }
        }
      }
      // The catch-all-other case
      this.showSwipeIndicator = 'none'
    }
  }
})
</script>

<style scoped lang="scss">
  div.lyrics {
    margin-left: 1%;
    margin-right: 1%;
  }

  div.titlecontainer {
    margin: auto auto;
    width: fit-content;
  }

  button.button.musicbutton {
    float: left;
  }

  .melody,
  .author {
    font-style: italic;
    padding-right: 24px;
    padding-left: 24px;
  }

  .melody {
    text-align: center;
    margin-bottom: 12px;
  }

  .author {
    text-align: right;
  }

  .textcontainer {
    text-align: left;
    display: inline-block;
    padding: 0 24px 12px;
    font-size: 1.05em;
    line-height: 1.25em;

    &.larger {
      font-size: 1.2em;
      line-height: 1.5em;
    }
  }
</style>
