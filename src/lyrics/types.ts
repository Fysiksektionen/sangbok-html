export type SongIndex = string

/** Song, as specified on lyrics.json */
export type Song = {
  title: string,
  index: string,
  author?: string | null,
  melody?: string,
  tags?: string[]
  text: string
}

/** Song, as used by Search. */
export type SongHit = Song & {
  chapterindex?: number | string,
  songindex?: number,
  tags?: string[]
}

/** Chapter hit, as used by Search */
export type ChapterHit = {
  title: string,
  chapterindex: number | string
}

/** Search result. */
export type SearchHit = SongHit | ChapterHit

/** Chapter, as stored in lyrics.json */
export type JSONChapter = {
  chapter: string,
  prefix: string,
  icon?: string,
  songs: Song[],
  hideSongsFromSearch?: boolean
}

/** Chapter, as used internally */
export type Chapter = {
  chapter: string,
  prefix: string,
  icon?: string,
  path: string,
  songs: Song[],
}
