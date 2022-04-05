// TODO: Perhaps use unicode instead of back.png.
import './SongNavButtons.scss'

import { useRoute, useRouter } from 'vue-router'

import Index from '@/components/Index'
import { getOffsetSongFromRoute } from '@/lyrics'

export default function SongNavButtons(): JSX.Element {
  const router = useRouter()
  const route = useRoute()
  /**
  * Returns a list of SongIndexWrapper:s, containing the previous and next song, as well as the chapter (or list) index and song index in that chapter (or list).
  * If the song is stand-alone (e.g. not in a chapter or a list), returns undefined.
  */
  function songWrappers() {
    const out = [getOffsetSongFromRoute(route, -1), getOffsetSongFromRoute(route, 1)]
    return out.indexOf(undefined) === -1 ? out : undefined
  }

  return (
    songWrappers && <div class="navbuttons">
      {songWrappers()?.map((songWrapper) =>
        <div>
          {/* We display a navigation button if we found a nearby song */
            songWrapper && <div class="button"
              onClick={() => router.replace(songWrapper.chapterPath + '/song/' + songWrapper.index)}>
              <div>{songWrapper.song.title}</div>
              <div>
                {/* TODO: Import through webpack */}
                <img src="img/back_black.png" /> &nbsp;
                <Index index={(songWrapper.song.index) || ''} />
              </div>
            </div>
          }
          {/* Or a filler if none was found. */
            !songWrapper && <div class="filler"></div>
          }
        </div>
      )}
    </div>
  )
}
