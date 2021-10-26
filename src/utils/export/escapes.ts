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

export function escapeAll(s: string): string {
  // Iterates over latexEscapes and performs replacements
  for (let i = 0; i < latexEscapes.length; i++) { s = s.replace(latexEscapes[i][0], latexEscapes[i][1]) }
  return s
}

export function getDefaultText(text: string): string {
  return escapeAll(text
    .replace(/\n\n\n/g, '\\\\ \\vspace*{0.5cm}')
    .replace(/\n\n/g, '\\\\ ')
    .replace(/\n/g, '\\\\*\n')
    .replace(/\\\\ /g, '\n\n')
    .replace(/\\vspace\*{0\.5cm}/g, '\\vspace*{0.5cm}\n')
  )
}
