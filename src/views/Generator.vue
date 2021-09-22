<!-- TODO: This should probably be split into smaller components... -->
<template>
  <div class="generator">
    <h2>Sångbladsskaparen</h2>
    <p style="text-align: center;">Är för närvarande experimentell.</p>

    <table class="songbook">
      <tr v-for="songIdxs, listIdx in generatorSongs" v-bind:key="listIdx">
        <td class="name">{{ chapters[songIdxs[0]].songs[songIdxs[1]].title }}</td>
        <td class="operation up" v-bind:class="{ 'disabled': listIdx == 0 }" @click="$store.commit('move', {index: listIdx, direction: -1})">▲
        </td>
        <td class="operation down" v-bind:class="{ 'disabled': listIdx == generatorSongs.length-1 }"
          @click="$store.commit('move', {index: listIdx, direction: 1})">▼</td>
        <td class="operation delete" @click="$store.commit('delete', listIdx)">✖</td>
      </tr>
    </table>

    <div class="generatorbuttons">
      <div v-bind:class="{ 'disabled': !canAdd() }" @click="add()" title="Lägg till">+</div>
      <div @click="go('overleaf')" title="Öppna i Overleaf">☁</div>
      <div @click="go('zip')" title="Ladda ner">↓</div>
    </div>

    <div class="generatorsettings">
      <h2>Sångbladsinställningar</h2>
      <div>

        <h3>Allmänt</h3>
        <div class="setting" v-for="setting, idx in generalSettings" v-bind:key="idx">
          <div @click="switchIfBool(setting) && $store.commit('updateGeneralSettings', generalSettings)">
            {{setting.text}}
            <input v-if="setting.type=='string'" placeholder="Text" type="text" v-model="setting.value" />
            <div v-if="setting.type=='bool'" class="toggle border-orange" v-bind:class="{'bg-orange': setting.value}">
            </div>
          </div>
        </div>

        <div v-for="settinggroup, gidx in specificSettings" v-bind:key="gidx">
          <div v-if="$store.getters.settingIsVisible(settinggroup) && settinggroup.settings.length > 0">
            <h3>{{settinggroup.title}}</h3>
            <div class="setting" v-for="setting, idx in settinggroup.settings" v-bind:key="idx"
              @click="switchIfBool(setting) && $store.commit('updateSpecificSettings', specificSettings)">
              {{setting.text}}
              <input v-if="setting.type=='number'" v-bind:placeholder="setting.placeholder" type="number"
                v-model="setting.value" v-bind:min="setting.min" v-bind:max="setting.max" />
              <input v-if="setting.type=='string'" placeholder="Text" type="text" v-model="setting.value" />
              <div v-if="setting.type=='bool'" class="toggle border-orange" v-bind:class="{'bg-orange': setting.value}">
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import { chapters, getSongsByIndices } from '@/utils/lyrics'
import { DownloadSetting } from '@/utils/export/settings'

import getContentTeX from '@/utils/export/contentTeX'
import getMainTeX from '@/utils/export/mainTeX'
import openInOverleaf from '@/utils/export/overleaf'
import downloadZip from '@/utils/export/zip'

export default defineComponent({
  name: 'GeneratorView',
  data() {
    return {
      chapters: chapters,
      generatorSongs: useStore(key).state.generator.generatorSongs,
      generalSettings: useStore(key).state.generator.generalSettings,
      specificSettings: useStore(key).state.generator.specificSettings
    }
  },
  setup () { return { store: useStore(key) } },
  props: ['songid', 'chapterid'],
  methods: {
    add() {
      const route: RouteLocationNormalized = this.$route
      if (route.params.songId !== undefined && route.params.chapterId !== undefined) { // Song
        const songId = parseInt(route.params.songId as string)
        const chapterId = parseInt(route.params.chapterId as string)
        this.store.commit('add', [chapterId, songId])
      } else if (route.params.cid !== undefined) { // Chapter
        const chapterId = parseInt(route.params.cid as string)
        for (let songId = 0; songId < this.chapters[chapterId].songs.length; songId++) {
          this.store.commit('add', [chapterId, songId])
        }
      }
    },
    canAdd(): boolean { // TODO: Move to computed
      const route: RouteLocationNormalized = useRoute()
      if (route.params.songId !== undefined && route.params.chapterId !== undefined) { // Song
        const songId = parseInt(route.params.songId as string)
        const chapterId = parseInt(route.params.chapterId as string)
        return !this.store.getters.songHasBeenAdded(songId, chapterId)
      } else if (route.params.cid !== undefined) { // Chapter
        // TODO: Return false if all songs in a given chapter has been added.
        return true
      } else { return false }
    },
    switchIfBool(setting: DownloadSetting): boolean { // Returns true if setting was changed.
      if (setting.type === 'bool') {
        setting.value = !setting.value
        return true
      } else { return false }
    },
    go: async function (method: 'zip' | 'overleaf') {
      const songs = (this.store.state.generator.generatorSongs.length === 0) ? chapters.map(c => c.songs).flat() : getSongsByIndices(this.store.state.generator.generatorSongs)

      const files: { [key: string]: string } = { // TODO Load asynchronously, that is, don't use await right here.
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
    }
  }
})
</script>

<style scoped lang="scss">
  .generator {
    width: 40%;
    right: 0;
    min-width: 8cm;

    & .generatorsettings {
      padding: 0.5cm;
    }

    & .setting {
      margin-bottom: 0.8em;

      & input {
        float: right;
        background-color: #f0f0f0;
        border: none;
        border-radius: 0.3em;
        padding-left: 0.5em !important;
        padding-right: 0.5em !important;
        height: 1.8em;
        text-align: right;
      }
    }
  }

  .night .generator .setting input {
    color: white;
    background-color: #444;
  }

  table.songbook tr:active {
    background-color: unset;
  }

  .operation:hover:not(.disabled) {
    cursor: pointer;
  }

  .operation.disabled {
    color: #333
  }

  .generatorbuttons {
    padding-bottom: 20px;
    text-align: center;

    &>div {
      display: inline-block;
      background-color: rgba(128, 128, 128, 0.10);

      $navbutton-spacing: 12px;
      border-radius: $navbutton-spacing;
      margin: $navbutton-spacing;
      padding: $navbutton-spacing;
      width: calc(33% - 4 * #{$navbutton-spacing});

      color: #f60;
      font-size: 2em;

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
