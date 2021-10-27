<!-- Main chapter list view-->

<template>
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
        <tr @click="$router.push('/list/')" v-if="$store.getters.hasLists || $store.state.settings.makelist"><td class="index">♥</td><td class="name">Egna listor</td></tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { onlyAllowZoomOut } from '@/utils/swipe' // @ is an alias to /src
import { greekPrefix2latin } from '@/utils/other'
import SearchBox from '@/components/SearchBox.vue'
import { chapters } from '@/lyrics'

export default defineComponent({
  name: 'ChaptersView',
  components: {
    SearchBox
  },
  data() {
    return {
      chapters: chapters,
      onlyAllowZoomOut: onlyAllowZoomOut()
    }
  },
  methods: {
    dragHandler () { this.onlyAllowZoomOut = onlyAllowZoomOut() },
    greek2latin: greekPrefix2latin
  }
})
</script>
