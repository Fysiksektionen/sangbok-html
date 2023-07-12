import svglist from '@/assets/msvgs.json'
import { greek2latin, greek2latin2 } from '@/utils/other'
import { Chapter, JSONChapter, Song, SongHit } from './types'

/**
 * Converts a JSONChapter object to a Chapter object by adding the path to it, using its index.
 * Only for use by the main chapters. For prefix-indexed chapters, see getChapterByStringIndex.
 * @param chapter The JSONChapter object.
 * @param index The index of the chapter
 * @returns A Chapter object.
 */
function addPathToChapter (chapter: JSONChapter, index: number): Chapter {
  return { ...chapter, path: '/chapter/' + index }
}

/**
 * Removes any songs containing n*llan (where * is one of Øøᴓ∅⦰oO0⊘⦸)
 * @param songs a list of songs.
 * @returns a filtered list of songs
 */
function removeNollan(songs: Song[]): Song[] {
  const now = new Date()
  const nollanRE = /n.llan/gi
  if (now.getMonth() === 6 && now.getDate() >= 12) { return songs.filter((s) => !(nollanRE.test(s.title) || nollanRE.test(s.text))) } else return songs
}

/**
 * Chapter preprocessor.
 * Adds the "public path" (i.e. /chapter/2/ ), as well as applies certain filters (e.g. no songs containing n∅llan during the last weeks of august)
 * @param chapter The JSONChapter object.
 * @param index The index of the chapter
 * @returns A Chapter object.
 */
export function preprocessChapter (chapter: JSONChapter, index: number): Chapter {
  chapter.songs = removeNollan(chapter.songs)
  return addPathToChapter(chapter, index)
}

/**
 * Returns a boolean representing whether a Song object has associated sheet music or not.
 * Checks if the song index exists in the list of sheet-music-svg files, and returns true if the index was found.
 * @param song A Song object
 * @returns true if the song has sheetmusic. false otherwise.
 */
export function hasSheetMusic(song: Song): boolean {
  // The dot needs to be here, otherwise, songs like ζ1 may think it has ζ11 as sheet music.
  return svglist.filter(s => { return s.startsWith(song.index + '.') }).length > 0
}

/**
 * Adds tags to regular songs, allowing the user to find songs using indices, as well as search for 'noter' to find all songs with sheet music.
 * @param song
 * @param songId
 * @param chapterId
 * @returns A SongHit object, with tags added.
 */
export function addSongTags(song: Song, songId: number, chapterId: number | string): SongHit {
  const indexTags: string[] = [
    greek2latin(song.index),
    greek2latin2(song.index)
  ]
  const tags: string[] = hasSheetMusic(song) ? ['noter'] : []

  // If the song already had tags defined, we append these to the output tags.
  if (song.tags !== undefined) { tags.push(...song.tags) }

  return { ...song, chapterindex: chapterId, songindex: songId, tags, indexTags} as SongHit
}
