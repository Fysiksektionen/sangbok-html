type BoolSetting = {
  text: string,
  type: 'bool',
  value: boolean
}

type StringSetting = {
  text: string,
  type: 'string',
  value: string
}

type NumberSetting = {
  text: string,
  type: 'number',
  value: number,
  min: number,
  max: number,
  placeholder?: string
}

type DownloadSetting = BoolSetting | StringSetting | NumberSetting

export type DownloadSettings = {
  title: string,
  indexes?: [number, number][],
  settings: DownloadSetting[]
}

export const downloadSettings: {[key: string]: DownloadSettings} = {
  general: {
    title: 'Allmänt',
    settings: [{
      text: 'Titel på förstasida',
      type: 'string',
      value: 'Sångblad'
    }, {
      text: 'Logga på förstasida',
      type: 'bool',
      value: true
    }, {
      text: 'Datum på förstasida',
      type: 'bool',
      value: true
    }, {
      text: 'Inkludera melodi',
      type: 'bool',
      value: true
    }, {
      text: 'Inkludera författare',
      type: 'bool',
      value: false
    }, {
      text: 'Ta bort notiser om notkapitlet',
      type: 'bool',
      value: true
    }]
  }
}

// eslint-disable @typescript-eslint/no-unused-vars
const downloadSettingsOld: DownloadSettings[] = [
  {
    title: 'Allmänt',
    settings: [{
      text: 'Titel på förstasida',
      type: 'string',
      value: 'Sångblad'
    }, {
      text: 'Logga på förstasida',
      type: 'bool',
      value: true
    }, {
      text: 'Datum på förstasida',
      type: 'bool',
      value: true
    }, {
      text: 'Inkludera melodi',
      type: 'bool',
      value: true
    }, {
      text: 'Inkludera författare',
      type: 'bool',
      value: false
    }]
  }, {
    title: 'Notkapitlet',
    indexes: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [3, 7], [9, 7], [9, 12], [10, 3], [10, 5], [13, 4], [13, 6]],
    settings: [{
      text: 'Ta bort notis om notkapitlet',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'Årskursernas hederssång',
    indexes: [[13, 1]],
    settings: [{
      text: 'Inkludera t.o.m.',
      type: 'number',
      value: new Date().getFullYear() - 5,
      min: 1900,
      max: 2100,
      placeholder: 'År'
    }, {
      text: 'Inkludera "gästerna"',
      type: 'bool',
      value: false
    }, {
      text: 'Inkludera "köket"',
      type: 'bool',
      value: false
    }, {
      text: 'Stigande ordning',
      type: 'bool',
      value: false
    }]
  }, {
    title: 'Système International och liknande',
    indexes: [[8, 0], [8, 17], [8, 18]],
    settings: [{
      text: 'Ordna texten regelbundet',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'The BASIC song',
    indexes: [[8, 4]],
    settings: [{
      text: 'Monospace-typsnitt',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'Fredmans sång n:o 21 - Måltidssång',
    indexes: [[10, 0]],
    settings: [{
      text: 'Antal verser',
      type: 'number',
      value: 8,
      min: 1,
      max: 8,
      placeholder: 'Antal'
    }]
  }, {
    title: 'Fredmans epistel n:o 48',
    indexes: [[10, 2]],
    settings: [{
      text: 'Antal verser',
      type: 'number',
      value: 7,
      min: 1,
      max: 7,
      placeholder: 'Antal'
    }]
  }, {
    title: 'Molltoner från Norrland',
    indexes: [[10, 3]],
    settings: [{
      text: 'Antal verser',
      type: 'number',
      value: 6,
      min: 1,
      max: 6,
      placeholder: 'Antal'
    }]
  }, {
    title: 'O gamla klang och jubeltid',
    indexes: [[13, 6]],
    settings: [{
      text: 'Fetstilt "KÄRNAN"',
      type: 'bool',
      value: true
    }, {
      text: 'Inkludera info om bordsdunkande',
      type: 'bool',
      value: false
    }]
  }, {
    title: 'Vodka, vodka',
    indexes: [[3, 33]],
    settings: [{
      text: 'Inkludera varianter på första versen',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'Sista punschvisan',
    indexes: [[5, 14]],
    settings: [{
      text: 'Inkludera info om andra versen',
      type: 'bool',
      value: false
    }]
  }, {
    title: 'Jag var full en gång',
    indexes: [[7, 1]],
    settings: [{
      text: 'Inkludera info om andra versen',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'Dom som är nyktra',
    indexes: [[7, 5]],
    settings: [{
      text: 'Inkludera vers att sjunga i dur',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'Konglig Fysiks Paradhymn',
    indexes: [[13, 0]],
    settings: [{
      text: 'Inkludera rad om att fysiker står',
      type: 'bool',
      value: false
    }]
  }, {
    title: 'Hyllningsvisa',
    indexes: [[11, 4]],
    settings: [{
      text: 'Inkludera rader om mössan',
      type: 'bool',
      value: true
    }]
  }, {
    title: 'ODE till en husvagn',
    indexes: [[8, 7]],
    settings: [{
      text: 'Femte stycket som formler',
      type: 'bool',
      value: false
    }]
  }]
