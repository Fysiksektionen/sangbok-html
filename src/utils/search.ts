import Fuse from 'fuse.js'
import { songs, SongHit } from '../lyrics'
import keys from '@/lyrics/addons/search.json'

// Song search engine
const fuse = new Fuse(songs, {
  includeScore: true,
  isCaseSensitive: false,
  ignoreLocation: true,
  minMatchCharLength: 3,
  shouldSort: false, // We sort afterwards, manually.
  threshold: 0.2, // 0 makes the algorithm super picky, 1 matches almost anything. 0.2 seems fairly ok.
  keys: [
    { name: 'title', weight: 10 },
    { name: 'tags', weight: 0.5 },
    // Has weight (priority) 1:
    'author',
    'melody',
    'text',
    'index'
  ]
})

// Addons (chapters) search engine
const addons = new Fuse(keys as SongHit[], {
  includeScore: true,
  isCaseSensitive: false,
  minMatchCharLength: 3,
  threshold: 0.1,
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 10 },
    'index',
    'chapterindex'
  ]
})

/**
 * Performs a search for both songs and addons (which in practice means hidden chapters).
 * @param s Search query string
 * @returns A list of results, sorted by best match.
 */
export function search(s: string): Fuse.FuseResult<SongHit>[] {
  return (fuse.search(s)
    .concat(addons.search(s))
    .sort((x, y) => { return (x.score || 0) - (y.score || 0) })
  )
}
