
import { RouteLocationNormalized } from 'vue-router'
import store from '@/store'
import { chapters, getChapterByStringIndex, Chapter, Song, getSongByStringIndex, getSongsByStringIndices } from '.'

/**
 * @str str The parameter to be converted to int
 * @returns The parameter, parsed as int (hopefully).
 */
export function param2int(value: string | string[]): number {
  return parseInt((typeof value === 'string') ? value : value[0])
}

/**
 * Retrieve a Song object for a given route.
 * @param route The current route object.
 * @returns the Song object associated with the current route, or undefined if none was found.
 */
export function getSongFromRoute(route: RouteLocationNormalized): Song | undefined {
  switch (route.name) {
  case 'Song':
    return chapters[param2int(route.params.chapterId)].songs[param2int(route.params.songId)] as Song

  case 'SongByIndex':
    return getSongByStringIndex(route.params.songIndex as string)

  case 'SongByChapterIndex': {
    const ch = getChapterByStringIndex(route.params.chapterIndex as string)
    if (ch) { return ch.songs[param2int(route.params.songId)] }
    break
  }

  case 'SongFromList': {
    const list = store.state.lists[param2int(route.params.listId)]
    if (list !== undefined) {
      const song = getSongByStringIndex(list.songs[param2int(route.params.songId)])
      if (song) return song
    }
    break
  }

  default:
    alert('Något gick snett. Du får gärna upplysa sångboksansvarig eller webmaster om detta.\nFel: Kan inte avgöra sång för ruttnamn: ' + (route.name && route.name.toString()))
    break
  } // End switch
}

/**
 * Retrieve a Chapter object for a given route.
 * @param route The current route object.
 * @returns the Chapter object associated with the current route, or undefined if none was found.
 */
export function getChapterFromRoute(route: RouteLocationNormalized): Chapter | undefined {
  switch (route.name) {
  // Song views
  case 'Song':
    return chapters[param2int(route.params.chapterId)]

  case 'SongByIndex':
    return undefined

  case 'SongByChapterIndex':
    return getChapterByStringIndex(route.params.chapterIndex as string)

  case 'SongFromList': {
    const list = store.state.lists[param2int(route.params.listId)]
    return {
      chapter: list.name,
      prefix: route.params.listId as string, // TODO: This is ugly-redirected by the router as of now.
      songs: getSongsByStringIndices(list.songs),
      path: `/list/${route.params.listId}`
    }
  }

  // Chapter views
  case 'Chapter':
    return chapters[param2int(route.params.cid)]

  case 'ChapterByIndex':
    return getChapterByStringIndex(route.params.chapterIndex as string)

  default:
    console.error('getChapter called for unknown route: ' + (route.name?.toString()))
    return undefined
  } // End switch
}

/**
 * Wraps a song with a chapter path and index in that chapter (or list).
 */
type SongIndexWrapper = { song: Song, chapterPath: string, index: number }

/**
 * Returns the previous or next Song, given a route.
 * Attempting to get the song after the last or before the first in a chapter or list returns false.
 * Returns undefined if no chapter could be found.
 * @param route The current route object.
 * @param offset Use -1 for previous, and 1 for next.
 * @returns the previous or next song as a SongIndexWrapper object. May return undefined or false if no song was found.
 */
export function getOffsetSongFromRoute(route: RouteLocationNormalized, offset: 1 | -1): undefined | false | SongIndexWrapper {
  // Index-references are not associated with any list or chapter.
  if (route.name === 'SongByIndex') return undefined

  // Get the "Chapter" (i.e. chapter or list), and the song index in the "Chapter"
  const chapter = getChapterFromRoute(route)
  const songId = param2int(route.params.songId as string)
  if (!chapter) return undefined

  // If id + offset lie outside of the indexes of the chapter.
  if ((songId + offset > chapter.songs.length - 1) || (songId + offset < 0)) return false

  // Success
  return {
    song: chapter.songs[songId + offset],
    chapterPath: chapter.path,
    index: songId + offset
  }
}
