<template>
  <div v-bind:class="{'night': $store.state.settings.night}">
    <router-view/>
  </div>
</template>

<style lang="scss">
/* Other, unmigrated */
body {
    margin: 0;
    margin-top: 2.2em;
    transition: 0.1s background-color ease-in-out;
}

body.night, #app > div.night {
    background-color: #222;
}

.songbook {
    overflow-x: hidden;
    font-family: 'EB Garamond', serif;
    vertical-align: top;
  width: 100%;
}

.songbook table, table.songbook {
    width: 100%;
    font-size: 1.2em;
    line-height: 2em;
    color: #333;
    border-spacing: 0;
}

.night table {
    color: #ddd;
}

.songbook td {
    height: 3em;
    vertical-align: middle;
}

.songbook tr {
    box-shadow: 0 2px 3px #aaa;
    border-bottom: 1px solid #aaa;
}

.songbook tr.nohits {
    text-align: center;
    box-shadow: unset !important;
    border-bottom: unset !important;
}

.night .songbook tr {
    box-shadow: 0 2px 3px #111;
    border-bottom: 1px solid #111;
}

.songbook tr:active {
    background-color: #f3f3f3;
}

.night .songbook tr:active {
    background-color: #444;
}
.songbook tr:first-child {
    box-shadow: 0 1px 5px #aaa;
}

.night .songbook tr:first-child {
    box-shadow: 0 1px 5px #111;
}

.index {
    padding-left: 1em;
}

.name {
    padding-left: 1em;
    padding-right: 0.5em;
}

.chaptertitle {
    text-align: center;
    color: #333;
    margin: 0.75em 24px 0.75em;
    padding: 0;
}

.night .chaptertitle {
    color: #ddd;
}
</style>
