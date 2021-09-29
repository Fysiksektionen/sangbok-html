<!-- Main chapter list view-->

<template>
  <Navbar/>
  <div class="main" v-touch:drag="dragHandler" v-bind:style="onlyAllowZoomOut">
    <SearchBox/>
    <table class="songbook">
        <tr v-for="(chapter, idx) in chapters"
            @click="$router.push('/chapter/'+idx)"
            v-bind:key="idx">
            <td class="index">
                {{$store.state.settings.translate ? greek2latin(chapter.prefix) : chapter.prefix}}
            </td>
            <td class="name">
                {{ chapter.chapter }}
            </td>
        </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import { onlyAllowZoomOut } from '@/utils/swipe.ts'
import SearchBox from '@/components/SearchBox.vue'
import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'ChaptersView',
  components: {
    Navbar,
    SearchBox
  },
  data() {
    return {
      chapters: chapters,

      onlyAllowZoomOut: onlyAllowZoomOut()
    }
  },
  created() {
    useStore(key).commit('setQuery', '')
  },
  methods: {
    dragHandler () {
      this.onlyAllowZoomOut = onlyAllowZoomOut()
    },
    greek2latin (greek: string): string {
      const dict: { [key: string]: string } = {
        Αα: 'Alfa',
        Ββ: 'Beta',
        Γγ: 'Gamma',
        Δδ: 'Delta',
        Εε: 'Epsilon',
        Ζζ: 'Zeta',
        Ηη: 'Eta',
        Θθ: 'Theta',
        Ιι: 'Iota',
        Κκ: 'Kappa',
        Λλ: 'Lambda',
        Μμ: 'My',
        Νν: 'Ny',
        Οο: 'Omikron',
        Σσ: 'Sigma',
        Lℓ: 'Leo' // TODO: Why?
      }
      return dict[greek]
    }
  }
})
</script>
