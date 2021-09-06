<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/')"/>
  <div class="main">
    <h2>{{$store.state.lyrics.chapters[$route.params.id].chapter}}</h2>
    <table class="songbook">
        <tr v-for="(song, idx) in $store.state.lyrics.chapters[$route.params.id].songs"
            @click="$router.push('/chapter/'+$route.params.id+'/song/'+idx)"
            v-bind:key="idx">
            <td class="index">
              {{ $store.state.lyrics.indexes[$route.params.id][idx]}}
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

export default defineComponent({
  name: 'ChapterView',
  components: {
    Navbar
  }
})
</script>
