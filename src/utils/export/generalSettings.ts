import { BoolSetting, StringSetting } from './settings'

/** General settings used by every "sångblad" regardless of song contents. */
export type GeneralSettings = {
  title: StringSetting,
  showLogo: BoolSetting,
  showDate: BoolSetting,
  showMelody: BoolSetting,
  showAuthor: BoolSetting,
  showSheetMusicNotice: BoolSetting
}

/** General settings used by every "sångblad" regardless of song contents. */
export const generalSettings: GeneralSettings = {
  title: {
    text: 'Titel på förstasida',
    type: 'string',
    value: 'Sångblad'
  },
  showLogo: {
    text: 'Logga på förstasida',
    type: 'bool',
    value: true
  },
  showDate: {
    text: 'Datum på förstasida',
    type: 'bool',
    value: true
  },
  showMelody: {
    text: 'Inkludera melodi',
    type: 'bool',
    value: true
  },
  showAuthor: {
    text: 'Inkludera författare',
    type: 'bool',
    value: false
  },
  showSheetMusicNotice: {
    text: 'Ta bort notiser om notkapitlet',
    type: 'bool',
    value: true
  }
}
