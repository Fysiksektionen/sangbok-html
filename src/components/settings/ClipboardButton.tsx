import { defineComponent, Transition } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import { getSongFromRoute } from '@/lyrics'
import copy from 'copy-to-clipboard'

export default defineComponent({
  name: 'ClipboardButton',
  data () {
    return {
      // The state determines the icon that's shown.
      state: 'none' as 'none' | 'ok' | 'err'
    }
  },
  render() {
    return (
      <div onClick={this.copy} class="setting clipboard">
          Kopiera sångtext
        <Transition name="fade">
          { this.state === 'ok' && <div class="checkmark" style="color: #0E0;">✔</div> }
        </Transition>
      </div>
    )
  },
  computed: {
    /** Returns the title and the lyrics of the current song, to be copied. */
    lyrics () {
      const route: RouteLocationNormalized = this.$route
      if (route.name && route.name.toString().startsWith('Song')) {
        const song = getSongFromRoute(route)
        return song !== undefined ? song.title + '\n\n' + song.text : ''
      } else { return '' }
    }
  },
  methods: {
    /** Attempts to copy the lyrics, and starts displaying an indicator of how it went. */
    copy () {
      if (this.lyrics === '') {
        this.state = 'err'
        return
      }
      this.state = copy(this.lyrics) ? 'ok' : 'err'
      setTimeout(() => { this.state = 'none' }, 1000)
    }
  }
})
