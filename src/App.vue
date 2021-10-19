<template>
  <Navbar :hideBackButton="$route.meta.hideBackButton"/>
  <div class="flex-row">
    <router-view/>
    <GeneratorView v-if="$store.state.settings.generator"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { themes } from '@/themes'

export default defineComponent({
  name: 'Sångbok',
  components: {
    // Only load Generator component and generator helper functions on-demand.
    GeneratorView: defineAsyncComponent(() => import(/* webpackChunkName: "generator" */ '@/views/Generator.vue')),
    Navbar
  },
  created () {
    // TODO: Ugly fix that removes body night class if stored settings.night === false. Also done in store.
    try {
      const theme = JSON.parse(window.localStorage.getItem('vuex') || '{"settings":{"theme": undefined}}').settings.theme
      if (theme !== undefined && Object.keys(themes).indexOf(theme) !== -1) {
        document.body.className = theme
      } else {
        document.body.className = 'night'
      }
    } catch {
      document.body.className = 'night'
    }
  }
})
</script>

<style lang="scss">
@use "sass:math";
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');
@import './views/Generator.scss';

/* TODO: Load these on-demand. */
@import './themes/night.scss';
@import './themes/day.scss';
@import './themes/galaxy.scss';
@import './themes/neo.scss';
/* @import './themes/fancy.scss'; */
/* @import './themes/z.scss'; */

/* Layout */
html { height: 100%; }
body, #app { min-height: 100vh; }
#app > div.flex-row, #app div.component-swiper { min-height: calc(100vh - 2.3em); /* 2.3em is navbar height. */}
body {
    margin: 0;
    transition: 0.1s background-color ease-in-out;
    font-family: 'EB Garamond', Garamond, serif;
}

.flex-row {display: flex; flex-direction: row;}
.flex-col, #app {display: flex; flex-direction: column;}
div.main {width: 100%;}

/* General */
h2 {text-align: center;}
div.main h2 {
    margin: 0.75em 24px;
    padding: 0;
    padding-top: 0.75em;
}

.button {
    text-align: center;
    font-size: 1em;

    border-width: 0;
    $navbutton-spacing: 12px;
    border-radius: $navbutton-spacing;
    margin: $navbutton-spacing math.div($navbutton-spacing, 2);
    padding: $navbutton-spacing;

    background-color: rgba(128, 128, 128, 0.10);
    &:active:not(.disabled):not(.static) {background-color: rgba(128, 128, 128, 0.30);}
    &.disabled {opacity: 0.5;}
}

img.inline {
  max-height: 100%;
  height: 1em;
  vertical-align: middle;
  margin-bottom: 0.2em;
}

/* Forms */
.toggle {
      float: right;
      width: 0.8em;
      height: 0.8em;
      border-width: 1px;
      border-style: solid;
      border-radius: 0.4em;
      margin-top: 0.3em;
      padding: 0;
  }

/* Tables, etc. */
table.songbook {
    font-size: 1.2em;
    line-height: 2em;
    border-spacing: 0;
    overflow-x: hidden;
    vertical-align: top;

    width: 98%;
    margin: 0 1% 2em 1%;
    border-spacing: 0;

    & td {
      height: 3em;
      vertical-align: middle;
    }

    & .index {padding-left: 1em;}
    & .name {padding-left: 1em;padding-right: 0.5em;}
    & .sheetmusicicon {
      float: right;
      margin-right: 0.5em;
    }
}

ol>li {margin-top: 0.75em}
.textcontainer>p {line-height: 1.5em;font-size: 1.1em;}
</style>
