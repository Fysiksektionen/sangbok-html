import './Song.scss'

import { defineComponent, defineAsyncComponent, Transition } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import Index from '@/components/Index'
import ListModal from '@/views/song/ListModal'
import Swiper from '@/components/Swiper'
import NavButtons from '@/views/song/SongNavButtons'
import { SwipeIndicatorState, swipeIndicatorToOffset } from '@/utils/swipe'
import { getSongFromRoute, getChapterFromRoute, getOffsetSongFromRoute, hasSheetMusic, Song } from '@/lyrics'
import { removeSheetMusicNotice, toHTML } from '@/utils/other'
import { hasMxlSheetMusic } from '@/lyrics/importHelpers'

/** View to list all songs in a chapter. */
export default defineComponent({
  name: 'SongView',
  setup() { return { store: useStore(key) } },
  data() {
    const route: RouteLocationNormalized = useRoute()
    return {
      chapter: getChapterFromRoute(route),
      listModalVisible: false,
      // A boolean indicating whether the sheetmusic should be visible, if applicable.
      showMsvg: false
    }
  },
  computed: {
    song() { return getSongFromRoute(this.$route) },
    /** @returns true if the current song has sheet music, and false otherwise. */
    sheetMusicAvailable() { return hasMxlSheetMusic(getSongFromRoute(this.$route) as Song) }
  },
  methods: {
    toHTML,
    /** Sends the user to the next or previous song on swipes. */
    swipeHandler(direction: SwipeIndicatorState) {
      // If newSong is false we are on the first/last song and cannot swipe further.
      // If it's undefined, we are not in a chapter or list, and there is nowhere to go.
      // Hence we check that newSong is valid before asking the router to do its thing.
      const offset = swipeIndicatorToOffset[direction]
      if (offset === 0) return
      const newSong = getOffsetSongFromRoute(this.$route, offset)
      newSong && this.$router.replace(newSong.chapterPath + '/song/' + newSong.index)
    }
  },
  render() {
    const OSMD = defineAsyncComponent(() => import('@/views/song/OSMD'))
    const songId = parseInt(this.$route.params.songId as string)

    return (
      <>
        <Swiper swipeHandler={this.swipeHandler} allowZoom={true} class="component-song"
          left={(this.$route.name === 'SongByIndex') ? 'hide' : (songId > 0) ? 'allow' : 'disallow'}
          right={(this.$route.name === 'SongByIndex') ? 'hide' : (this.chapter && this.chapter.songs.length - 1 > songId) ? 'allow' : 'disallow'}>
          <div class="main">
            {this.song && <div class="lyrics">
              {/* Pre-header */}
              {this.sheetMusicAvailable && this.song.text && this.store.state.settings.sheetmusic && !this.store.state.settings.makelist &&
                <button onClick={() => { this.showMsvg = !this.showMsvg }} class="button musicbutton">
                  {this.showMsvg ? 'Dölj noter' : '𝄢'}
                </button>}
              {this.store.state.settings.makelist && <button class="button musicbutton" onClick={() => { this.listModalVisible = true }}>+</button>}
              {!this.showMsvg && <div class="song-index"><Index index={(this.song.index) || ''} /></div>}

              {/* Main content */}
              {(!this.showMsvg || !this.store.state.settings.sheetmusic || !this.sheetMusicAvailable) &&
                <div>
                  {/* Header */}
                  <div class="titlecontainer" style={{ minHeight: (this.sheetMusicAvailable && !this.showMsvg ? '5em' : undefined) }}>
                    <h2>{this.song.title}</h2>
                    {this.song.melody && <div class="melody" v-html={toHTML(removeSheetMusicNotice(this.song.melody))}></div>}
                  </div>

                  {/* Content */}
                  <div v-html={this.toHTML(this.song.text)} class={{ textcontainer: true, larger: this.store.state.settings.larger }}></div>
                  {this.song.author && <div class="author" v-html={toHTML(this.song.author)}></div>}
                </div>}

              {/* Sheet music */}
              {/* If this is visible, the "Main content" above will be hidden. */}
              {this.sheetMusicAvailable && this.showMsvg && this.store.state.settings.sheetmusic &&
                <OSMD src={this.song.index} key={this.song.index}/>
                }

              {/* Navigation */}
              {this.chapter && <NavButtons />}
              {/* Margin if NavButtons is hidden.TODO: Check if this is really needed. */}
              {!this.chapter && <div style="height: 2em;"></div>}
            </div>}
          </div>
        </Swiper>

        {/* Modals */}
        <Transition name="modal-down">
          {this.listModalVisible &&
            <ListModal onClose={() => { this.listModalVisible = false }} style="transition: all 0.2s ease-out;" />
          }
        </Transition>
      </>
    )
  }
})
