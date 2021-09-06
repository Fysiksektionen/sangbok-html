<template>
  <div class="settings" v-bind:class="{'visible': $props.show}">
    <SettingsButton :setting="'translate'">Latinska kapitelnamn</SettingsButton>
    <SettingsButton :setting="'night'">Mörk bakgrund</SettingsButton>
    <SettingsButton :setting="'larger'">Större sångtext</SettingsButton>
    <SettingsButton :setting="'generator'">Skapa sångblad</SettingsButton>
    <!--div class="copy" ng-if="stage == stages.lyrics" ng-click="copyToClipboard(chapters[current.chapterindex].songs[current.songindex])">
        Kopiera sångtext
    </div-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SettingsButton from '@/components/SettingsButton.vue'

export default defineComponent({
  name: 'Settings',
  props: ['show'],
  components: {
    SettingsButton
  }
})
</script>

<style scoped lang="scss">
.settings {/* TODO: don't hard-code top positions. */
  transition: all 0.3s ease-in-out;
  position: sticky;
  top: 1.5em;
  &:not(.visible) {
    top: -14em;
  }
}
</style>
