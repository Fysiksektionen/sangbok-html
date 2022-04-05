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
        <div class="song-index" v-if="!showMsvg"><Index :index="song.index" /></div>

        <!-- Main content -->
        <div v-if="!showMsvg || !$store.state.settings.sheetmusic || !sheetMusicAvailable">
          <!-- Header -->
          <div class="titlecontainer" v-bind:style="{'minHeight':(sheetMusicAvailable && !showMsvg ? '5em' : undefined)}">
            <h2>{{song.title}}</h2>
            <div v-if="song.melody" class="melody" v-html="toHTML(song.melody)"></div>
          </div>

          <!-- Content -->
          <div class="textcontainer" v-html="toHTML(song.text)" v-bind:class="{'larger': $store.state.settings.larger}"></div>
          <div v-if="song.author" class="author" v-html="toHTML(song.author)"></div>
        </div>

        <!-- Sheet music -->
        <!-- If this is visible, the "Main content" above will be hidden. -->
        <SheetMusicRenderer v-if="sheetMusicAvailable && showMsvg && $store.state.settings.sheetmusic" :src="song.index" :key="song.index"/>

        <!-- Navigation -->
        <NavButtons v-if="chapter" />
        <div v-if="!chapter" style="height: 2em;"></div><!-- Margin if NavButtons is hidden. --><!-- TODO: Check if this is really needed. -->
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

import Index from '@/components/Index'
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
    Index,
    // Load SheetMusicRenderer on-demand
    SheetMusicRenderer: defineAsyncComponent(() => import(/* webpackChunkName: "musicrenderer", webpackPrefetch: true */ '@/views/song/SheetMusicRenderer.vue'))
  },
  setup() { return { store: useStore(key) } },
  data() {
    const route: RouteLocationNormalized = useRoute()
    return {
      chapter: getChapterFromRoute(route),
      listModalVisible: false,
      // A boolean indicating whether the sheetmusic should be visible, if applicable.
      showMsvg: false
    }
  },
  computed: {
    song () { return getSongFromRoute(this.$route) },
    /** @returns true if the current song has sheet music, and false otherwise. */
    sheetMusicAvailable () { return hasSheetMusic(getSongFromRoute(this.$route) as Song) }
  },
  methods: {
    toHTML: toHTML,
    /** Sends the user to the next or previous song on swipes. */
    swipeHandler(direction: SwipeIndicatorState) {
      // If newSong is false we are on the first/last song and cannot swipe further.
      // If it's undefined, we are not in a chapter or list, and there is nowhere to go.
      // Hence we check that newSong is valid before asking the router to do its thing.
      const offset = swipeIndicatorToOffset[direction]
      if (offset === 0) return
      const newSong = getOffsetSongFromRoute(this.$route, offset)
      newSong && this.$router.replace(newSong.chapterPath + '/song/' + newSong.index)
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-down-enter-from, .modal-down-leave-to {
    /* See hard-coded style property to set transition speed. */
    /* TODO: Set dropdown speeds using classes. */
    filter: blur(0);
    transform: translateY(-100%);
    opacity: 0;
  }

  .song-index {
    margin: 12px 16px auto 12px;
    float: right;
    font-size: 1.5em;
    opacity: 0.7;
    letter-spacing: 1px;
  }

  div.lyrics {
    margin-left: 1%;
    margin-right: 1%;
  }

  .button.musicbutton {
    margin-right: 12px;
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
