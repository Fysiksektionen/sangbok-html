// This file is currently unused.
/* eslint-disable no-case-declarations */
import { DownloadSettings } from '@/store/downloadSettings'
import { Song } from './lyrics'

const latexEscapes: [RegExp, string][] = [
  [/"/g, "''"],
  [/Ω/g, '\\(\\Omega\\)'],
  [/ω/g, '\\(\\omega\\)'],
  [/τ/g, '\\(\\tau\\)'],
  [/π/g, '\\(\\pi\\)'],
  [/ζ/g, '\\(\\zeta\\)'],
  [/σ/g, '\\(\\sigma\\)'],
  [/δ/g, '\\(\\delta\\)'],
  [/ε/g, '\\(\\letepsilon\\)'],
  [/β/g, '\\(\\beta\\)'],
  [/β/g, '\\(\\beta\\)'],
  [/ϱ/g, '\\(\\rho\\)'],
  [/°/g, '\\(^\\circ\\)'],
  [/²/g, '\\(^2\\)'],
  [/³/g, '\\(^3\\)'],
  [/₂/g, '\\(_2\\)']
]

function escapeAll(s: string): string {
  for (let i = 0; i < latexEscapes.length; i++) { s = s.replace(latexEscapes[i][0], latexEscapes[i][1]) }
  return s
}

function getDefaultText(text: string): string {
  return escapeAll(text
    .replace(/\n\n\n/g, '\\\\ \\vspace*{0.5cm}')
    .replace(/\n\n/g, '\\\\ ')
    .replace(/\n/g, '\\\\*\n')
    .replace(/\\\\ /g, '\n\n')
    .replace(/\\vspace\*{0\.5cm}/g, '\\vspace*{0.5cm}\n')
  )
}

export function getContentTeX(songs: Song[], d: DownloadSettings[]): string {
  // eslint-disable-next-line prefer-const
  let content: string[] = []

  // TODO: Move commented below to a getMainTeX function.
  // content.push('\\documentclass[a4paper, twoside, titlepage]{blad}\n\\usepackage{amsmath,amsfonts,amssymb,graphicx}\n%amsmath används ganska ofta graphicx är till för att använda grafik\n\n\\usepackage{verbatim}\n\\usepackage[T1]{fontenc}\n%\\usepackage{moreverb}\n%\\usepackage{xspace}\n%\\usepackage{float}\n\n%\\setlength{\\parindent}{0pt}     % tar bort indrag från stycken. Avslaget\n%\\setlength{\\parskip}{3pt}       % Ändra så att stycken skiljs av\n                                 % blankrader. Avslaget\n%\\addtolength{\\topmargin}{-0.8cm} %Minskar marginalerna litegrann\n%\\addtolength{\\textheight}{0.8cm}\n\n% Titel, författare etc.\n\\title{')
  // content.push(d[0].settings[0].value)
  // content.push('}\n')

  // if (d[0].settings[1].value) { content.push('\\author{\\includegraphics[width=.8\\textwidth]{logga}}\n') }

  // if (d[0].settings[2].value) { content.push('%') }
  // content.push('\\date{}                          %Ta bort kommentaren om du inte vill ha med datum.\n\n\\begin{document}\n')

  // content.push('\\pagenumbering{arabic}\n\\maketitle\n')

  const addDefaultText = function (text: string) { content.push(getDefaultText(text)) }

  // Main loop
  for (let i = 0; i < songs.length; i++) {
    content.push('\\begin{sang}{')
    content.push(escapeAll(songs[i].title))
    content.push('}\n')

    if (d[0].settings[3].value && songs[i].melody) {
      const melodyContent = (songs[i].melody
        .split('\n').filter(function (line) {
          return !d[1].settings[0].value || line.indexOf('notkapitlet') === -1
        }).join('\\hfil\\\\*\n\\hfil '))

      if (melodyContent.length !== 0) { // Add melody
        content.push('\\hfil\\textit{')
        content.push(escapeAll(melodyContent))
        content.push('}\\hfil\\\\*\n')
        content.push('\\vspace*{0.1cm}\n')
      }
    }

    // const item = songs[i]

    // let settingsIndex = 0
    switch (Math.random() // Dummy
    // d.findIndex((entry: DownloadSettings, currentIndex: number) => {
    //   return currentIndex >= 2 && entry.indexes && entry.indexes.some(function (index) {
    //     return index[0] === item[1] && index[1] === item[2]
    //   })
    // })
    ) {
    /*
    case 2: // Årskursernas
      const description = songs[i].text.split('\n').filter(function (line) {
        return /^(?!\d\d)/.test(line)
      })
      const years = songs[i].text.split('\n').filter(function (line) {
        return /^\d\d/.test(line)
      })

      addDefaultText(description.join('\n') + '\n')
      let yearsContent = []

      let year = 1900
      let yearIndex = 0
      while (year < d[2].settings[0].value && ++yearIndex < years.length) {
        const digits = years[yearIndex].slice(0, 2) * 1
        if (digits === 0) { year = Math.ceil(year / 100) * 100 } else { year = Math.floor(year / 100) * 100 + digits }
      }
      for (let j = yearIndex; j < years.length; j++) { yearsContent.unshift(years[j] + '\\\\\n') }

      if (d[2].settings[3].value) { yearsContent = yearsContent.reverse() }

      if (d[2].settings[1].value) { yearsContent.push('Gästerna\\\\\n') }
      if (d[2].settings[2].value) { yearsContent.push('Köket\\\\\n') }

      content = content.concat(yearsContent)

      break

    case 3: // Regelbunden text
      if (d[3].settings[0].value) {
        content.push('\\begin{tabular}{llllll}\n')
        content.push(escapeAll(songs[i].text
          .split(/\n/g)
          .map(function (s) { return s.trim().replace(/\s+/g, ' & ') })
          .join('\\\\*\n')
        ))
        content.push('\n\\end{tabular}')
      } else {
        addDefaultText(songs[i].text
          .replace(/\n/g, '\\\\')
          .replace(/\s+/g, ' ')
          .replace(/\\\\/g, '\n')
        )
      }
      break

    case 4: // Monospace
      if (d[4].settings[0].value) { content.push('\\texttt{') }

      addDefaultText(songs[i].text)

      if (d[4].settings[0].value) { content.push('}') }
      break

    // Trunkeras
    // TODO: Gör snyggare, dvs. utan fallthrough.
    // eslint-disable-next-line no-fallthrough
    case 5:
      if (settingsIndex === 0) { settingsIndex = 5 }
    // eslint-disable-next-line no-fallthrough
    case 6:
      if (settingsIndex === 0) { settingsIndex = 6 }
    // eslint-disable-next-line no-fallthrough
    case 7:
      if (settingsIndex === 0) { settingsIndex = 7 }

      addDefaultText(songs[i].text
        .split('\n\n')
        .slice(0, (d[settingsIndex].settings[0].value || d[settingsIndex].settings[0].max) * (settingsIndex == 5 ? 2 : 1))
        .join('\n\n')
      )
      settingsIndex = 0
      break

    case 8: // Gamla klang
      if (d[8].settings[0].value) {
        if (d[8].settings[1].value) { addDefaultText(songs[i].text.replace(/KÄRNAN/g, '\\textbf{KÄRNAN}')) } else {
          addDefaultText(songs[i].text
            .replace(/KÄRNAN/g, '\\textbf{KÄRNAN}')
            .split(/\n\n\n/g)[0]
          )
        }
      } else {
        if (d[8].settings[1].value) { addDefaultText(songs[i].text) } else { addDefaultText(songs[i].text.split(/\n\n\n/g)[0]) }
      }
      break

      // Med info i slutet
    case 9:
      if (settingsIndex === 0) { settingsIndex = 9 }

    // eslint-disable-next-line no-fallthrough
    case 10:
      if (settingsIndex === 0) { settingsIndex = 10 }

    // eslint-disable-next-line no-fallthrough
    case 11:
      if (settingsIndex === 0) { settingsIndex = 11 }

    // eslint-disable-next-line no-fallthrough
    case 12:
      if (settingsIndex === 0) { settingsIndex = 12 }

    // eslint-disable-next-line no-fallthrough
    case 13:
      if (settingsIndex === 0) { settingsIndex = 13 }

      if (!d[settingsIndex].settings[0].value) { addDefaultText(songs[i].text.split(/\n\n\n/g)[0]) } else { addDefaultText(songs[i].text) }
      settingsIndex = 0
      break

    case 14: // Hyllningsvisa
      if (!d[14].settings[0].value) {
        addDefaultText(songs[i].text.split(/\n\n\n/g)[0])
        addDefaultText('\n\nDessa tekniska lik!!! Barampam!')
      } else { addDefaultText(songs[i].text.replace(/</g, '\\textit{').replace(/>/g, '}')) }
      break

    case 15: // ODE till en husvagn
      if (d[15].settings[0].value) {
        const verses = songs[i].text.split(/\n\n/g)
        verses[4] = '\\begin{flalign*}m\\ddot{x}+c\\dot{x}+kx&=mg\n\\dot{x}&=A\\omega_n\\cos{\\omega_n t}\n\\tau&=\\frac{2\\pi}{\\omega_n}\n\\omega_n&=\\sqrt{\\frac{k}{m}}\\end{flalign*}'
        addDefaultText(verses.join('\n\n'))
      } else { addDefaultText(songs[i].text) }
      break
*/
    default:
      /* if (item[1] == 8 && item[2] == 14) // Aris summavisa
      {
        addDefaultText(songs[i].text
          .replace('trollat bort n', 'trollat bort \\(n\\)')
          .replace('Maclaurin av ln', 'Maclaurin av \\(\\ln\\)')
        )
      } else if (item[1] == 8 && item[2] == 16) // Liten visa om Gram-Schmidts metod
      {
        addDefaultText(songs[i].text
          .replace(/M/g, '\\(M\\)')
          .replace('vektor a', 'vektor \\(\\boldsymbol{a}\\)')
        )
      } else if (item[1] == 9 && item[2] == 15) // Stad i ljus
      { addDefaultText(songs[i].text.split(/\n\n\n/g)[0]) } else { */
      addDefaultText(songs[i].text)
      // }
      break
    }

    content.push('\n')

    // if (d[0].settings[4].value && songs[i].author !== null && songs[i].author.length !== 0) {
    //   content.push('\\\\* \\vspace*{0.1cm}\n')
    //   content.push('\\raggedleft\\textit{')
    //   content.push(escapeAll(songs[i].author.replace('\n', '\\\\* ')))
    //   content.push('}\n')
    // }

    content.push('\\end{sang}\n')
  }

  return content.join('')
}
