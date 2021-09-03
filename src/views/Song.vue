<!-- View to list all songs in a chapter. -->

<template>
  <Navbar :parent="() => $router.push('/chapter/'+$route.params.chapterId)"/>
    <div class="lyrics"
    v-for="(song, i) in [$store.state.lyrics.chapters[$route.params.chapterId].songs[$route.params.songId]]"
    v-bind:key="i">
      <h2>{{song.title}}</h2>
      <div v-if="song.melody" class="melody" v-html="toHTML(song.melody)"></div>
      <div class="textcontainer" v-html="toHTML(song.text)"></div>
      <div v-if="song.author" class="author" v-html="toHTML(song.author)"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue' // @ is an alias to /src

export default defineComponent({
  name: 'ChapterView',
  components: {
    Navbar
  },
  methods: {
    toHTML (text: string):string {
      return text.replace(/</gm, "&lt;").replace(/>/gm, "&gt;").replace(/\n/igm, '<br />')
    }
  }
})
</script>

<style scoped lang="css">
.lyrics {
  font-family: 'EB Garamond', serif;
}

div.lyrics {
  margin-left: 1%;
  margin-right: 1%;
}

h2 {
    text-align: center;
    color: #333;
    margin: 0.75em 24px;
    padding: 0;
    padding-top: 0.75em;
}

.night .lyrics, .night h2 {
    color: #ddd;
}

.lyrics .melody {
    text-align: center;
    font-style: italic;
    margin-bottom: 12px;
    padding-left: 24px;
    padding-right: 24px;
}
.textcontainer {
    text-align: left;
    display: inline-block;
    padding: 0 24px 12px;
    font-size: 1.05em;
    line-height: 1.25em;
}

.author {
    text-align: right;
    font-style: italic;
    padding-right: 24px;
    padding-left: 24px;
}
</style>
