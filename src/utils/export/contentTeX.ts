import { Song } from '../../lyrics'
import { getDefaultText, escapeAll } from './escapes'
import { GeneralSettings } from './generalSettings'
import { SpecificDownloadSettings } from './specificSettings'

export default function getContentTeX(songs: Song[], gs: GeneralSettings, ss: SpecificDownloadSettings[]): string {
  const content: string[] = []

  // Main loop
  for (const song of songs) {
    if (!song.text) {
      console.warn(`Song with empty text. Ignoring: ${song.index}`)
      continue
    }

    content.push(
      '\\begin{sang}{',
      escapeAll(song.title),
      '}\n'
    )

    // TODO: Extract to separate function
    if (gs.showMelody.value && song.melody) { // TODO: Include melodies and smn:s even if showMelody is false, but as comments.
      const melodyContent = ((song.melody || '')
        .split('\n').filter(function (line) {
          return (!gs.showSheetMusicNotice.value || line.indexOf('notkapitlet') === -1)
        }).join('\\hfil\\\\*\n\\hfil '))

      if (melodyContent.length !== 0) { // Add melody
        content.push('\\hfil\\textit{',
          escapeAll(melodyContent),
          '}\\hfil\\\\*\n',
          '\\vspace*{0.1cm}\n'
        )
      }
    }

    let sscount = 0
    // Song-specific settings
    for (const setting of ss) {
      if (setting.indexes.indexOf(song.index) > -1) {
        content.push(setting.processor(song.text, setting.settings))
        sscount++
      }
    }

    if (sscount === 0) { // No specific settings were used
      content.push(getDefaultText(song.text))
    } else if (sscount > 1) {
      alert(`Fler än en specialinställning användes för låt (see what I did there xD) ${song.index}. Det är dags att skicka ett surt mail till lämplig projektledare, eller webmaster.`)
    }

    // TODO: Extract into separate function
    if (gs.showAuthor.value && song.author !== undefined) {
      content.push(
        '\\\\* \\vspace*{0.1cm}\n',
        '\\raggedleft\\textit{',
        escapeAll(song.author.replace('\n', '\\\\* ')),
        '}\n'
      )
    }

    content.push('\\end{sang}\n')
  }

  return content.join('')
}
