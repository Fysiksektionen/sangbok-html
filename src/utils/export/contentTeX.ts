import { Song } from '../lyrics'
import { getDefaultText, escapeAll } from './escapes'
import { GeneralSettings } from './generalSettings'

export function getContentTeX(songs: Song[], gs: GeneralSettings): string {
  const content: string[] = []

  const addDefaultText = function (text: string) { content.push(getDefaultText(text)) }

  // Main loop
  for (const song of songs) {
    if (song.text === '') {
      console.log(`Song with empty text. Ignoring: ${song.index}`)
      continue
    }

    content.push(
      '\\begin{sang}{',
      escapeAll(song.title),
      '}\n'
    )

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

    // TODO: Add song-specific settings
    addDefaultText(song.text || '')

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
