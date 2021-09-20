import { GeneralSettings } from './generalSettings'

export default function getMainTeX(gs: GeneralSettings): string {
  const out: string[] = []
  out.push(
    '\\documentclass[a4paper, titlepage]{blad}\n',
    `\\title{${gs.title.value}}`,
    `${gs.showLogo.value ? '' : '\\author{}\n%'}\\author{\\includesvg[width=.8\\textwidth]{logga}}`,
    '%\\author{\\includegraphics[width=.8\\textwidth]{logga}} % Om du använder något annat än en svg-fil.',
    `${gs.showDate.value ? '%' : ''}\\date{}\t%Ta bort kommentaren om du inte vill ha med datum.`,
    '\n\n\\begin{document}\n\\maketitle\n\\input{content.tex}\n\\end{document}'
  )
  return out.join('\n')
}
