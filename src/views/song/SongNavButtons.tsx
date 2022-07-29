import './SongNavButtons.scss'
import backImage from '@/assets/back_black.png'

import { useRoute, useRouter } from 'vue-router'

import Index from '@/components/Index'
import { getOffsetSongFromRoute } from '@/lyrics'
import { key } from '@/store'
import { useStore } from 'vuex'

/** Component for song navigation buttons. Button values are inferred from the route. */
export default function SongNavButtons(): JSX.Element {
  const router = useRouter()
  const route = useRoute()
  const store = useStore(key)

  /**
  * Returns a list of SongIndexWrapper:s, containing the previous and next song, as well as the chapter (or list) index and song index in that chapter (or list).
  * If the song is stand-alone (e.g. not in a chapter or a list), returns undefined.
  */
  function songWrappers() {
    const out = [getOffsetSongFromRoute(route, -1), getOffsetSongFromRoute(route, 1)]
    return out.indexOf(undefined) === -1 ? out : undefined
  }

  return (
    <>
    {songWrappers() && <div class={{navbuttons: true, fixed: store.state.settings.fixednavbuttons}}>
      {songWrappers()?.map((songWrapper) =>
        <div>
          {/* We only display a navigation button if we found a nearby song */
            songWrapper && <div class="button"
              onClick={() => router.replace(songWrapper.chapterPath + '/song/' + songWrapper.index)}>
              <div>{songWrapper.song.title}</div>
              <div>
                <img src={backImage} /> &nbsp;
                <Index index={(songWrapper.song.index) || ''} />
              </div>
            </div>
          }
          {/* Or a filler ("invisible button") if no song was found. */
            !songWrapper && <div class="filler"></div>
          }
        </div>
      )}
    </div>}
    </>
  )
}
