<!--TODO: Add Swiper-->

<template>
  <Swiper :swipeHandler="swipeHandler" :right="'hide'">
    <div class="main">
      <!-- <SearchBox/> -->
      <button class="button left" @click="newList" v-if="$store.state.settings.makelist">+</button>
      <h2>Listor</h2>
      <table class="songbook">
        <tr v-for="(list, idx) in lists" v-bind:key="idx">
          <td class="index" @click="$router.push('/list/'+idx)">
            {{ list.name }}
          </td>
          <td class="name" @click="$router.push('/list/'+idx)">
            {{ list.description }}
          </td>
          <td v-if="$store.state.settings.makelist" class="icon">
            <span class="operation up" v-bind:class="{ 'disabled': idx == 0 }" @click="$store.commit('moveList', { index: idx, direction: -1});">▲</span>
            <span class="operation down" v-bind:class="{ 'disabled': idx == lists.length-1 }" @click="$store.commit('moveList', { index: idx, direction: 1});">▼</span>
            <span class="operation delete" @click="deleteList(idx)">✖</span>
          </td>
        </tr>
      </table>
    </div>
  </Swiper>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Swiper from '@/components/Swiper.vue' // @ is an alias to /src
import { SwipeIndicatorState } from '@/utils/swipe.ts'
// import SearchBox from '@/components/SearchBox.vue'

export default defineComponent({
  name: 'ListsView',
  components: {
    // SearchBox
    Swiper
  },
  data() {
    return {
      lists: useStore(key).state.lists // .filter(l => l.songs.length > 0),
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    swipeHandler (direction: SwipeIndicatorState) { (direction === 'left') && this.$router.push('/') },
    newList() {
      this.store.commit('newList')
    },
    deleteList(idx: number) {
      this.store.commit('deleteList', idx)
    }
  }
})
</script>

<style scoped lang="scss">
  .button.left { /* TODO: Share with List.vue */
    float: left;
    position: absolute;
    min-width: 3em;
    margin-left: 12px;
  }

  div.main h2 {margin-bottom: 24px;}

  td.icon {
    /* TODO: Share with sheetmusicicon and List.vue */
    padding-right: 1em;
    text-align: right;
    /* Doesn't really work for tables */
    width: min-content;

    & > span {
      padding: 0.25em;
    }
  }
</style>
