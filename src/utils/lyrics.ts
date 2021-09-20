import lyrics from '@/assets/lyrics.json'

export type Song = {
  title: string,
  index: string,
  author?: string,
  melody?: string,
  msvg?: string,
  text: string,
} | { // We need either mxl or text to be defined.
  title: string,
  index: string,
  author?: string,
  melody?: string,
  msvg: string,
  text?: string,
}

export type Chapter = {
  chapter: string,
  prefix: string,
  songs: Song[],
}

export const chapters: Chapter[] = lyrics

/* Old parser, for the old lyrics.json format.
type LyricsFile = {
  chapters: {
    chapter: string,
    prefix: string,
    songs: {
      title: string,
      author?: string | null,
      melody?: string | null,
      text: string,
    }[]
  }[],
  indexes: string[][]
}

function loadLyrics(): Chapter[] {
  const db: LyricsFile = lyrics
  // TODO: Double-check if const is actually preferred.
  // eslint-disable-next-line prefer-const
  let out: Chapter[] = []

  for (const i in db.chapters) {
    out.push({
      chapter: db.chapters[i].chapter,
      prefix: db.chapters[i].prefix,
      songs: db.chapters[i].songs.map((song, idx): Song => {
        return {
          ...song,
          author: !song.author ? '' : song.author,
          melody: !song.melody ? '' : song.melody,
          index: db.indexes[i][idx]
        }
      })
    })
  }
  console.log(JSON.stringify(out))
  return out
}
*/
