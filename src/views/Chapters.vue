<template>
  <Navbar/>
  <SearchBox/>
  <table class="songbook">
      <tr v-for="chapter in $store.state.lyrics.chapters" v-bind:key="chapter.prefix">
          <td class="index">
              {{$store.state.settings.translate ? greek2latin(chapter.prefix) : chapter.prefix}}
          </td>
          <td class="name">
              {{ chapter.chapter }}
          </td>
      </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'

export default defineComponent({
  name: 'ChapterView',
  components: {
    Navbar,
    SearchBox
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

<style scoped lang="css">
table {
  font-family: 'EB Garamond', serif;
  width: 98%;
  margin-left: 1%;
  margin-right: 1%;
  border-spacing: 0;
}
</style>
