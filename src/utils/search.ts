import Fuse from 'fuse.js'
import { songs, SongHit } from './lyrics'

const options = {
  includeScore: true,
  isCaseSensitive: false,
  shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 3,
  // location: 0,
  threshold: 0.2, // 0 makes the algorithm super picky, 1 matches almost anything. 0.2 seems fairly ok.
  // distance: 100,
  // useExtendedSearch: false,
  ignoreLocation: true,
  // ignoreFieldNorm: false,
  keys: [
    {
      name: 'title',
      weight: 10
    },
    {
      name: 'author',
      weight: 1
    },
    {
      name: 'melody',
      weight: 1
    },
    {
      name: 'text',
      weight: 1
    },
    {
      name: 'index',
      weight: 1
    }
  ]
}

const fuse = new Fuse(songs, options)

export function search(s: string): Fuse.FuseResult<SongHit>[] {
  return fuse.search(s)
}

/*
function rate(keyword: RegExp, song: Song): number {
  return (+(song.title.search(keyword) > -1) * 10 +
    +(song.text !== undefined && song.text.search(keyword) > -1) * 5 +
    +((song.melody || '').search(keyword) > -1) * 3 +
    +((song.author || '').search(keyword) > -1) * 2)
}

export function search (s: string, chapters: Chapter[]): Hit[] | null {
  if (s.trim().length === 0) { return null }

  // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
  const regexEscape = (s: string): string => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

  const text = s.trim()
  const keywords: RegExp[] = text.split(' ').filter(a => a.length)
    .map(regexEscape)
    .map(function (a) {
      return new RegExp(a
        .replace(/\bporth?/g, 'porth?') // Låt Porthos visa hittas av portos
        .replace(/stem/g, 'st[eè]m'), // Låt Système International hittas av systeme
      'igm')
    })
  const regexedText = new RegExp(regexEscape(text), 'igm')

  const hits = []

  for (const i in chapters) {
    for (const j in chapters[i].songs) {
      const song: Song = chapters[i].songs[j]
      const indexes = { chapterindex: i, songindex: j }

      // Träff i olika egenskaper ger olika mycket poäng
      let rating: number = 10 * rate(regexedText, song)

      let missing = 0
      // Träff på någon av orden ger mindre poäng
      for (const keyword of keywords) {
        const subrating: number = rate(keyword, song)
        rating += subrating
        if (subrating === 0) { missing++ }
      }

      if (rating === 0 || missing >= 2) { continue }

      // Lägg till sökträff
      hits.push({ song: indexes, rating: rating })
    }
  }
  hits.sort((a, b) => b.rating - a.rating)
  return hits
}
*/
