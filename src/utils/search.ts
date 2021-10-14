import Fuse from 'fuse.js'
import { songs, SongHit } from './lyrics'
import keys from '@/assets/addons/search.json'

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
    'author',
    'melody',
    'text',
    'index',
    {
      name: 'tags',
      weight: 0.5
    }
  ]
}

const fuse = new Fuse(songs, options)
const addons = new Fuse(keys, {
  includeScore: true,
  isCaseSensitive: false,
  minMatchCharLength: 3,
  threshold: 0.1, // 0 makes the algorithm super picky, 1 matches almost anything. 0.2 seems fairly ok.
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 10 },
    { name: 'index', weight: 1 }
  ]
})

export function search(s: string): Fuse.FuseResult<SongHit>[] {
  return fuse.search(s).concat(addons.search(s)).sort((x, y) => { return (x.score || 0) - (y.score || 0) })
}
