/*
 * Specific download settings, aka. song-specific settings.
 */

import { escapeAll, getDefaultText } from './escapes'
import { DownloadSetting, NumberSetting } from './settings'

export type SpecificDownloadSettings = {
  title: string,
  indexes: string[], // TODO: using string indices is very encoding-sensitive. There should be a better way.
  // TODO: Also, title could be fetched directly from the indexes
  settings: DownloadSetting[],
  processor: (lyrics: string, settings: DownloadSetting[]) => string
}

function stripLastVerse(lyrics: string): string {
  const l = lyrics.split(/\n\n/g)
  l.pop()
  return l.join('\n\n')
}

/*
 * Generic preprocessors
 */

/**
 * Assuming that each paragraph is split by '\n\n', and that each verse is paragraphsPerVerse paragraphs long,
 * truncates the last settings[0].value verses from the passed lyrics.
 * @param lyrics A lyrics string.
 * @param settings List of settings, containing only one element.
 * @param paragraphsPerVerse The number of paragraphs per verse. Defaults to 1.
 * @returns The lyrics, with the last verses removed, until the number of verses matches the set value.
 */
function truncateVerses(lyrics: string, settings: DownloadSetting[], paragraphsPerVerse?: number): string {
  const setting = settings[0] as NumberSetting
  if (setting.max !== undefined) {
    return getDefaultText(
      lyrics.split('\n\n')
        .slice(0, (setting.value || setting.max) * (paragraphsPerVerse || 1))
        .join('\n\n')
    )
  } else {
    throw TypeError('A non-numeric setting was passed to truncateVerses().')
  }
}

/**
 * Truncates anything past '\n\n\n' in the provided lyrics if settings[0].value === false.
 * @param lyrics Lyrics string
 * @param settings List of settings, containing only one element.
 * @returns The lyrics string, with the trailing info removed (or not).
 */
function trailingInfo(lyrics: string, settings: DownloadSetting[]): string {
  return (settings[0].value) ? getDefaultText(lyrics) : getDefaultText(stripLastVerse(lyrics))
}

/*
 * Specific preprocessors
 */
/** LaTeX pre-processor for Årskursernas hederssång */
function arskursernas(lyrics: string, settings: DownloadSetting[]): string { // TODO: Cleanup
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

/** LaTeX pre-processor for O gamla klang och jubeltid */
function ogamlaklang(lyrics: string, settings: DownloadSetting[]): string {
  if (settings[0].value) {
    lyrics = lyrics.replace(/KÄRNAN/i, '\\textbf{KÄRNAN}')
  }
  if (settings[1].value === false) {
    lyrics = stripLastVerse(lyrics)
  }
  return getDefaultText(lyrics)
}

/** A list of song-specific settings and their respective pre-processors. */
export const specificSettings: SpecificDownloadSettings[] = [{
  title: 'Årskursernas hederssång',
  indexes: ['o2'],
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
  indexes: ['ι1', 'ι16', 'ι17'],
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
}, {
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
  processor: (lyrics: string, settings: DownloadSetting[]) => truncateVerses(lyrics, settings, 2)
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
  processor: truncateVerses
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
  processor: truncateVerses
}, {
  title: 'O gamla klang och jubeltid',
  indexes: ['o∞'],
  settings: [{
    text: 'Fetstilt "KÄRNAN"',
    type: 'bool',
    value: true
  }, {
    text: 'Inkludera info om bordsdunkande',
    type: 'bool',
    value: false
  }],
  processor: ogamlaklang
}, {
  title: 'Vodka, vodka',
  indexes: ['δ8b'],
  settings: [{
    text: 'Inkludera varianter på första versen',
    type: 'bool',
    value: true
  }],
  processor: trailingInfo
}, {
  title: 'Sista punschvisan',
  indexes: ['ζ∞'],
  settings: [{
    text: 'Inkludera info om andra versen',
    type: 'bool',
    value: false
  }],
  processor: trailingInfo
}, {
  title: 'Jag var full en gång',
  indexes: ['θ2'],
  settings: [{
    text: 'Inkludera info om andra versen',
    type: 'bool',
    value: true
  }],
  processor: trailingInfo
}, {
  title: 'Dom som är nyktra',
  indexes: ['θ6'],
  settings: [{
    text: 'Inkludera vers att sjunga i dur',
    type: 'bool',
    value: true
  }],
  processor: trailingInfo
}, {
  title: 'Konglig Fysiks Paradhymn',
  indexes: ['o1'],
  settings: [{
    text: 'Inkludera rad om att fysiker står',
    type: 'bool',
    value: false
  }],
  processor: trailingInfo
}, {
  title: 'Hyllningsvisa',
  indexes: ['μ5'],
  settings: [{
    text: 'Inkludera rader om mössan',
    type: 'bool',
    value: true
  }],
  processor: (lyrics: string, settings: DownloadSetting[]) => (settings[0].value) ? getDefaultText(lyrics.replace(/</g, '\\textit{').replace(/>/g, '}')) : getDefaultText(lyrics.split(/\n\n\n/g)[0]) + getDefaultText('\n\nDessa tekniska lik!!! Barampam!')
}, {
  title: 'ODE till en husvagn',
  indexes: ['ι8'],
  settings: [{
    text: 'Femte stycket som formler',
    type: 'bool',
    value: false
  }],
  processor: (lyrics: string, settings: DownloadSetting[]): string => {
    if (settings[0].value) {
      const verses = lyrics.split(/\n\n/g)
      verses[4] = '\\begin{flalign*}m\\ddot{x}+c\\dot{x}+kx&=mg\n\\dot{x}&=A\\omega_n\\cos{\\omega_n t}\n\\tau&=\\frac{2\\pi}{\\omega_n}\n\\omega_n&=\\sqrt{\\frac{k}{m}}\\end{flalign*}'
      return getDefaultText(verses.join('\n\n'))
    } else { return getDefaultText(lyrics) }
  }
},
// Songs with no settings, but special processing
{
  title: 'Aris summavisa',
  indexes: ['ι13'],
  settings: [],
  processor: (lyrics: string) => getDefaultText(lyrics.replace('trollat bort n', 'trollat bort \\(n\\)').replace('Maclaurin av ln', 'Maclaurin av \\(\\ln\\)'))
}, {
  title: 'Liten visa om Gram-Schmidts metod',
  indexes: ['ι15'],
  settings: [],
  processor: (lyrics: string) => getDefaultText(lyrics.replace(/M/g, '\\(M\\)').replace('vektor a', 'vektor \\(\\boldsymbol{a}\\)'))
}, {
  title: 'Stad i ljus',
  indexes: ['κ15'],
  settings: [],
  processor: (lyrics: string) => getDefaultText(lyrics.split(/\n\n\n/g)[0])
}]
