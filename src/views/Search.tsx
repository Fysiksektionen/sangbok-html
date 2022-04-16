// View to list all songs in a chapter.

import { defineComponent } from 'vue'
import Fuse from 'fuse.js'

import './Search.scss'

import { SongHit, hasSheetMusic } from '@/lyrics'
import { search } from '@/utils/search' // @ is an alias to /src
import SearchBox from '@/components/SearchBox'
import Index from '@/components/Index'
import Swiper from '@/components/Swiper'
import { SwipeIndicatorState } from '@/utils/swipe'
import { useStore } from 'vuex'
import { key } from '@/store'

export default defineComponent({
  name: 'Search',
  setup() { return { store: useStore(key) } },
  methods: {
    search: search,
    hasSheetMusic: hasSheetMusic,
    /** Sends the user to the target of the hit. */
    goto (hit: Fuse.FuseResult<SongHit>) {
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
    return (
      <Swiper swipeHandler={this.swipeHandler} right="hide">
        <div class="main">
          <SearchBox query={this.$route.params.query as string} />
          <table class="songbook">
            {search(this.$route.params.query as string).map((hit) => <tr
              onClick={() => this.goto(hit)}>
              {/* TODO: As of now, lists are not visible in search. Don't forget to prevent XSS from list titles without using CSP if you implement this. */}
              <td class="index"><Index index={(hit.item.index || hit.item.chapterindex || '').toString()} /></td>
              <td class="name">
                { hit.item.title }
                {hasSheetMusic(hit.item) && this.store.state.settings.sheetmusic && <span class="sheetmusicicon">𝄢</span>}
              </td>
            </tr>)}
            <tr class="nohits">
              <td>Inga sånger hittades.</td>
            </tr>
          </table>
        </div>
      </Swiper>
    )
  }
})
