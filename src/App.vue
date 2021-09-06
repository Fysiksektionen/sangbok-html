<template>
    <router-view/>
    <GeneratorView v-if="$store.state.settings.generator"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GeneratorView from '@/views/Generator.vue'

export default defineComponent({
  name: 'Sångbok',
  components: {
    GeneratorView
  }
})
</script>

<style lang="scss">
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
.bg-orange {background-color: #f60;}
.border-orange {border-color: #f60;}

/* Layout */
body {
    margin: 0;
    margin-top: 2.2em;
    transition: 0.1s background-color ease-in-out;
    font-family: 'EB Garamond', serif;

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
}

.night table.songbook tr {
  box-shadow: 0 2px 3px #111;
  border-bottom: 1px solid #111;
  &:active {background-color: #444;}
  &:first-child {box-shadow: 0 1px 5px #111;}
}
</style>
