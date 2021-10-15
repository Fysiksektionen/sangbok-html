<!-- Main chapter list view-->

<template>
  <div class="main" v-touch:drag="dragHandler" v-bind:style="onlyAllowZoomOut">
    <SearchBox/>
    <table class="songbook">
        <tr v-for="(list, idx) in lists"
            @click="$router.push('/list/'+idx)"
            v-bind:key="idx">
            <td class="index">
                {{ idx + 1 }}. {{ list.name }}
            </td>
            <td class="name">
                {{ list.description }}
            </td>
        </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import { onlyAllowZoomOut } from '@/utils/swipe.ts' // @ is an alias to /src
import { greekPrefix2latin } from '@/utils/other'
import SearchBox from '@/components/SearchBox.vue'

export default defineComponent({
  name: 'ListsView',
  components: {
    SearchBox
  },
  data() {
    return {
      lists: useStore(key).state.lists.filter(l => l.songs.length > 0),
      onlyAllowZoomOut: onlyAllowZoomOut()
    }
  },
  created() {
    return { store: useStore(key) }
  },
  methods: {
    dragHandler () { this.onlyAllowZoomOut = onlyAllowZoomOut() },
    greek2latin: greekPrefix2latin
  }
})
</script>
