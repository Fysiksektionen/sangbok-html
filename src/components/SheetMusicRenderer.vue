<template>
  <div class="component-sheet-music-renderer">
    <div class="zoombuttoncontainer">
      <button class="button" @click="zoom(-1)" v-bind:class="{'disabled': zoomIdx == 0}">&#128269;-</button>
      <button class="button" @click="zoom(1)"
        v-bind:class="{'disabled': zoomIdx == getZoomLevels().length-1}">&#128269;+</button>
    </div>
    <div v-for="img, key in getImages()" v-bind:key="key">
      <img v-bind:src="img" alt="Loading..." @load="isLoading=false">
    </div>
    <div v-if="getImages().length == 0">
      <h2>Fel</h2>
      <p style="text-align: center;">Inga noter hittades, trots att de borde finnas. Skicka ett surt mail till webmaster
        eller sångbokens projektledare.</p>
    </div>
    <div v-if="isLoading">
      <h2>Laddar...</h2>
    </div>
    <p class="notice">
      Notvisaren är experimentell.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import svglist from '@/assets/msvgs.json'

export default defineComponent({
  name: 'SheetMusicRenderer',
  props: ['src'],
  data() {
    return {
      zoomIdx: Math.min((window.matchMedia('only screen and (max-width: 760px)').matches) ? 5 : 3, this.getZoomLevels().length - 1),
      isLoading: true
    }
  },
  // mounted() {},
  methods: { // TODO: Most of these can be pre-computed, and put in data.
    getImages(): string[] {
      const curSongSvgs = svglist.filter(s => { return s.indexOf(this.$props.src) > -1 })
      const curSongSvgsWithZoom = curSongSvgs.filter(s => (s.match(/-sf(\d(\.\d+)?)-/i) || ['', ''])[1] === this.getZoomLevels()[this.zoomIdx])
      return curSongSvgsWithZoom.map(s => 'msvg/' + s)
    },
    getZoomLevels() {
      const curSongSvgs = svglist.filter(s => { return s.indexOf(this.$props.src) > -1 })
      const zoomLevels = [...new Set(curSongSvgs.map(s => (s.match(/-sf(\d(\.\d+)?)-/i) || ['', ''])[1]))]
      return zoomLevels.sort()
    },
    zoom(z: number) {
      this.zoomIdx += z
      this.zoomIdx = Math.max(0, Math.min(this.zoomIdx, this.getZoomLevels().length - 1))
    }
  }
})
</script>

<style lang="scss">
  .component-sheet-music-renderer {

    /* Layout */
    img {
      width: 100%;
    }

    & .err {
      text-align: center;

      & p {
        font-style: italic;
        font-size: 75%;
        opacity: 75%;
      }
    }

    & .loading {
      text-align: center;
    }

    & .notice {
      text-align: center;
      font-size: 75%;
    }
  }
</style>
