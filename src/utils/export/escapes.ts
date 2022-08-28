// This list used to be longer, but special char handling has been moved to blad.cls
const LATEX_ESCAPES: [RegExp, string][] = [
  [/"/g, "''"],
  [/&/g, '\\&']
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
 * Replaces the characters '{', '}', '\\' with a backslash.
 * @param str A string containing special characters.
 * @returns The escaped string.
 */
export function escapeCommands(str: string): string {
  for (const e of ['\\', '{', '}']) { str = str.replace(e, `\\${e}`) }
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
