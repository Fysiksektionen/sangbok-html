<template>
  <div class="component-settings">
    <SettingsButton :setting="'translate'">Latinska kapitelnamn</SettingsButton>
    <SettingsSwitch :setting="'theme'" :values="themes">
      Tema
    </SettingsSwitch>
    <SettingsButton :setting="'larger'">Större sångtext</SettingsButton>
    <SettingsSwitch :setting="'touchAction'" :values="{'none': 'Inga', 'zoom': 'Zooma', 'swipe': 'Svep', 'all': 'Alla'}">
      Touchfunktioner
    </SettingsSwitch>
    <SettingsButton :setting="'sheetmusic'">Noter</SettingsButton>
    <SettingsButton :setting="'generator'" data-test="generatorSettingsButton">Skapa sångblad</SettingsButton>
    <SettingsButton :setting="'makelist'">Redigera listor</SettingsButton>
    <ClipboardButton/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SettingsButton from './SettingsButton.vue'
import SettingsSwitch from './SettingsSwitch.vue'
import ClipboardButton from './ClipboardButton.vue'
import { themes } from '@/themes'

export default defineComponent({
  name: 'Settings',
  props: ['show'],
  data () {
    return {
      themes: themes
    }
  },
  components: {
    SettingsButton,
    ClipboardButton,
    SettingsSwitch
  }
})
</script>

<style lang="scss">
.component-settings {/* TODO: don't hard-code top positions. */
  top: 1.5em;
      position: fixed;
      left: 0;
      right: 0;
      padding: 0.5em;
      padding-bottom: 0;
      font-size: 1.2em;
      transition: top 0.3s ease-in-out;
      z-index: 9;

      &>div{
          width: 100%;
          padding: 0.8em 0;
      }
      & .copy .checkmark {
        float: right;
        width: 0.8em;
        height: 0.8em;
        padding: 0;
        margin-right: 0.1em;
    }
  }
</style>
