<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/')"/>
  <div class="main">
    <SearchBox :query="$route.params.query"/>
    <table class="songbook">
        <tr v-for="(hit, idx) in search($route.params.query, $store.state.lyrics.chapters)"
            @click="$router.push('/chapter/'+hit.song.chapterindex+'/song/'+hit.song.songindex)"
            v-bind:key="idx">
            <td class="index">
              {{ $store.state.lyrics.indexes[hit.song.chapterindex][hit.song.songindex] }}
            </td>
            <td class="name">
                {{ $store.state.lyrics.chapters[hit.song.chapterindex].songs[hit.song.songindex].title }}
            </td>
        </tr>
        <tr class="nohits"><td>Inga sånger hittades.</td></tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { search } from '@/utils/search.ts'
import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import SearchBox from '@/components/SearchBox.vue'

export default defineComponent({
  name: 'Search',
  components: {
    Navbar,
    SearchBox
  },
  methods: {
    search: search
  },
  created() {
    if (this !== undefined) {
      // If $store.state.query is set, the Song view will go back to the search page.
      // If it is set to '', the Song view goes back to the Chapter view.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$store.commit('setQuery', this.$route.params.query)
    }
  }
})
</script>

<style scoped lang="scss">
.nohits {
  text-align: center;
  box-shadow: unset !important;
  border-bottom: unset !important;
  &:not(:first-child) {/* Hide the nohits row if there are hits. */
    visibility: hidden;
  }
}
</style>
