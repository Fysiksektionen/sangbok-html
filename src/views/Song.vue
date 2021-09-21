<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="goToParent"/>
  <div class="main">
    <div class="lyrics">
      <button v-if="song().msvg && song().text" @click="showMsvg = !showMsvg" class="button musicbutton">{{ showMsvg ? 'Dölj noter' : 'Visa noter'}}</button>
      <SheetMusicRenderer v-if="song().msvg && (!song().text || showMsvg)" :src="song().msvg"/>
      <div v-if="song().text">
        <div class="titlecontainer" v-bind:style="{'minHeight':(song().msvg && !showMsvg ? '5em' : undefined)}">
          <h2>{{song().title}}</h2>
          <div v-if="song().melody" class="melody" v-html="toHTML(song().melody)"></div>
        </div>
        <div class="textcontainer" v-html="toHTML(song().text)" v-bind:class="{'larger': $store.state.settings.larger}"></div>
        <div v-if="song().author" class="author" v-html="toHTML(song().author)"></div>
      </div>
      <NavButtons :chapterid="$route.params.chapterId" :songid="$route.params.songId"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import NavButtons from '@/components/SongNavButtons.vue'
import { chapters, Song } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'SongView',
  components: {
    Navbar,
    NavButtons,
    SheetMusicRenderer: defineAsyncComponent(() => import(/* webpackChunkName: "musicrenderer" */ '@/components/SheetMusicRenderer.vue'))
  },
  data() {
    const route: RouteLocationNormalized = useRoute()
    const param2int = (s: string | string[]): number => parseInt((typeof s === 'string') ? s : s[0])
    return {
      chapters: chapters,
      // TODO: This is an ugly fix for the song not updating when pressing NavButtons. It can probably be done using computed()
      song: () => chapters[param2int(route.params.chapterId)].songs[param2int(route.params.songId)] as Song,
      showMsvg: false
    }
  },
  setup () {
    return { store: useStore(key) }
  },
  methods: {
    toHTML (text: string): string {
      return text.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/\n/igm, '<br />')
    },
    goToParent () { // store.state.query is set if the user came from search. If that's the case, send them back to the search page, else go to the chapter page.
      if (this !== undefined) {
        if (this.store.state.query !== '') {
          this.$router.push('/search/' + this.store.state.query)
        } else {
          this.$router.push('/chapter/' + this.$route.params.chapterId)
        }
      }
    }
  }
})
</script>

<style scoped lang="scss">
div.lyrics {
  margin-left: 1%;
  margin-right: 1%;
}

div.titlecontainer {
  margin: auto auto;
  width: max-content;
}

button.button.musicbutton {
  float: left;
}

.melody, .author {
    font-style: italic;
    padding-right: 24px;
    padding-left: 24px;
}
.melody {text-align: center;margin-bottom: 12px;}
.author {text-align: right;}

.textcontainer {
    text-align: left;
    display: inline-block;
    padding: 0 24px 12px;
    font-size: 1.05em;
    line-height: 1.25em;
    &.larger {
      font-size: 1.2em;
      line-height: 1.5em;
    }
}
</style>
