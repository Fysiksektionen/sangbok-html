<!-- The generator sidebar view. -->
<!-- TODO: This should probably be split into smaller components -->
<template>
  <div class="view-generator">
    <h2>Sångbladsskaparen</h2>

    <!-- Buttons for adding songs or exporting the sångblad. -->
    <div class="generatorbuttons">
      <div v-bind:class="{ 'disabled': !canAdd() }" @click="add()" title="Lägg till" data-test="addButton">+</div>
      <div v-bind:class="{ 'disabled': generatorSongs.length == 0 }" @click="$store.commit('clear');" title="Ta bort alla" data-test="clearButton">🗑</div>
      <div @click="go('overleaf')" title="Öppna i Overleaf"><!--img src="../assets/overleaf_logo.svg" /-->🖉</div>
      <div @click="go('zip')" title="Ladda ner zip-fil med TeX">↓</div>
    </div>

    <!-- List of songs, for editing of song order, etc. -->
    <table class="songbook" v-if="generatorSongs.length > 0">
      <tr v-for="songIdx, listIdx in generatorSongs" v-bind:key="listIdx">
        <td class="name">{{ getSongByStringIndex(songIdx).title }}</td>
        <td class="operation up" v-bind:class="{ 'disabled': listIdx == 0 }"
          @click="$store.commit('move', {index: listIdx, direction: -1})">▲
        </td>
        <td class="operation down" v-bind:class="{ 'disabled': listIdx == generatorSongs.length-1 }"
          @click="$store.commit('move', {index: listIdx, direction: 1})">▼</td>
        <td class="operation delete" @click="$store.commit('delete', listIdx)">✖</td>
      </tr>
    </table>

    <!-- Settings for the sångblad -->
    <div class="generatorsettings">
      <hr>
      <h2>Sångbladsinställningar</h2>
      <div>
        <!-- General settings. Used for every sångblad. -->
        <h3>Allmänt</h3>
        <div class="setting" v-for="setting, idx in generalSettings" v-bind:key="idx">
          <div @click="switchIfBool(setting) && $store.commit('updateGeneralSettings', generalSettings)">
            {{setting.text}}
            <input v-if="setting.type=='string'" placeholder="Text" type="text" v-model="setting.value" />
            <div v-if="setting.type=='bool'" class="toggle border-highlight" v-bind:class="{'bg-highlight': setting.value}">
            </div>
          </div>
        </div>

        <!-- Song-specific settings. Only the ones that are applicable to some added song are shown. -->
        <div v-for="settinggroup, gidx in specificSettings" v-bind:key="gidx">
          <div v-if="$store.getters.settingIsVisible(settinggroup) && settinggroup.settings.length > 0">
            <h3>{{settinggroup.title}}</h3>
            <div class="setting" v-for="setting, idx in settinggroup.settings" v-bind:key="idx"
              @click="switchIfBool(setting) && $store.commit('updateSpecificSettings', specificSettings)">
              {{setting.text}}
              <input v-if="setting.type=='number'" v-bind:placeholder="setting.placeholder" type="number"
                v-model="setting.value" v-bind:min="setting.min" v-bind:max="setting.max" />
              <input v-if="setting.type=='string'" placeholder="Text" type="text" v-model="setting.value" />
              <div v-if="setting.type=='bool'" class="toggle border-highlight" v-bind:class="{'bg-highlight': setting.value}">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End of settings -->

    <!-- Misc. instructions. -->
    <p style="font-size:0.75em; opacity: 0.5; text-align: center;">
      Sångbladsskaparen är experimentell.<br />
      Pennikonen öppnar latex-källan i Overleaf.<br />
      Gå till <a @click="goToListMaker" style="text-decoration: underline;">vyn för redigering av listor</a> för att importera dessa.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import { chapters, getSongsByStringIndices, getSongByStringIndex, getSongFromRoute, getChapterFromRoute } from '@/lyrics'
import { DownloadSetting } from '@/utils/export/settings'

import getContentTeX from '@/utils/export/contentTeX'
import getMainTeX from '@/utils/export/mainTeX'
import openInOverleaf from '@/utils/export/overleaf'
import downloadZip from '@/utils/export/zip'

