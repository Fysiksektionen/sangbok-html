<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/')"/>
  <div class="main">
    <SearchBox :query="$route.params.query"/>
    <table class="songbook">
        <tr v-for="(hit, idx) in search($route.params.query)"
            @click="$router.push('/chapter/'+hit.item.chapterindex+'/song/'+hit.item.songindex)"
            v-bind:key="idx">
            <td class="index">
              {{ chapters[hit.item.chapterindex].songs[hit.item.songindex].index }}
            </td>
            <td class="name">
              {{ chapters[hit.item.chapterindex].songs[hit.item.songindex].title }}
              <span v-if="chapters[hit.item.chapterindex].songs[hit.item.songindex].msvg" class="sheetmusicicon">𝄞</span>
            </td>
        </tr>
        <tr class="nohits"><td>Inga sånger hittades.</td></tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { search } from '@/utils/search.ts' // @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import SearchBox from '@/components/SearchBox.vue'
import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'Search',
  components: {
    Navbar,
    SearchBox
  },
  methods: {
    search: search
  },
  data() {
    return {
      chapters: chapters
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
    display: none;
  }
}
</style>
