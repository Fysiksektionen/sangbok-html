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
    Οο: 'Omikron',
    Σσ: 'Sigma'
    // Lℓ: 'Leo'
  }
  return dict[greek]
}

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
    ο: 'omikron',
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
