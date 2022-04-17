import './Generator.scss'

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

// TODO: This should probably be split into smaller components
/** The generator sidebar view. */
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
    goToListMaker() {
      this.$router.push('/list/')
      this.store.commit('toggleSettingTo', { key: 'makelist', value: true })
    }
  },
  render() {
    return (
      <div class="view-generator">
        <h2>Sångbladsskaparen</h2>

        {/* <Buttons for adding songs or exporting the sångblad. */}
        <div class="generatorbuttons">
          <div class={{ disabled: !this.canAdd() }} onClick={this.add} title="Lägg till" data-test="addButton">+</div>
          <div class={{ disabled: this.generatorSongs.length === 0 }} onClick={() => this.store.commit('clear')} title="Ta bort alla" data-test="clearButton">🗑</div>
          <div onClick={() => this.go('overleaf')} title="Öppna i Overleaf">🖉</div>
          <div onClick={() => this.go('zip')} title="Ladda ner zip-fil med TeX">↓</div>
        </div>

        {/*  List of songs, for editing of song order, etc. */}
        {this.generatorSongs.length > 0 &&
          <table class="songbook">
            {this.generatorSongs.map((songIdx, listIdx) =>
              <tr>
                {/* TODO: Handle undefined errors better */}
                <td class="name">{this.getSongByStringIndex(songIdx)?.title}</td>
                <td class={{ operation: true, up: true, disabled: listIdx === 0 }}
                  onClick={() => this.store.commit('move', { index: listIdx, direction: -1 })}>▲</td>
                <td class={{ operation: true, down: true, disabled: listIdx === this.generatorSongs.length - 1 }}
                  onClick={() => this.store.commit('move', { index: listIdx, direction: 1 })}>▼</td>
                <td class="operation delete" onClick={() => this.store.commit('delete', listIdx)}>✖</td>
              </tr>
            )}
          </table>}

        {/* Settings for the sångblad */}
        <div class="generatorsettings">
          <hr />
          <h2>Sångbladsinställningar</h2>
          <div>
            {/* General settings. Used for every sångblad. */}
            <h3>Allmänt</h3>
            {Object.values(this.generalSettings).map((setting) => <div class="setting">
              <div onClick={() => this.switchIfBool(setting) && this.store.commit('updateGeneralSettings', this.generalSettings)}>
                {setting.text}
                {setting.type === 'string' && <input placeholder="Text" type="text" v-model={setting.value} />}
                {setting.type === 'bool' && <div class={{ toggle: true, 'border-highlight': true, 'bg-highlight': setting.value }} />}
              </div>
            </div>)}

            {/* Song-specific settings. Only the ones that are applicable to some added song are shown. */}
            {Object.values(this.specificSettings).map((settinggroup) =>
              <div>
                {this.store.getters.settingIsVisible(settinggroup) && settinggroup.settings.length > 0 &&
                  <div>
                    <h3>{settinggroup.title}</h3>
                    {settinggroup.settings.map((setting) =>
                      <div class="setting"
                        onClick={() => this.switchIfBool(setting) && this.store.commit('updateSpecificSettings', this.specificSettings)}>
                        {setting.text}
                        {setting.type === 'number' && <input placeholder="setting.placeholder" type="number"
                          v-model={setting.value} min="setting.min" max="setting.max" />}
                        {setting.type === 'string' && <input placeholder="Text" type="text" v-model={setting.value} />}
                        {setting.type === 'bool' && <div class={{ toggle: true, 'border-highlight': true, 'bg-highlight': setting.value }} />}
                      </div>)}
                  </div>}
              </div>
            )}
          </div>
        </div>
        {/* End of settings */}

        {/* Misc. instructions. */}
        <p style="font-size:0.75em; opacity: 0.5; text-align: center;">
          Sångbladsskaparen är experimentell.<br />
          Pennikonen öppnar latex-källan i Overleaf.<br />
          Gå till <a onClick={this.goToListMaker} style="text-decoration: underline;">vyn för redigering av listor</a> för att importera dessa.
        </p>
      </div>
    )
  }
})
