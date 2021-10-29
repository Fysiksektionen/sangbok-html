<!-- View to list all songs in a chapter. -->

<template>
  <Swiper :swipeHandler="swipeHandler" :allowZoom="true" class="component-song"
      :left="($route.name=='SongByIndex') ? 'hide' : ($route.params.songId > 0) ? 'allow' : 'disallow'"
      :right="($route.name=='SongByIndex') ? 'hide' : (chapter.songs.length - 1 > $route.params.songId) ? 'allow' : 'disallow'">
    <div class="main">
      <div class="lyrics">
        <!-- Pre-header -->
        <button v-if="sheetMusicAvailable && song.text && $store.state.settings.sheetmusic && !$store.state.settings.makelist"
          @click="showMsvg = !showMsvg" class="button musicbutton">
          {{ showMsvg ? 'Dölj noter' : '𝄢'}}
        </button>
        <button v-if="$store.state.settings.makelist" class="button musicbutton" @click="listModalVisible=true">+</button>
        <div class="song-index" v-if="song.text && !showMsvg" v-html="song.index"></div>
        <!-- Main content -->
        <SheetMusicRenderer v-if="sheetMusicAvailable && (!song.text || showMsvg)" :src="song.index" />
        <div v-if="song.text && (!showMsvg || !sheetMusicAvailable)">
          <div class="titlecontainer" v-bind:style="{'minHeight':(sheetMusicAvailable && !showMsvg ? '5em' : undefined)}">
            <h2>{{song.title}}</h2>
            <div v-if="song.melody" class="melody" v-html="toHTML(song.melody)"></div>
          </div>
          <div class="textcontainer" v-html="toHTML(song.text)" v-bind:class="{'larger': $store.state.settings.larger}"></div>
          <div v-if="song.author" class="author" v-html="toHTML(song.author)"></div>
        </div>
        <NavButtons v-if="chapter" :chapter="chapter" :chapterid="$route.params.chapterId" :songid="$route.params.songId" />
        <div v-if="!chapter" style="height: 2em;"></div><!-- Margin if NavButtons is hidden. -->
      </div>
    </div>
  </Swiper>
  <!-- Modals -->
  <transition name="modal-down">
    <ListModal songindex="song.index" v-if="listModalVisible" @close="listModalVisible=false" style="transition: all 0.2s ease-out;"/>
  </transition>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import Swiper from '@/components/Swiper.vue'
import NavButtons from '@/views/song/SongNavButtons.vue'
import ListModal from '@/views/song/ListModal.vue'

import { SwipeIndicatorState, swipeIndicatorToOffset } from '@/utils/swipe'
import { getSongFromRoute, getChapterFromRoute, getOffsetSongFromRoute, hasSheetMusic, Song } from '@/lyrics'
import { toHTML } from '@/utils/other'

export default defineComponent({
  name: 'SongView',
  components: {
    Swiper,
    NavButtons,
    ListModal,
    // Load SheetMusicRenderer on-demand
    SheetMusicRenderer: defineAsyncComponent(() => import(/* webpackChunkName: "musicrenderer", webpackPrefetch: true */ '@/views/song/SheetMusicRenderer.vue'))
  },
  setup() { return { store: useStore(key) } },
  data() {
    const route: RouteLocationNormalized = useRoute()
    return {
      chapter: getChapterFromRoute(route),
      showMsvg: false,
      listModalVisible: false
    }
  },
  computed: {
    song () { return getSongFromRoute(this.$route) },
    sheetMusicAvailable () { return hasSheetMusic(getSongFromRoute(this.$route) as Song) }
  },
  methods: {
    toHTML: toHTML,
    swipeHandler(direction: SwipeIndicatorState) {
      const offset = swipeIndicatorToOffset[direction]
      if (offset === 0) return
      const newSong = getOffsetSongFromRoute(this.$route, offset)
      newSong && this.$router.replace('/chapter/' + newSong.chapterIdentifier + '/song/' + newSong.index)
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-down-enter-from, .modal-down-leave-to {/* See hard-coded style property to set transition speed. */
    /* TODO: Set dropdown speeds using classes. */
    filter: blur(0);
    transform: translateY(-100%);
    opacity: 0;
  }

  .song-index {
    right: 0;
    margin: 24px;
    margin-top: 12px;
    font-size: 1.5em;
    opacity: 0.8;
    letter-spacing: 1px;
    position: absolute;
  }

  div.lyrics {
    margin-left: 1%;
    margin-right: 1%;
  }

  div.titlecontainer {
    margin: auto auto;
    width: fit-content;
  }

  .button.musicbutton {
    float: left;
    min-width: 3em;
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
