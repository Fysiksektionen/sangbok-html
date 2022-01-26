import { defineComponent } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

import SettingsButton from './SettingsButton'
import SettingsSwitch from './SettingsSwitch.vue'
import ClipboardButton from './ClipboardButton'
import { themes } from '@/themes'
import './index.scss'

export default defineComponent({
  name: 'Settings',
  render() {
    const route: RouteLocationNormalized = this.$route
    const isSongStage = route.name && route.name.toString().startsWith('Song')
    const touchActions = { 'none': 'Inga', 'zoom': 'Zooma', 'swipe': 'Svep', 'all': 'Alla' };

    return (
      <div class="component-settings">
        <SettingsButton setting='translate'>Latinska kapitelnamn</SettingsButton>
        <SettingsSwitch setting='theme' values={ themes }>Tema</SettingsSwitch>
        <SettingsButton setting='larger'>Större sångtext</SettingsButton>
        <SettingsSwitch setting='touchAction' values={ touchActions }> Touchfunktioner</SettingsSwitch>
        <SettingsButton setting='sheetmusic'>Noter</SettingsButton>
        <SettingsButton setting='generator' data-test='generatorSettingsButton'>Skapa sångblad</SettingsButton>
        <SettingsButton setting='makelist'>Redigera listor</SettingsButton>
        {isSongStage && <ClipboardButton />}
      </div>
    )
  }
})
