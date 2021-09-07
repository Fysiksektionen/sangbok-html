<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/')"/>
  <div class="main">
    <h2>{{chapter.chapter}}</h2>
    <table class="songbook">
        <tr v-for="(song, idx) in chapter.songs"
            @click="$router.push('/chapter/'+$route.params.cid+'/song/'+idx)"
            v-bind:key="idx">
            <td class="index">
              {{ song.index }}
            </td>
            <td class="name">
              {{ song.title }}
            </td>
        </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue' // @ is an alias to /src
import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'ChapterView',
  components: {
    Navbar
  },
  data() {
    return {
      chapter: chapters[parseInt(this.$route.params.cid as string)]
    }
  }
})
</script>
