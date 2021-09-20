import { escapeAll, getDefaultText } from './escapes'
import { DownloadSetting } from './settings'

export type SpecificDownloadSettings = {
  title: string,
  indexes: string[], // TODO: using string indices is very encoding-sensitive. There should be a better way.
  settings: DownloadSetting[],
  processor: (lyrics: string, settings: DownloadSetting[]) => string
}

function arskursernas(lyrics: string, settings: DownloadSetting[]): string { // TODO: Cleanup
  console.log(settings)
  const content = [] as string[]
  const description = lyrics.split('\n').filter(line => /^(?!\d\d)/.test(line))
  const years = lyrics.split('\n').filter(line => /^\d\d/.test(line))

  content.push(getDefaultText(description.join('\n') + '\n'))
  let yearsContent = [] as string[]

  let year = 1900
  let yearIndex = 0
  while (year < settings[0].value && ++yearIndex < years.length) {
    const digits = parseInt(years[yearIndex].slice(0, 2))
    if (digits === 0) { year = Math.ceil(year / 100) * 100 } else { year = Math.floor(year / 100) * 100 + digits }
  }
  for (let j = yearIndex; j < years.length; j++) { yearsContent.unshift(years[j] + '\\\\\n') }

  if (settings[3].value) { yearsContent = yearsContent.reverse() }
  if (settings[1].value) { yearsContent.push('Gästerna\\\\\n') }
  if (settings[2].value) { yearsContent.push('Köket\\\\\n') }

  return content.concat(yearsContent).join('')
}

export const specificSettings: SpecificDownloadSettings[] = [{
  title: 'Årskursernas hederssång',
  indexes: ['ο2'],
  settings: [{
    text: 'Inkludera t.o.m.',
    type: 'number',
    value: new Date().getFullYear() - 5,
    min: 1935,
    max: new Date().getFullYear(),
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
  }],
  processor: arskursernas
}, {
  title: 'Système International och liknande',
  indexes: ['ι1', 'ι16', 'ι18'],
  settings: [{
    text: 'Ordna texten regelbundet',
    type: 'bool',
    value: true
  }],
  processor: (lyrics: string, settings: DownloadSetting[]): string => {
    if (settings[0].value) {
      let out = '\\begin{tabular}{llllll}\n'
      out += escapeAll(lyrics
        .split(/\n/g)
        .map(s => s.trim().replace(/\s+/g, ' & '))
        .join('\\\\*\n')
      )
      out += '\n\\end{tabular}'
      return out
    } else {
      return getDefaultText(lyrics
        .replace(/\n/g, '\\\\')
        .replace(/\s+/g, ' ')
        .replace(/\\\\/g, '\n')
      )
    }
  }
}, {
  title: 'The BASIC song',
  indexes: ['ι5'],
  settings: [{
    text: 'Monospace-typsnitt',
    type: 'bool',
    value: true
  }],
  processor: (lyrics: string, settings: DownloadSetting[]) => ((settings[0].value) ? '\\texttt{' + getDefaultText(lyrics) + '}' : getDefaultText(lyrics))
}/*, {
  title: 'Fredmans sång n:o 21 - Måltidssång',
  indexes: ['λ1'],
  settings: [{
    text: 'Antal verser',
    type: 'number',
    value: 8,
    min: 1,
    max: 8,
    placeholder: 'Antal'
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Fredmans epistel n:o 48',
  indexes: ['λ3'],
  settings: [{
    text: 'Antal verser',
    type: 'number',
    value: 7,
    min: 1,
    max: 7,
    placeholder: 'Antal'
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Molltoner från Norrland',
  indexes: ['λ4'],
  settings: [{
    text: 'Antal verser',
    type: 'number',
    value: 6,
    min: 1,
    max: 6,
    placeholder: 'Antal'
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'O gamla klang och jubeltid',
  indexes: ['ο∞'],
  settings: [{
    text: 'Fetstilt "KÄRNAN"',
    type: 'bool',
    value: true
  }, {
    text: 'Inkludera info om bordsdunkande',
    type: 'bool',
    value: false
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Vodka, vodka',
  indexes: ['δ8b'],
  settings: [{
    text: 'Inkludera varianter på första versen',
    type: 'bool',
    value: true
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Sista punschvisan',
  indexes: ['ζ∞'],
  settings: [{
    text: 'Inkludera info om andra versen',
    type: 'bool',
    value: false
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Jag var full en gång',
  indexes: ['θ2'],
  settings: [{
    text: 'Inkludera info om andra versen',
    type: 'bool',
    value: true
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Dom som är nyktra',
  indexes: ['θ6'],
  settings: [{
    text: 'Inkludera vers att sjunga i dur',
    type: 'bool',
    value: true
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Konglig Fysiks Paradhymn',
  indexes: ['ο1'],
  settings: [{
    text: 'Inkludera rad om att fysiker står',
    type: 'bool',
    value: false
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'Hyllningsvisa',
  indexes: ['μ5'],
  settings: [{
    text: 'Inkludera rader om mössan',
    type: 'bool',
    value: true
  }],
  processor: (lyrics) => lyrics
}, {
  title: 'ODE till en husvagn',
  indexes: ['ι8'],
  settings: [{
    text: 'Femte stycket som formler',
    type: 'bool',
    value: false
  }],
  processor: (lyrics) => lyrics
} */]
