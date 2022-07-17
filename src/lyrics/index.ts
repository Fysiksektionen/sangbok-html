// Content imports
import lyrics from './lyrics.json'
import leo from './addons/leo.json'
import ths from './addons/ths.json'
import extraSongs from './addons/songs.json'

// TS imports
import { preprocessChapter, addSongTags } from './importHelpers'
import { Chapter, Song, SongIndex, JSONChapter } from './types'

// Exports from other files
export type { Song, Chapter, SongHit, SongIndex } from './types'
export { hasSheetMusic } from './importHelpers'
export { getChapterFromRoute, getSongFromRoute, getOffsetSongFromRoute, param2int } from './routeGetters'

/** Main menu chapters. */
export const chapters: Chapter[] = lyrics.map(preprocessChapter)

/** List of song for search. */
export const songs: Song[] = (function () {
  // Regular songs
  const songs = ([...chapters]
    .map((chapter, chapterId) => chapter.songs.map((song, songId) => addSongTags(song, songId, chapterId))).flat())
  // THS chapter.
  const thsSongs = (([ths] as JSONChapter[])
    .map(preprocessChapter)
    .map((chapter) => chapter.songs.map((song, songId) => addSongTags(song, songId, chapter.prefix))).flat())
  // Add standalone songs and return (notes: these are NOT pre-processed with something preprocessChapter-like)
  return songs.concat(thsSongs).concat(extraSongs as Song[])
})()

/**
 * Attempts to find a song with the given string index.
 * @param index The string index (eg. α1)
 * @returns The found Song object, or undefined if none was found.
 */
export function getSongByStringIndex(index: string): Song | undefined {
  // List of all songs (for viewing. Includes easter eggs.)
  const allSongs: Song[] = songs.concat(leo.songs as Song[]).concat(ths.songs as Song[])
  const hits = allSongs.filter(s => s.index === index)
  if (hits.length > 0) { return hits[0] }
}

/**
 * Attempts to find songs from a list of string indices.
 * Indices that are not found do not affect the output (we don't add anything if a particular index is not found.)
 * @param indices A list of string indices (eg. ['α1', 'α2'])
 * @returns A list of Song objects.
 */
export function getSongsByStringIndices(indices: SongIndex[]): Song[] {
  const out: Song[] = []
  for (const songIndex of indices) {
    const song = getSongByStringIndex(songIndex)
    song && out.push(song)
  }
  return out
}

/**
 * Attempts to find a chapter with the given string index.
 * @param index The string index (eg. Aα)
 * @returns The found Chapter object, or undefined if none was found.
 */
export function getChapterByStringIndex(idx: string): Chapter | undefined {
  const addPathToPrefixedChapter = (c: JSONChapter) => { return { ...c, path: '/chapter/' + c.prefix } as Chapter }
  const allChapters: Chapter[] = chapters.concat(([leo, ths] as JSONChapter[]).map(addPathToPrefixedChapter))
  const hits = allChapters.filter(c => c.prefix === idx)
  if (hits.length > 0) { return hits[0] }
}
