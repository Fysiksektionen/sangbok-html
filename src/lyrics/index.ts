import { greek2latin, greek2latin2 } from '../utils/other'

import lyrics from './lyrics.json'
import leo from './addons/leo.json'
import ths from './addons/ths.json'
import extraSongs from './addons/songs.json'
export { getChapterFromRoute, getSongFromRoute, getOffsetSongFromRoute, param2int } from './routeGetters'

export type SongIndex = string

/** Song, as specified on lyrics.json */
export type Song = {
  title: string,
  index: string,
  author?: string,
  melody?: string,
  // unlock?: string, // Required keyword (regexp) to see this in the search engine.
  tags?: string[]
 // We need either mxl or text to be defined.
} & ({ msvg?: string, text: string } | { msvg: string, text?: string })

export type SongHit = Song & {
  chapterindex?: number | string,
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
export const songs: Song[] = (
  // Regular songs.
  ([...chapters].map((c, cid) => c.songs.map((s, sid) => {
    const tags = [greek2latin(s.index), greek2latin2(s.index), s.msvg ? 'noter' : '']
    if (s.tags !== undefined) { tags.push(...s.tags) }
    return { ...s, chapterindex: cid, songindex: sid, tags: tags } as SongHit
  })).flat())
    // Searchable songs of hidden chapters (needs to be indexed by chapter prefix, not index)
    .concat((([ths] as Chapter[]).map((c) => c.songs.map((s, sid) => { return { ...s, chapterindex: c.prefix, songindex: sid, tags: [greek2latin(s.index), greek2latin2(s.index), s.msvg ? 'noter' : ''] } as SongHit })).flat()))
    // Searchable standalone songs
    .concat(extraSongs as Song[])
)

export function getSongByStringIndex(idx: string): Song | undefined {
  // List of all songs (for viewing. Includes easter eggs.)
  const allSongs: Song[] = songs.concat(leo.songs as Song[])
  const hits = allSongs.filter(s => s.index === idx)
  if (hits.length > 0) {
    return hits[0]
  } else return undefined
}

export function getSongsByStringIndices(indices: SongIndex[]): Song[] {
  const out: Song[] = []
  for (const songIndex of indices) {
    const res = getSongByStringIndex(songIndex)
    res && out.push(res)
  }
  return out
}

export function getChapterByStringIndex(idx: string): Chapter | undefined {
  // List of all songs (for viewing. Includes easter eggs.)
  const cs: Chapter[] = chapters.concat([leo, ths] as Chapter[])
  const hits = cs.filter(c => c.prefix === idx)
  if (hits.length > 0) {
    return hits[0]
  } else return undefined
}