export default defineComponent({
  name: 'GeneratorView',
  setup() { return { store: useStore(key) } },
  data() {
    return {
      chapters: chapters,
      generatorSongs: useStore(key).state.generator.generatorSongs,
      generalSettings: useStore(key).state.generator.generalSettings,
      specificSettings: useStore(key).state.generator.specificSettings
    }
  },
  methods: {
    // TODO: Don't use this function directly in the template.
    getSongByStringIndex: getSongByStringIndex,
    /**
     * Attempts to add the current song (or the songs of the current chapter) to the generator.
     */
    add() {
      const route: RouteLocationNormalized = this.$route
      if (route.name && route.name.toString().startsWith('Song')) { // A single song.
        const song = getSongFromRoute(route)
        if (song !== undefined) {
          this.store.commit('add', song.index)
        } else { console.warn('Cannot add song, since it could not be read from route. This is unexpected.') }
      } else if (route.name && route.name.toString().startsWith('Chapter')) { // An entire chapter
        const chapter = getChapterFromRoute(route)
        if (chapter !== undefined) {
          for (const song of chapter.songs) {
            this.store.commit('add', song.index)
          }
        } else { console.warn('Cannot add chapter, since it could not be read from route. This is unexpected.') }
      }
      // If we are not in any of the two cases above, we don't add anything.
      // This is also the case when we try to add a song that is already in the generator songs. Nothing happens.
    },
    /**
     * @returns A boolean indicating whether we can
     */
    canAdd(): boolean {
      // TODO: Move to computed
      // TODO: Implement test for this.
      const route: RouteLocationNormalized = useRoute()
      if (route.name && route.name.toString().startsWith('Song')) {
        const song = getSongFromRoute(route)
        return song !== undefined && !this.store.getters.songHasBeenAdded(song.index)
      } else if (route.name && route.name.toString().startsWith('Chapter')) {
        const chapter = getChapterFromRoute(route)
        if (!chapter) return false
        for (const s of chapter.songs) {
          if (!this.store.getters.songHasBeenAdded(s.index)) return true
        }
        return false
      } else { return false }
    },
    /**
     * Inverts the boolean value of a given `setting`, if the setting is a boolean setting.
     * @param setting A DownloadSetting object.
     * @returns true if the setting was changed (that is, if a BooleanSetting was passed), and false otherwise.
     */
    switchIfBool(setting: DownloadSetting): boolean { // Returns true if setting was changed.
      if (setting.type === 'bool') {
        setting.value = !setting.value
        return true
      } else { return false }
    },
    /**
     * Packages the TeX-source, and either sends them, along with the user to Overleaf, or downloads the files as a zip.
     * @param method Either 'zip' or 'overleaf'
     */
    go: async function (method: 'zip' | 'overleaf') {
      // If no songs are added, add all songs. Previously used for debugging.
      const songs = (this.store.state.generator.generatorSongs.length === 0) ? chapters.map(c => c.songs).flat() : getSongsByStringIndices(this.store.state.generator.generatorSongs)

      const files: { [key: string]: string } = { // TODO: Asynchronous loading would be faster (that is, use something like Promise.all instead of multiple awaits)
        'main.tex': getMainTeX(this.generalSettings),
        'blad.cls': await (await fetch('tex/blad.cls')).text(),
        'logga.svg': await (await fetch('tex/logga.svg')).text(),
        'content.tex': getContentTeX(songs, this.generalSettings, this.specificSettings)
      }

      switch (method) {
      case 'overleaf':
        openInOverleaf(files)
        break
      case 'zip':
        downloadZip(files)
        break
      }
    },
    /** Sends the user to the list view, and closes the generator. */
    goToListMaker () {
      this.$router.push('/list/')
      this.store.commit('toggleSettingTo', { key: 'makelist', value: true })
    }
  }
})
</script>

<style lang="scss">
  .view-generator {
    width: 40%;
    right: 0;
    min-width: 8cm;

    & hr {border: none; border-top: 1px solid gray;}

    & .generatorsettings {
      padding: 0.5cm;
    }

    & .setting {
      margin-bottom: 0.8em;

      & input, select {
        float: right;
        // background-color: #f0f0f0;
        text-align: right;
      }
    }
  }

  table.songbook tr:active {
    background-color: unset;
  }

  table.songbook {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  .operation:hover:not(.disabled) {
    cursor: pointer;
  }

  .operation.disabled {
    color: #333
  }

  .generatorbuttons {
    text-align: center;

    &>div {
      display: inline-block;
      background-color: rgba(128, 128, 128, 0.10);

      $navbutton-spacing: 12px;
      border-radius: $navbutton-spacing;
      margin: $navbutton-spacing;
      padding: $navbutton-spacing;
      width: calc(25% - 4 * #{$navbutton-spacing});
      min-width: 1cm;

      font-size: 2em;

      & img {
        max-height: 32px;
      }

      &:hover:not(.disabled) {
        cursor: pointer;
      }

      &.disabled {
        background-color: rgba(128, 128, 128, 0.80);
        color: unset;
      }
    }
  }
</style>
