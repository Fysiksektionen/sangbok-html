<template>
  <div class="settings">
    <SettingsButton :setting="'translate'">Latinska kapitelnamn</SettingsButton>
    <SettingsButton :setting="'night'">Mörk bakgrund</SettingsButton>
    <SettingsButton :setting="'larger'">Större sångtext</SettingsButton>
    <SettingsSwitch :setting="'touchAction'" :values="{'none': 'Inga', 'zoom': 'Zooma', 'swipe': 'Svep', 'all': 'Alla'}">
      Touchfunktioner
    </SettingsSwitch>
    <SettingsButton :setting="'generator'">Skapa sångblad</SettingsButton>
    <ClipboardButton/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SettingsButton from '@/components/SettingsButton.vue'
import SettingsSwitch from '@/components/SettingsSwitch.vue'
import ClipboardButton from '@/components/ClipboardButton.vue'

export default defineComponent({
  name: 'Settings',
  props: ['show'],
  components: {
    SettingsButton,
    ClipboardButton,
    SettingsSwitch
  }
})
</script>

<style scoped lang="scss">
.settings {/* TODO: don't hard-code top positions. */
  top: 1.5em;
}
</style>
