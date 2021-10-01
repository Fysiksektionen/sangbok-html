<template>
    <router-view/>
    <GeneratorView v-if="$store.state.settings.generator"/>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'

export default defineComponent({
  name: 'Sångbok',
  components: {
    // Only load Generator component and generator helper functions on-demand.
    GeneratorView: defineAsyncComponent(() => import(/* webpackChunkName: "generator" */ '@/views/Generator.vue')
    )
  },
  created () {
    // TODO: Ugly fix that removes body night class if stored settings.night === false.
    document.body.className = (JSON.parse(window.localStorage.getItem('vuex') || '{"settings":{"night": true}}').settings.night === true) ? 'night' : ''
  }
})
</script>

<style lang="scss">
@use "sass:math";
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap');

/* Colors */
/* $f-orange: #FF642B;
$f-orange-light: #FB9C74;
$f-orange-lighter: #F7D48C;
$f-porcelain: #f5f4f4;
$f-navy: #132a3e;
$f-gray-violet: #2f3b4b;
$f-gray-navy: #3B5262;
$f-gray-turqoise: #829899;
$f-blue: #1757A3;
$f-sky: #58a7cb;
$f-green: #197F2A;
$f-onyx: #221F20; */

/* Color classes. Used by views and components */
.bg-orange {background-color: #f60;color: #000;}
.border-orange {border-color: #f60;}

/* Layout */
body {
    margin: 0;
    margin-top: 2.2em;
    transition: 0.1s background-color ease-in-out;
    font-family: 'EB Garamond', Garamond, serif;

    &.night {
      /* TODO: Since <body> is outside of Vue's scope, the night class is set through an ugly fix in the @/store/index.ts file. This can probably be made more elegantly. */
      background-color: #222;
      color: #ddd;
    }
}

#app {display: flex;}
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
    font-family: "EB Garamond", serif;

    border-width: 0;
    $navbutton-spacing: 12px;
    border-radius: $navbutton-spacing;
    margin: $navbutton-spacing math.div($navbutton-spacing, 2);
    padding: $navbutton-spacing;

    background-color: rgba(128, 128, 128, 0.10);
    &:active:not(.disabled):not(.static) {background-color: rgba(128, 128, 128, 0.30);}
    &.disabled {opacity: 0.5;}
}

.night .button {
  color: white;
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
    & tr {
      box-shadow: 0 2px 3px #aaa;
      border-bottom: 1px solid #aaa;
      &:active {background-color: #f3f3f3;}
      &:first-child {box-shadow: 0 1px 5px #aaa;}
    }

    & .index {padding-left: 1em;}
    & .name {padding-left: 1em;padding-right: 0.5em;}
    & .sheetmusicicon {
      float: right;
      margin-right: 0.5em;
    }
}

.night table.songbook tr {
  box-shadow: 0 2px 3px #111;
  border-bottom: 1px solid #111;
  &:active {background-color: #444;}
  &:first-child {box-shadow: 0 1px 5px #111;}
}

ol>li {margin-top: 0.75em}
.textcontainer>p {line-height: 1.5em;font-size: 1.1em;}
</style>
