<!-- TODO: Ideally, we could do type-specifications, as to not allow songid to be anything but an int. -->
<!-- TODO: Perhaps use unicode instead of back.png. -->

<template>
  <div class="navbuttons">
    <div class="button" v-if="parseInt(songid) > 0"
      @click="$router.replace('/chapter/'+chapterPrefix+'/song/'+(parseInt(songid)-1))">
      <div>{{chapter.songs[parseInt(songid)-1].title}}</div>
      <div>
        <img src="../assets/back.png"/> &nbsp;
        {{chapter.songs[parseInt(songid)-1].index}}
      </div>
    </div>
    <div class="filler" v-if="parseInt(songid) == 0"></div>
    <div class="button" v-if="chapter.songs[parseInt(songid)+1]"
      @click="$router.replace('/chapter/'+chapterPrefix+'/song/'+(parseInt(songid)+1))">
      <div>{{chapter.songs[parseInt(songid)+1].title}}</div>
      <div>
        {{chapter.songs[parseInt(songid)+1].index}} &nbsp;
        <img src="../assets/back.png" style="transform: scaleX(-1);"/>
      </div>
    </div>
    <div class="filler" v-if="parseInt(songid) == chapter.songs.length-1"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import { chapters } from '@/utils/lyrics.ts'

export default defineComponent({
  name: 'Navbar',
  props: ['songid', 'chapter', 'chapterid'],
  computed: {
    chapterPrefix () {
      return (this.$props.chapterid === undefined) ? this.$props.chapter.prefix : this.$props.chapterid
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navbuttons {
    padding: 20px 0;
    text-align: center;

    &> div {
      display: inline-block;

      $navbutton-spacing: 12px;
      border-radius: $navbutton-spacing;
      margin: $navbutton-spacing;
      padding: $navbutton-spacing;
      width: calc(50% - 4 * #{$navbutton-spacing});

      &> div{
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &>img {height: 0.5em;}
      }
  }
}

div.filler {opacity: 0;}
</style>
