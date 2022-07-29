import './Settings.scss'

import { RouteLocationNormalized, useRoute } from 'vue-router'

import SettingsButton from './SettingsButton'
import SettingsSwitch from './SettingsSwitch'
import ClipboardButton from './ClipboardButton'
import { themes } from '@/themes'
import { BooleanSettings, MultipleStateSettings } from '@/store'

/**
 * Component for the settings dropdown menu.
 * Props are passed through to the dropdown root div.
 */
export default function SettingsComponent(props: Record<string, unknown>): JSX.Element {
  const route: RouteLocationNormalized = useRoute()
  const isSongStage = route.name && route.name.toString().startsWith('Song')
  const touchActions = { none: 'Inga', zoom: 'Zooma', swipe: 'Svep', all: 'Alla' }

  return (
    <div class="component-settings" {...props}>
      <SettingsButton setting={BooleanSettings.translate}>Latinska kapitelnamn</SettingsButton>
      <SettingsSwitch setting={MultipleStateSettings.theme} values={themes}>Tema</SettingsSwitch>
      <SettingsButton setting={BooleanSettings.larger}>Större sångtext</SettingsButton>
      <SettingsSwitch setting={MultipleStateSettings.touchAction} values={touchActions}> Touchfunktioner</SettingsSwitch>
      <SettingsButton setting={BooleanSettings.livesearch}>Live-sökning</SettingsButton>
      <SettingsButton setting={BooleanSettings.fixednavbuttons}>Fixerade navigationsknappar</SettingsButton>
      <SettingsButton setting={BooleanSettings.sheetmusic}>Noter</SettingsButton>
      <SettingsButton setting={BooleanSettings.generator} data-test={'generatorSettingsButton'}>Skapa sångblad</SettingsButton>
      <SettingsButton setting={BooleanSettings.makelist}>Redigera listor</SettingsButton>
      {isSongStage && <ClipboardButton />}
    </div>
  )
}
