import { greek2latin, greek2latin2 } from './other'

import lyrics from '@/assets/lyrics.json'
import leo from '@/assets/addons/leo.json'
import extraSongs from '@/assets/addons/songs.json'

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
  songindex?: number,
  tags?: string[]
}

export type Chapter = {
  chapter: string,
  prefix: string,
  songs: Song[],
}

export const chapters: Chapter[] = lyrics

// List of songs for search
export const songs: Song[] = (chapters.map((c, cid) => c.songs.map((s, sid) => { return { ...s, chapterindex: cid, songindex: sid, tags: [greek2latin(s.index), greek2latin2(s.index), s.msvg ? 'noter' : ''] } as SongHit })).flat()).concat(extraSongs as Song[])

export function getSongsByIndices(indices: SongIndex[]): Song[] {
  const out: Song[] = []
  for (const songIndex of indices) {
    out.push(chapters[songIndex[0]].songs[songIndex[1]])
  }
  return out
}

export function getSongByStringIndex(idx: string): Song | undefined {
  // List of all songs (for viewing. Includes easter eggs.)
  const allSongs: Song[] = songs.concat(leo.songs as Song[])
  const hits = allSongs.filter(s => s.index === idx)
  if (hits.length > 0) {
    return hits[0]
  } else return undefined
}

export function getChapterByStringIndex(idx: string): Chapter | undefined {
  // List of all songs (for viewing. Includes easter eggs.)
  const cs: Chapter[] = chapters.concat([leo as Chapter])
  const hits = cs.filter(c => c.prefix === idx)
  if (hits.length > 0) {
    return hits[0]
  } else return undefined
}
