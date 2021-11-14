<!-- TODO: Perhaps use unicode instead of back.png. -->

<template>
  <div class="navbuttons" v-if="songWrappers">
    <div v-for="songWrapper in songWrappers" v-bind:key="songWrapper.index">
      <!-- We display a navigation button if we found a nearby song -->
      <div class="button" v-if="songWrapper.song"
        @click="$router.replace(songWrapper.chapterPath + '/song/' + songWrapper.index)">
        <div>{{ songWrapper.song.title }}</div>
        <div>
          <img src="@/assets/back_black.png" /> &nbsp;
          <Index :index="songWrapper.song.index" />
        </div>
      </div>
      <!-- Or a filler if none was found. -->
      <div class="filler" v-if="!songWrapper.song"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getOffsetSongFromRoute } from '@/lyrics'
import Index from '@/components/Index.vue'

export default defineComponent({
  name: 'SongNavButtons',
  components: { Index },
  computed: {
    /**
     * Returns a list of SongIndexWrapper:s, containing the previous and next song, as well as the chapter (or list) index and song index in that chapter (or list).
     * If the song is stand-alone (e.g. not in a chapter or a list), returns undefined.
     */
    songWrappers() {
      const out = [getOffsetSongFromRoute(this.$route, -1), getOffsetSongFromRoute(this.$route, 1)]
      return out.indexOf(undefined) === -1 ? out : undefined
    }
  }
})
</script>

<style lang="scss">
  .navbuttons {
    padding: 20px 0;
    text-align: center;

    &>div {
      width: 50%;
      display: inline-block;

      &>div {
        $navbutton-spacing: 12px;
        border-radius: $navbutton-spacing;
        margin: $navbutton-spacing;
        padding: $navbutton-spacing;
        &>div {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &>img {
            height: 0.5em;
          }
        }
      }
      &:last-child > div > div > img { transform: scaleX(-1); }
    }
  }

  div.filler {
    opacity: 0;
  }
</style>
