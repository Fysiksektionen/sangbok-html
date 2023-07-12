// Content imports
import { lyrics } from './chapters/'
import { hiddenChapters, hiddenSongs } from './addons/'

// TS imports
import { preprocessChapter, addSongTags } from './importHelpers'
import { Chapter, Song, SongIndex, JSONChapter, ChapterHit, SongHit } from './types'

// Exports from other files
export type { Song, Chapter, SongHit, SongIndex } from './types'
export { hasSheetMusic } from './importHelpers'
export { getChapterFromRoute, getSongFromRoute, getOffsetSongFromRoute, param2int } from './routeGetters'

/** Main menu chapters. */
export const chapters: Chapter[] = lyrics.map(preprocessChapter)

/** List of song for search. */
export const songs: SongHit[] = (function () {
  // Regular songs
  const songs = ([...chapters]
    .map((chapter, chapterId) => chapter.songs.map((song, songId) => addSongTags(song, songId, chapterId))).flat())

  // Addon chapters
  const addonSongs = (hiddenChapters
    .filter(chapter => chapter.hideSongsFromSearch !== true)
    .map(preprocessChapter)
    .map(chapter => chapter.songs.map((song, songId) => addSongTags(song, songId, chapter.prefix))).flat())
  // Add standalone songs and return (notes: these are NOT pre-processed with something preprocessChapter-like)
  return songs.concat(addonSongs).concat(hiddenSongs)
})()

/**
 * Attempts to find a song with the given string index.
 * @param index The string index (eg. α1)
 * @returns The found Song object, or undefined if none was found.
 */
export function getSongByStringIndex(index: string): Song | undefined {
  // List of all songs (for viewing. Includes easter eggs.)
  const allSongs: Song[] = songs.concat(hiddenChapters.map(ch => ch.songs).flat())
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
  const allChapters: Chapter[] = chapters.concat(hiddenChapters.map(addPathToPrefixedChapter))
  const hits = allChapters.filter(c => c.prefix === idx)
  if (hits.length > 0) { return hits[0] }
}

// Define search keys for hidden chapters. Used by @/utils/search.ts
export const keys: ChapterHit[] = hiddenChapters.map(ch => {
  return {
    title: ch.chapter,
    chapterindex: ch.prefix
  }
})
