<!-- TODO: Add license notices for OSMD and VexFlow.-->
<template>
  <div class="zoombuttoncontainer">
    <button class="button" @click="zoom(-1)" v-bind:class="{'disabled': zoomIdx == 0}">&#128269;-</button>
    <button class="button" @click="zoom(1)" v-bind:class="{'disabled': zoomIdx == getZoomLevels().length-1}">&#128269;+</button>
  </div>
  <div v-for="img, key in getImages()" v-bind:key="key">
    <img v-bind:src="img">
  </div>
  <h2 v-if="loading" class="loading">Läser in noter...</h2>
  <div v-if="err" class="err">
    <h2>Kunde inte läsa in noterna.</h2>
    <p><i>{{err}}</i></p>
    <p>URL: {{$props.src}}</p>
  </div>
  <p class="notice">
    Notvisaren är experimentell.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import svglist from '@/assets/msvgs.json'

export default defineComponent({
  name: 'SheetMusicRenderer',
  props: ['src'],
  data () {
    return {
      store: this.$store,
      zoomIdx: 3, // TODO: Choose based on screen size
    }
  },
  // mounted() {},
  methods: {// TODO: Most of these can be pre-computed, and put in data.
    getImages (): string[] {
      let curSongSvgs = svglist.filter(s => { return s.indexOf(this.$props.src) > -1 })
      let curSongSvgsWithZoom = curSongSvgs.filter(s => (s.match(/-sf(\d(\.\d+)?)-/i) || ["", ""])[1] === this.getZoomLevels()[this.zoomIdx])
      console.log(this.getZoomLevels())
      return curSongSvgsWithZoom.map(s => "msvg/" + s)
    },
    getZoomLevels () {
      let curSongSvgs = svglist.filter(s => { return s.indexOf(this.$props.src) > -1 })
      let zoomLevels = [...new Set(curSongSvgs.map(s => (s.match(/-sf(\d(\.\d+)?)-/i) || ["", ""])[1]))]
      return zoomLevels.sort()
    },
    zoom (z: number) {
      this.zoomIdx += z
      this.zoomIdx = Math.max(0, Math.min(this.zoomIdx, this.getZoomLevels().length - 1))
    }
  }
})
</script>

<style scoped lang="scss">
  img {
    width: 100%;
  }

  .night img {
    filter: invert(0.6);/* Originally #c2ad99*/
  }

  .err {
    text-align: center;
    & p {
      font-style: italic;
      font-size: 75%;
      opacity: 75%;
    }
  }

  .loading {
    text-align: center;
  }

  .notice {
    text-align: center;
    font-size: 75%;
  }

  a {
    color: adjust-color(#f60, $lightness:-15%);  /* TODO: Define elsewhere */
  }
</style>

<style lang="scss">
  /* Needs to be non-scoped, since the svg is dynamically generated, outside of the control of Vue. */
  $gray: darken(#d9ccbf, 12%);
  .night div#osmd-container svg {
    & text {fill: $gray}
    & path {stroke: $gray; fill: $gray}
    &>path {stroke: adjust-color($gray, $lightness:-25%); fill: $gray}
    & rect:not(:first-child) {fill: $gray}
  }
</style>
