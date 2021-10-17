<template>
  <div v-if="isSongStage" @click="copy" class="setting clipboard">
    Kopiera sångtext
    <transition name="fade">
      <div class="checkmark" style="color: #0E0;" v-if="state=='ok'">✔</div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationNormalized } from 'vue-router'
import { chapters } from '@/lyrics'
import copy from 'copy-to-clipboard'

export default defineComponent({
  name: 'ClipboardButton',
  data () {
    return {
      state: 'none' as 'none' | 'ok' | 'err'
    }
  },
  computed: {
    isSongStage () {
      const route: RouteLocationNormalized = this.$route
      return route.name && route.name.toString().startsWith('Song')
    }
  },
  methods: { // TODO: Move to computed
    lyrics () {
      const route: RouteLocationNormalized = this.$route
      if (route.name && route.name.toString().startsWith('Song')) {
        const songId = parseInt(route.params.songId as string)
        const chapterId = parseInt(route.params.chapterId as string)
        const song = chapters[chapterId].songs[songId]
        return song.title + '\n\n' + song.text
      } else { return '' }
    },
    copy () {
      this.state = copy(this.lyrics()) ? 'ok' : 'err'
      setTimeout(this.resetState, 1000)
    },
    resetState () {
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
