<!-- Main chapter list view-->

<template>
  <Navbar/>
  <div class="main">
    <SearchBox/>
    <table class="songbook">
        <tr v-for="(chapter, idx) in $store.state.lyrics.chapters"
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
import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'

export default defineComponent({
  name: 'ChaptersView',
  components: {
    Navbar,
    SearchBox
  },
  created() {
    if (this !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$store.commit('setQuery', '')
    }
  },
  methods: {
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
        Lℓ: 'Leo'
      }
      return dict[greek]
    }
  }
})
</script>
