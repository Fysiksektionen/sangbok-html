<!-- TODO: This should probably be split into smaller components... -->
<template>
  <div class="generator">
    <h2>Sångbladsskaparen</h2>
    <p style="text-align: center;">Är för närvarande experimentell.</p>
    <table class="songbook">
      <tr v-for="songIdxs, listIdx in generatorSongs" v-bind:key="listIdx">
        <td class="name">{{ chapters[songIdxs[0]].songs[songIdxs[1]].title }}</td>
        <td class="operation up" v-bind:class="{ 'disabled': listIdx == 0 }" @click="listIdx > 0 && move(listIdx, -1)">▲
        </td>
        <td class="operation down" v-bind:class="{ 'disabled': listIdx == generatorSongs.length-1 }"
          @click="listIdx < generatorSongs.length && move(listIdx, 1)">▼</td>
        <td class="operation delete" @click="generatorSongs.splice(listIdx, 1)">✖</td>
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
          <div @click="switchIfBool(setting)">
            {{setting.text}}
            <input v-if="setting.type=='string'" placeholder="Text" type="text" v-model="setting.value" />
            <div v-if="setting.type=='bool'" class="toggle border-orange" v-bind:class="{'bg-orange': setting.value}">
            </div>
          </div>
        </div>
        <div v-for="settinggroup, gidx in specificSettings" v-bind:key="gidx">
          <div v-if="settingIsVisible(settinggroup) && settinggroup.settings.length > 0">
            <h3>{{settinggroup.title}}</h3>
            <div class="setting" v-for="setting, idx in settinggroup.settings" v-bind:key="idx"
              @click="switchIfBool(setting)">
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

import { chapters, Song } from '@/utils/lyrics.ts'
import { DownloadSetting } from '@/utils/export/settings.ts'
import { generalSettings, GeneralSettings } from '@/utils/export/generalSettings.ts'
import { specificSettings, SpecificDownloadSettings } from '@/utils/export/specificSettings.ts'

import getContentTeX from '@/utils/export/contentTeX.ts'
import getMainTeX from '@/utils/export/mainTeX.ts'
import openInOverleaf from '@/utils/export/overleaf.ts'
import downloadZip from '@/utils/export/zip.ts'

  type SongIndex = [number, number]

export default defineComponent({
  name: 'GeneratorView',
  data() {
    return {
      generatorSongs: [] as SongIndex[], // TODO: Perhaps should be stored using $store.
      chapters: chapters,
      generalSettings: generalSettings as GeneralSettings,
      specificSettings: specificSettings as SpecificDownloadSettings[]
    }
  },
  props: ['songid', 'chapterid'],
  methods: {
    add() {
      if (this.$route.params.songId !== undefined && this.$route.params.chapterId !== undefined) { // Song
        const songId = parseInt(this.$route.params.songId as string)
        const chapterId = parseInt(this.$route.params.chapterId as string)
        this.songHasBeenAdded(songId, chapterId) || this.generatorSongs.push([songId, chapterId])
      } else if (this.$route.params.cid !== undefined) { // Chapter
        const chapterId = parseInt(this.$route.params.cid as string)
        for (let songId = 0; songId < this.chapters[chapterId].songs.length; songId++) {
          this.songHasBeenAdded(chapterId, songId) || this.generatorSongs.push([chapterId, songId])
        }
      }
    },
    move(index: number, direction: number) {
      var temp = this.generatorSongs[index]
      this.generatorSongs[index] = this.generatorSongs[index + direction]
      this.generatorSongs[index + direction] = temp
    },
    canAdd(): boolean { // TODO: Move to computed
      if (this.$route.params.songId !== undefined && this.$route.params.chapterId !== undefined) { // Song
        return !this.songHasBeenAdded(parseInt(this.$route.params.songId as string), parseInt(this.$route.params.chapterId as string))
      } else if (this.$route.params.cid !== undefined) { // Chapter
        // TODO: Return false if all songs in a given chapter has been added.
        return true
      } else { return false }
    },
    songHasBeenAdded(chapterid: number, songid: number): boolean {
      // TODO: Can probably be done in a more vectorized fashion
      for (const indices of this.generatorSongs) {
        if (indices[0] === chapterid && indices[1] === songid) {
          return true
        }
      }
      return false
    },
    switchIfBool(setting: DownloadSetting): void {
      setting.value = !setting.value
    },
    getSongs(indices: SongIndex[]): Song[] {
      const out: Song[] = []
      for (const songIndex of indices) {
        out.push(chapters[songIndex[0]].songs[songIndex[1]])
      }
      return out
    },
    settingIsVisible(setting: SpecificDownloadSettings): boolean {
      const currentIndicesGreek = this.getSongs(this.generatorSongs).map((s: Song) => s.index)
      return [...setting.indexes].filter((i: string) => currentIndicesGreek.indexOf(i) > -1).length > 0
    },
    go: async function (method: 'zip' | 'overleaf') {
      const songs = (this.generatorSongs.length === 0) ? chapters.map(c => c.songs).flat() : this.getSongs(this.generatorSongs)

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
