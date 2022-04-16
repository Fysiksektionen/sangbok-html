// View to list all songs in a chapter.

import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Index from '@/components/Index'
import Swiper from '@/components/Swiper' // @ is an alias to /src
import { SwipeIndicatorState } from '@/utils/swipe'
import { getChapterFromRoute, Chapter, hasSheetMusic } from '@/lyrics'

// TODO: Make functional
export default defineComponent({
  name: 'ChapterView',
  data() {
    const chapter = getChapterFromRoute(this.$route)
    if (chapter === undefined) { alert('Något gick riktigt snett. Kapitlet kan inte bestämmas.') }
    return { chapter: chapter as Chapter }
  },
  setup() { return { store: useStore(key) } },
  methods: {
    hasSheetMusic: hasSheetMusic,
    swipeHandler(direction: SwipeIndicatorState) {
      // Move up to the main view if the user swipes right (that is, the indicator is shown on the left-hand side, hence the 'left')
      (direction === 'left') && this.$router.push('/')
    },
    clickHandler(idx: number) {
      // Chapters can be accessed by either their index in the main view (cid), or by their index (mostly used for hidden chapters).
      // Depending on how the chapter was accessed, we access the songs differently.
      if (this.$route.name === 'ChapterByIndex') {
        this.$router.push('/chapter/' + this.chapter.prefix + '/song/' + idx)
      } else {
        this.$router.push('/chapter/' + this.$route.params.cid + '/song/' + idx)
      }
    }
  },
  render() {
    return (
      <Swiper swipeHandler={this.swipeHandler} right="hide">
        <div class="main">
          <h2>{this.chapter.chapter}</h2>
          <table class="songbook">
            {this.chapter.songs.map((song, idx) =>
              <tr onClick={() => this.clickHandler(idx)}>
                <td class="index"><Index index={song.index} /></td>
                <td class="name">
                  <span v-html={song.title}></span>
                  {hasSheetMusic(song) && this.store.state.settings.sheetmusic && <span class="sheetmusicicon">𝄢</span>}
                </td>
              </tr>)}
          </table>
        </div>
      </Swiper>
    )
  }
})
