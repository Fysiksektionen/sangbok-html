
import { RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { chapters, getChapterByStringIndex, Chapter, Song, getSongByStringIndex, getSongsByStringIndices } from '.'

// TODO: Move elsewhere
export function param2int(s: string | string[]): number { return parseInt((typeof s === 'string') ? s : s[0]) }

// TODO: Perhaps move to router or something. I don't really want this file to rely on store

export function getSongFromRoute(route: RouteLocationNormalized): Song | undefined {
  // TODO: Make switch statement instead.
  if (route.name === 'SongByIndex') {
    return getSongByStringIndex(route.params.songIndex as string)
  } else if (route.name === 'SongByChapterIndex') {
    const ch = getChapterByStringIndex(route.params.chapterIndex as string)
    if (ch) { return ch.songs[param2int(route.params.songId)] }
  } else if (route.name === 'SongFromList') {
    const list = useStore(key).state.lists[param2int(route.params.listId)]
    if (list !== undefined) {
      const song = getSongByStringIndex(list.songs[param2int(route.params.songId)])
      if (song) return song
    }
  } else if (route.name === 'Song') {
    return chapters[param2int(route.params.chapterId)].songs[param2int(route.params.songId)] as Song
  } else {
    alert('Något gick snett. Du får gärna upplysa sångboksansvarig eller webmaster om detta.\nFel: Kan inte avgöra sång för ruttnamn: ' + (route.name && route.name.toString()))
  }
}

export function getChapterFromRoute(route: RouteLocationNormalized): Chapter | undefined {
  switch (route.name) {
  case 'SongByIndex':
    return undefined
    break
  case 'SongByChapterIndex':
    return getChapterByStringIndex(route.params.chapterIndex as string)
    break
  case 'Song':
    return chapters[param2int(route.params.chapterId)]
    break
  case 'SongFromList':
    // eslint-disable-next-line no-case-declarations
    const list = useStore(key).state.lists[param2int(route.params.listId)]
    return {
      chapter: list.name,
      prefix: 'list/' + param2int(route.params.listId), // TODO: This is ugly-redirected by the router as of now.
      songs: getSongsByStringIndices(list.songs)
    } as Chapter
    break
  case 'ChapterByIndex':
    return getChapterByStringIndex(route.params.chapterIndex as string)
    break
  default:
    console.error('getChapter called for unknown route: ' + (route.name?.toString()))
    return undefined
    break
  }
}
