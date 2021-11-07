const LATEX_ESCAPES: [RegExp, string][] = [
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

/**
 * Replaces the special characters in LATEX_ESCAPES and replaces them with their LaTeX equivalent.
 * @param str A string containing special characters.
 * @returns A string with all instances of all LATEX_ESCAPES replaced.
 */
export function escapeAll(str: string): string {
  for (let i = 0; i < LATEX_ESCAPES.length; i++) { str = str.replace(LATEX_ESCAPES[i][0], LATEX_ESCAPES[i][1]) }
  return str
}

/**
 * Generic pre-processor for converting raw lyrics to LaTeX.
 * @param text A raw text string.
 * @returns A string that is more LaTeX-compatible.
 */
export function getDefaultText(text: string): string {
  return escapeAll(text
    .replace(/\n\n\n/g, '\\\\ \\vspace*{0.5cm}')
    .replace(/\n\n/g, '\\\\ ')
    .replace(/\n/g, '\\\\*\n')
    .replace(/\\\\ /g, '\n\n')
    .replace(/\\vspace\*{0\.5cm}/g, '\\vspace*{0.5cm}\n')
  )
}
