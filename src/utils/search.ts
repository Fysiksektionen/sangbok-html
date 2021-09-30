import Fuse from 'fuse.js'
import { chapters, Song } from './lyrics'

type SongHit = Song & {
  chapterindex: number,
  songindex: number
}

const options = {
  includeScore: true,
  isCaseSensitive: false,
  shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 3,
  // location: 0,
  threshold: 0.2, // 0 makes the algorithm super picky, 1 matches almost anything. 0.2 seems fairly ok.
  // distance: 100,
  // useExtendedSearch: false,
  ignoreLocation: true,
  // ignoreFieldNorm: false,
  keys: [
    {
      name: 'title',
      weight: 10
    },
    {
      name: 'author',
      weight: 1
    },
    {
      name: 'melody',
      weight: 1
    },
    {
      name: 'text',
      weight: 1
    }
  ]
}

const db = chapters.map((c, cid) => c.songs.map((s, sid) => { return { ...s, chapterindex: cid, songindex: sid } as SongHit })).flat()
const fuse = new Fuse(db, options)

export function search(s: string): Fuse.FuseResult<SongHit>[] {
  return fuse.search(s)
}
