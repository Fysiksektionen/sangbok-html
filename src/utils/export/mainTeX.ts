import { escapeCommands } from './escapes'
import { GeneralSettings } from './generalSettings'

/**
 * Generates the main LaTeX file, given a set of GeneralSettings.
 * @param gs General settings.
 * @returns A LaTeX string.
 */
export default function getMainTeX(gs: GeneralSettings): string {
  const out: string[] = []
  out.push(
    '\\documentclass[a4paper, titlepage, twoside]{blad}\n',
    `\\title{${escapeCommands(gs.title.value)}}`,
    `${gs.showLogo.value ? '' : '\\author{}\n%'}\\author{\\includesvg[width=.8\\textwidth]{logga}}`,
    '%\\author{\\includegraphics[width=.8\\textwidth]{logga}} % Om du använder något annat än en svg-fil.',
    `${gs.showDate.value ? '%' : ''}\\date{}\t%Ta bort kommentaren om du inte vill ha med datum.`,
    `${gs.showAuthor.value ? '%' : ''}\\renewcommand{\\auth}[1]{}\t%Ta bort kommentaren om du inte vill ha med upphovspersons-angivelse.`,
    `${gs.showMelody.value ? '%' : ''}\\renewcommand{\\melody}[1]{}\t%Ta bort kommentaren om du inte vill ha med melodier.`,
    `${gs.showIndices.value ? '%' : ''}\\renewcommand{\\songindex}[1]{}\t%Ta bort kommentaren om du inte vill ha med index.`,
    `${gs.showPageNumbers.value ? '%' : ''}\\fancyfoot{}\\setlength{\\textheight}{.95\\paperheight} \t%Ta bort kommentaren om du inte vill ha med sidnummer.`,
    '\n\n\\begin{document}\n\\maketitle\n\\input{content.tex}\n\\end{document}'
  )
  return out.join('\n')
}
