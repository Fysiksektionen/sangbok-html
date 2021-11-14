import { Song } from '../../lyrics'
import { getDefaultText, escapeAll } from './escapes'
import { GeneralSettings } from './generalSettings'
import { SpecificDownloadSettings, specificSettings } from './specificSettings'

/**
 * Returns list containing at most one element, the melody of the song. If the song has no melody (or subtitle, etc.) specified, we return an empty list.
 * @param gs General settings
 * @param song A Song
 * @returns A list with at most one element.
 */
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

  // Main song-adder loop
  for (const song of songs) {
    if (!song.text) { // TODO: This was used when we had sheet-music-only songs, which we don't anymore. We could remove this.
      console.warn(`Attempted to add a with empty lyrics. Ignoring: ${song.index}`)
      continue
    }

    // Append header.
    content.push(
      // Prefer page-breaks right before new songs
      '\\pagebreak[3]\n',
      // Try to get everything else on the same page
      '\\begin{samepage}\n',
      `\\songtitle{${escapeAll(song.title)}}\n`,
      ...getMelodyContent(gs, song),
      '\\begin{lyrics}\n'
    )

    ///
    ///  Add songs.
    ///
    // There are two ways of doing this. Songs with a specific settings will use a custom preprocessor, defined in specificSettings.ts
    // The rest use the default processor. The person writing the original code allowed more than one specificSetting per song, but we currently don't.
    // If a song has several specificSettings, we alert the user that this behavior is unintended.

    // The amount of song-specific settings found. Should only ever be 0 or 1.
    let sscount = 0

    for (const i in ss) { // Try to find a song-specific setting for the song
      const setting = ss[i]
      if (setting.indexes.indexOf(song.index) > -1) { // The setting can be applied to the current song.
        if (setting.processor !== undefined) {
          content.push(setting.processor(song.text, setting.settings))
        } else {
          // TODO: We currently end up here a lot. We should probably fix this before adding any new specific settings. It works for now, though.
          // This bug is caused by the user importing specificSettings from the persisted state, which does not store the preprocessor functions.
          // When this is imported, the storage state is set with specificSettings that don't have the processor function, which causes setting.processor to be undefined.
          console.warn(`Using specificSettings preprocessor fallback for song ${song.index} with setting "${setting.title}". This may cause preprocessor bugs when migrating between specificSettings versions.`)
          content.push(specificSettings[i].processor(song.text, setting.settings))
        }
        sscount++
      }
    }

    if (sscount === 0) { // No specific settings were used. Use default processor.
      content.push(getDefaultText(song.text))
    } else if (sscount > 1) {
      // TODO: This should never happen. Write a test that makes sure it never does, and replace this with console.err.
      alert(`Fler än en specialinställning användes för låt ${song.index}. Det är dags att skicka ett surt mail till lämplig projektledare, eller webmaster.`)
    }
    content.push('\\end{lyrics}\n')

    // Add author. Note that main.tex decides whether the \auth contents are shown or not. The same thing can be said for the \melody contents.
    const escapedAuthor = song.author ? escapeAll(song.author.replace('\n', '\\\\* ')) : ''
    if (escapedAuthor) { content.push(`\\auth{${escapedAuthor}}`) }
    content.push('\\end{samepage}\n\n\n')
  }

  return content.join('')
}
