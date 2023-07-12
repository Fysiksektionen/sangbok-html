import Fuse from 'fuse.js'
import { songs, SongHit, Song, keys } from '../lyrics'

/** Fuse instance used for searching for songs. */
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

/** Fuse instance used for searching for addons (hidden chapters). */
const addons = new Fuse(keys, {
  includeScore: true,
  isCaseSensitive: false,
  minMatchCharLength: 3,
  threshold: 0.1,
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 10 },
    { name: 'tags', weight: 0.5 },
    'index',
    'chapterindex'
  ]
})

// Ordering score. Not used for filtering.
function score(res: Fuse.FuseResult<Song>): number {
  // Keys don't necessarily have all fields of SongHit, hence we need to check if the index field exists.
  // TODO: Add proper TypeScript types to "keys" (addons)
  let score = res.score || 0

  // Make sigma songs lower priority
  score *= ((res.item.index && res.item.index.startsWith('σ')) ? 0.75 : 1)

  // The "+" tag gives a score boost
  score *= ((res.item.tags && res.item.tags.includes('+')) ? 1.25 : 1)

  return score
}

/**
 * Performs a search for both songs and addons (which in practice means hidden chapters).
 * On error, returns false.
 * @param query Search query string
 * @returns A list of results, sorted by best match, or false if an error was encountered.
 */
export function search(query: string): Fuse.FuseResult<SongHit>[] | false {
  try {
    const res = fuse.search(query).concat(addons.search(query))
    res.sort((x, y) => { return score(y) - score(x) })
    return res
  } catch (err) {
    console.error(err)
    return false
  }
}
