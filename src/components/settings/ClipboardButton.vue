<template>
  <div @click="copy" class="setting clipboard">
    Kopiera sångtext
    <transition name="fade">
      <div class="checkmark" style="color: #0E0;" v-if="state=='ok'">✔</div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
  computed: {
    lyrics () { // Returns the title and the lyrics of the current song, to be copied.
      const route: RouteLocationNormalized = this.$route
      if (route.name && route.name.toString().startsWith('Song')) {
        const song = getSongFromRoute(route)
        return song !== undefined ? song.title + '\n\n' + song.text : ''
      } else { return '' }
    }
  },
  methods: {
    copy () { // Attempt to copy, and show an indicator of how it went.
      if (this.lyrics === '') {
        this.state = 'err'
        return
      }
      this.state = copy(this.lyrics) ? 'ok' : 'err'
      setTimeout(this.resetState, 1000)
    },
    resetState () {
      // This is a separate function due to us needing the this, variable, which is not in scope for lambda function (there may be a better way to do this)
      this.state = 'none'
    }
  }
})
</script>

<style scoped lang="css">
  /* TODO: This is redundantly defined, also in SettingsButton.vue*/
  div.setting {padding: 0.8em 0;}

  .checkmark {
    float: right;
    width: 0.8em;
    height: 0.8em;
    padding: 0;
    margin-right: 0.1em;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
