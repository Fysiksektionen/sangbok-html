import { BoolSetting, StringSetting } from './settings'

/** General settings used by every "sångblad" regardless of song contents. */
export type GeneralSettings = {
  title: StringSetting,
  showLogo: BoolSetting,
  showDate: BoolSetting,
  showPageNumbers: BoolSetting,
  showMelody: BoolSetting,
  showIndices: BoolSetting,
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
  showPageNumbers: {
    text: 'Inkludera sidnummer',
    type: 'bool',
    value: true
  },
  showMelody: {
    text: 'Inkludera melodi',
    type: 'bool',
    value: true
  },
  showIndices: {
    text: 'Inkludera index',
    type: 'bool',
    value: false
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
