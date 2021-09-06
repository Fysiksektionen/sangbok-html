<!-- TODO: Ideally, we could do type-specifications, as to not allow songid to be anything but an int. -->
<!-- TODO: Perhaps use unicode instead of back.png. -->

<template>
  <div class="navbuttons">
    <div v-if="parseInt(songid) > 0"
      @click="$router.push('/chapter/'+chapterid+'/song/'+(parseInt(songid)-1))">
      <div>{{$store.state.lyrics.chapters[chapterid].songs[parseInt(songid)-1].title}}</div>
      <div>
        <img src="../assets/back.png"/> &nbsp;
        {{$store.state.lyrics.indexes[chapterid][parseInt(songid)-1]}}
      </div>
    </div>
    <div v-if="parseInt(songid) == 0" style="opacity: 0;"><!--Filler div.--></div>
    <div v-if="$store.state.lyrics.chapters[chapterid].songs[parseInt(songid)+1]"
      @click="$router.push('/chapter/'+chapterid+'/song/'+(parseInt(songid)+1))">
      <div>{{$store.state.lyrics.chapters[chapterid].songs[parseInt(songid)+1].title}}</div>
      <div>
        {{$store.state.lyrics.indexes[chapterid][parseInt(songid)+1]}} &nbsp;
        <img src="../assets/back.png" style="transform: scaleX(-1);"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Navbar',
  props: ['songid', 'chapterid']
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navbuttons {
    padding: 20px 0;
    text-align: center;

    &> div {
      display: inline-block;
      background-color: rgba(128, 128, 128, 0.10);

      $navbutton-spacing: 12px;
      border-radius: $navbutton-spacing;
      margin: $navbutton-spacing;
      padding: $navbutton-spacing;
      width: calc(50% - 4 * #{$navbutton-spacing});

      &:active {background-color: rgba(128, 128, 128, 0.30);}

      &> div{
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &>img {height: 0.5em;}
      }
  }
}
</style>
