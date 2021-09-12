<!-- TODO: Add license notices for OSMD and VexFlow.-->
<template>
  <div v-if="!loading && !err">
    <button class="button" @click="zoom(0.8)">&#128269;-</button>
    <button class="button" @click="zoom(1.25)">&#128269;+</button>
  </div>
  <div id="osmd-container"></div>
  <h2 v-if="loading" class="loading">Läser in noter...</h2>
  <div v-if="err" class="err">
    <h2>Kunde inte läsa in noterna.</h2>
    <p><i>{{err}}</i></p>
    <p>URL: {{$props.src}}</p>
  </div>
  <p class="notice">
    Notvisaren är experimentell.
    <br>
    Drivs av <a href="https://opensheetmusicdisplay.org">OpenSheetMusicDisplay</a> & <a href="https://www.vexflow.com">VexFlow</a>.
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'

export default defineComponent({
  name: 'SheetMusicRenderer',
  props: ['src'],
  data () {
    return {
      osmd: undefined as (OpenSheetMusicDisplay | undefined),
      store: this.$store,
      err: undefined as (string | undefined),
      loading: true
    }
  },
  mounted() {
    this.osmd = new OpenSheetMusicDisplay('osmd-container', { // For options, see https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/master/src/OpenSheetMusicDisplay/OSMDOptions.ts
      autoResize: true, // just an example for an option, no option is necessary.
      backend: 'svg',
      drawTitle: true,
      drawLyrics: true,
      drawMeasureNumbersOnlyAtSystemStart: true,
      defaultFontFamily: 'EB Garamond'
    })
    this.osmd.load(this.$props.src).then(() => {
      this.loading = false
      if (this.osmd) {
        this.osmd.zoom = (window.innerWidth > 960) ? 1.0 : 0.4096
        this.osmd.render()
      } else {
        throw new Error('OSMD is undefined despite osmd.load call.')
      }
    }).catch((e) => { this.err = e; this.loading = false })
  },
  methods: {
    async zoom (factor: number) {
      if (this.osmd) {
        this.osmd.zoom *= factor
        setTimeout(() => this.osmd && this.osmd.render(), 0) // TODO: There has to be a cleaner way to do this.
      }
    }
  }
})
</script>

<style scoped lang="scss">
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
    color: adjust-color(#f60, $lightness:-15);  /* TODO: Define elsewhere */
  }
</style>

<style lang="scss">
  /* Needs to be non-scoped, since the svg is dynamically generated, outside of the control of Vue. */
  $gray: darken(#d9ccbf, 12%);
  .night div#osmd-container svg {
    & text {fill: $gray}
    & path {stroke: $gray; fill: $gray}
    &>path {stroke: adjust-color($gray, $lightness:-25); fill: $gray}
    & rect:not(:first-child) {fill: $gray}
  }
</style>
