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
  text: string
}

/** Song, as used by Search, in order to allow for chapter-only hits. */
export type SongHit = Song & {
  chapterindex?: number | string,
  songindex?: number,
  tags?: string[]
}

/** Chapter, as stored in lyrics.json */
export type JSONChapter = {
  chapter: string,
  prefix: string,
  icon?: string,
  songs: Song[],
}

/** Chapter, as used internally */
export type Chapter = {
  chapter: string,
  prefix: string,
  icon?: string,
  path: string,
  songs: Song[],
}
