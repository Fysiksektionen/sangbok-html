import './Search.scss'

import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import Fuse from 'fuse.js'

import { SongHit, hasSheetMusic } from '@/lyrics'
import { search } from '@/utils/search' // @ is an alias to /src
import Index from '@/components/Index'
import Swiper from '@/components/Swiper'
import { SwipeIndicatorState } from '@/utils/swipe'

/** View to list all songs in a chapter. */
export default defineComponent({
  name: 'SearchView',
  setup() { return { store: useStore(key) } },
  methods: {
    /** Sends the user to the target of the hit. */
    goto(hit: Fuse.FuseResult<SongHit>) {
      if (hit.item.chapterindex !== undefined && hit.item.songindex !== undefined) {
        this.$router.push('/chapter/' + hit.item.chapterindex + '/song/' + hit.item.songindex)
      } else if (hit.item.chapterindex !== undefined && hit.item.songindex === undefined) {
        this.$router.push('/chapter/' + hit.item.chapterindex)
      } else {
        this.$router.push('/song/' + hit.item.index)
      }
    },
    swipeHandler(direction: SwipeIndicatorState) {
      // Send the user to the main view if they swipe right (which gives an indicator on the 'left').
      if (direction === 'left') { this.$router.push('/') }
    }
  },
  render() {
    const results = search(this.$route.params.query as string)

    return (
      <Swiper swipeHandler={this.swipeHandler} right="hide">
        <div class="main">
          <table class="songbook">
            {results !== false && results.map((hit) => <tr
              data-score={hit.score} // Primarily for debug
              onClick={() => this.goto(hit)}>
              {/* TODO: As of now, lists are not visible in search. Don't forget to prevent XSS from list titles without using CSP if you implement that. */}
              <td class="index"><Index index={(hit.item.index || hit.item.chapterindex || '').toString()} /></td>
              <td class="name">
                {hit.item.title}
                {hasSheetMusic(hit.item) && this.store.state.settings.sheetmusic && <span class="sheetmusicicon">𝄢</span>}
              </td>
            </tr>)}
            {(Array.isArray(results) && results.length === 0) &&
              <tr class="nohits" data-test="noSongsFound">
                <td>Inga sånger hittades.</td>
              </tr>}
            {results === false &&
              <tr class="nohits">
                <td>Sökningen misslyckades. Du får gärna rapportera detta <a href="https://github.com/Fysiksektionen/sangbok-html/issues">här</a>.</td>
              </tr>}
          </table>
        </div>
      </Swiper>
    )
  }
})
