import lyrics from '@/assets/lyrics.json'
import leo from '@/assets/addons/leo.json'

export type SongIndex = [number, number]

export type Song = {
  title: string,
  index: string,
  author?: string,
  melody?: string,
  unlock?: string, // Required keyword (regexp) to see this in the search engine.
} & ({
  msvg?: string,
  text: string}
  |
  { // We need either mxl or text to be defined.
  msvg: string,
  text?: string,
})

export type SongHit = Song & {
  chapterindex?: number,
  songindex?: number
}

export type Chapter = {
  chapter: string,
  prefix: string,
  songs: Song[],
}

export const chapters: Chapter[] = lyrics
export const songs: Song[] = (chapters.map((c, cid) => c.songs.map((s, sid) => { return { ...s, chapterindex: cid, songindex: sid } as SongHit })).flat().concat(leo.songs as Song[]))

export function getSongsByIndices(indices: SongIndex[]): Song[] {
  const out: Song[] = []
  for (const songIndex of indices) {
    out.push(chapters[songIndex[0]].songs[songIndex[1]])
  }
  return out
}

export function getSongByStringIndex(idx: string): Song | undefined {
  const hits = songs.filter(s => s.index === idx)
  if (hits.length > 0) {
    return hits[0]
  } else return undefined
}
