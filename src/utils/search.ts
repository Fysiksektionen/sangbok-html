import Fuse from 'fuse.js'
import { songs, SongHit } from './lyrics'

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
    },
    {
      name: 'index',
      weight: 1
    }
  ]
}

const fuse = new Fuse(songs, options)

export function search(s: string): Fuse.FuseResult<SongHit>[] {
  return fuse.search(s)
}
