// TODO: Add documentation
import { Song } from '../../lyrics'
import { getDefaultText, escapeAll } from './escapes'
import { GeneralSettings } from './generalSettings'
import { SpecificDownloadSettings, specificSettings } from './specificSettings'

function getMelodyContent(gs: GeneralSettings, song: Song): string[] {
  const melodyContent = ((song.melody || '')
    .split('\n').filter(function (line) {
      return (!gs.showSheetMusicNotice.value || line.indexOf('notkapitlet') === -1)
    }).join('\\*\n'))
  if (melodyContent.length !== 0) {
    return [`\\melody{${escapeAll(melodyContent)}}\n`]
  }
  return []
}

/**
 * Function that generates the content of a "sångblad" as LaTeX.
 * @param songs A list of songs to include.
 * @param gs General settings
 * @param ss Song-specific settings
 * @returns A LaTeX string.
 */
export default function getContentTeX(songs: Song[], gs: GeneralSettings, ss: SpecificDownloadSettings[]): string {
  const content: string[] = []

  // Main loop
  for (const song of songs) {
    if (!song.text) {
      console.warn(`Song with empty lyrics. Ignoring: ${song.index}`)
      continue
    }

    content.push(
      '\\pagebreak[3]\n',
      '\\begin{samepage}\n',
      `\\songtitle{${escapeAll(song.title)}}\n`,
      ...getMelodyContent(gs, song),
      '\\begin{lyrics}\n'
    )

    //
    // Add songs
    //
    let sscount = 0
    // With song-specific settings
    for (const i in ss) {
      const setting = ss[i]
      if (setting.indexes.indexOf(song.index) > -1) {
        if (setting.processor !== undefined) {
          content.push(setting.processor(song.text, setting.settings))
        } else {
          console.warn('Using specificSettings preprocessor fallback. This may cause preprocessor bugs when migrating between specificSettings versions.')
          content.push(specificSettings[i].processor(song.text, setting.settings))
        }
        sscount++
      }
    }

    if (sscount === 0) { // No specific settings were used. Use default processor.
      content.push(getDefaultText(song.text))
    } else if (sscount > 1) {
      alert(`Fler än en specialinställning användes för låt ${song.index}. Det är dags att skicka ett surt mail till lämplig projektledare, eller webmaster.`)
    }
    content.push('\\end{lyrics}\n')

    // Add author
    const escapedAuthor = song.author ? escapeAll(song.author.replace('\n', '\\\\* ')) : '';
    if (escapedAuthor) { content.push(`\\auth{${escapedAuthor}}`) }
    content.push('\\end{samepage}\n\n\n')
  }

  return content.join('')
}
