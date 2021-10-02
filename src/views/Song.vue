<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :allowZoom="true"
      :left="($route.params.songId > 0) ? 'allow' : 'disallow'"
      :right="(this.chapters[$route.params.chapterId].songs.length - 1 > $route.params.songId) ? 'allow' : 'disallow'">
    <div class="main">
      <div class="lyrics">
        <button v-if="song().msvg && song().text" @click="showMsvg = !showMsvg" class="button musicbutton">
          {{ showMsvg ? 'Dölj noter' : 'Visa noter'}}</button>
        <SheetMusicRenderer v-if="song().msvg && (!song().text || showMsvg)" :src="song().msvg" />
        <div class="song-index" v-if="song().text && !showMsvg">{{song().index}}</div>
        <div v-if="song().text && (!showMsvg || !song().msvg)">
          <div class="titlecontainer" v-bind:style="{'minHeight':(song().msvg && !showMsvg ? '5em' : undefined)}">
            <h2>{{song().title}}</h2>
            <div v-if="song().melody" class="melody" v-html="toHTML(song().melody)"></div>
          </div>
          <div class="textcontainer" v-html="toHTML(song().text)"
            v-bind:class="{'larger': $store.state.settings.larger}">
          </div>
          <div v-if="song().author" class="author" v-html="toHTML(song().author)"></div>
        </div>
        <NavButtons :chapterid="$route.params.chapterId" :songid="$route.params.songId" />
      </div>
    </div>
  </Swiper>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import NavButtons from '@/components/SongNavButtons.vue' // @ is an alias to /src
import Swiper from '@/components/Swiper.vue'
import { SwipeIndicatorState } from '@/utils/swipe.ts'
import { chapters, Song } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'SongView',
  components: {
    Swiper,
    NavButtons,
    SheetMusicRenderer: defineAsyncComponent(() => import(/* webpackChunkName: "musicrenderer", webpackPrefetch: true */ '@/components/SheetMusicRenderer.vue'))
  },
  data() {
    const route: RouteLocationNormalized = useRoute()
    const param2int = (s: string | string[]): number => parseInt((typeof s === 'string') ? s : s[0])
    return {
      chapters: chapters,
      // TODO: This is an ugly fix for the song not updating when pressing NavButtons. It can probably be done using computed()
      song: () => chapters[param2int(route.params.chapterId)].songs[param2int(route.params.songId)] as Song,
      showMsvg: false
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    toHTML(text: string): string {
      const ALLOWED_TAGS = ['li', 'ol', 'ul', 'b', 'p', 'i', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      let out = text.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/igm, '<br />')
      for (const tag of ALLOWED_TAGS) {
        out = out.replace(new RegExp(`&lt;(/)?${tag}&gt;`, 'mig'), `<$1${tag}>`)
      }
      return out
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
    swipeHandler(direction: SwipeIndicatorState) {
      const songId = parseInt(this.$route.params.songId as string)
      const chapterId = parseInt(this.$route.params.chapterId as string)
      if (direction === 'right' && chapters[chapterId].songs.length - 1 > songId) {
        this.$router.replace('/chapter/' + chapterId + '/song/' + (songId + 1))
      } else if (direction === 'left' && songId > 0) {
        this.$router.replace('/chapter/' + this.$route.params.chapterId + '/song/' + (songId - 1))
      }
    }
  }
})
</script>

<style scoped lang="scss">
  .song-index {
    float: right;
    margin: 24px;
    margin-top: 12px;
    font-size: 1.5em;
    opacity: 0.8;
    letter-spacing: 1px;
  }

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
