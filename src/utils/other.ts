/** List of allowed tags. Used by toHTML. */
const ALLOWED_TAGS = ['li', 'ol', 'ul', 'b', 'p', 'i', 's', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

/**
 * Converts text to safe html. Only tags in ALLOWED_TAGS with no attributes are kept as html.
 * All other html tags are escaped.
 * @param text HTML-like text, to be cleaned up.
 * @returns Safe html.
 */
export function toHTML(text: string): string {
  let out = text.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/igm, '<br />')
  for (const tag of ALLOWED_TAGS) {
    out = out.replace(new RegExp(`&lt;(/)?${tag}&gt;`, 'mig'), `<$1${tag}>`)
  }
  return out
}

/**
 * Converts greek prefix to latin prefix.
 * @param greek Greek prefix. Should be of length 2.
 * @returns Latin prefix
 */
export function greekPrefix2latin (greek: string): string {
  const dict: { [key: string]: string } = {
    Αα: 'Alfa',
    Ββ: 'Beta',
    Γγ: 'Gamma',
    Δδ: 'Delta',
    Εε: 'Epsilon',
    Ζζ: 'Zeta',
    Ηη: 'Eta',
    Θθ: 'Theta',
    Ιι: 'Iota',
    Κκ: 'Kappa',
    Λλ: 'Lambda',
    Μμ: 'My',
    Νν: 'Ny',
    Οο: 'Omikron', // One uses greek omicron
    Oo: 'Omikron', // The other, a regular o.
    Σσ: 'Sigma'
  }
  return dict[greek]
}

/**
 * Converts greek unicode characters to their corresponding latin name.
 * If the greek character is uppercase, the first letter of the latin name will also be uppercase.
 * Eg. 'α' -> 'alfa', 'Δ' -> 'Delta'
 * @param greek String containing greek letters. Usually has a length of 1.
 * @returns A string.
 */
export function greek2latin (greek: string): string {
  const dict: { [key: string]: string } = {
    α: 'alfa',
    β: 'beta',
    γ: 'gamma',
    δ: 'delta',
    ε: 'epsilon',
    ζ: 'zeta',
    η: 'eta',
    θ: 'theta',
    ι: 'iota',
    κ: 'kappa',
    λ: 'lambda',
    μ: 'my',
    ν: 'ny',
    ο: 'omikron', // Greek ο
    o: 'omikron', // Latin o
    σ: 'sigma',
    Α: 'Alfa',
    Β: 'Beta',
    Γ: 'Gamma',
    Δ: 'Delta',
    Ε: 'Epsilon',
    Ζ: 'Zeta',
    Η: 'Eta',
    Θ: 'Theta',
    Ι: 'Iota',
    Κ: 'Kappa',
    Λ: 'Lambda',
    Μ: 'My',
    Ν: 'Ny',
    Ο: 'Omikron',
    Σ: 'Sigma'
  }
  let out = greek
  Object.keys(dict).forEach((key) => {
    out = out.replace(key, dict[key])
  })
  return out
}

/**
 * Converts greek characters in the given string to their corresponding latin character.
 * Currently only works with lowercase characters. Eg. 'β' -> 'b'
 * @param greek String containing greek characters
 * @returns A string without greek characters
 */
export function greek2latin2 (greek: string): string {
  const dict: { [key: string]: string } = {
    α: 'a',
    β: 'b',
    γ: 'g',
    δ: 'd',
    ε: 'e',
    ζ: 'z',
    η: 'h',
    θ: 't',
    ι: 'i',
    κ: 'k',
    λ: 'l',
    μ: 'm',
    ν: 'n',
    ο: 'o',
    σ: 's'
  }
  let out = greek
  Object.keys(dict).forEach((key) => {
    out = out.replace(key, dict[key])
  })
  return out
}
