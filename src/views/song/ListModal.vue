<!-- Modal for selecting which list to add a song to. -->
<template>
  <Modal>
    <header><h3>Lägg till i lista</h3></header>
    <div>
      <div v-for="list, idx in lists" v-bind:key="idx" class="row"
      @click="list.songs.indexOf(song.index) === -1 && $emit('close'); addToList(idx)"
        v-bind:class="{ 'disabled': list.songs.indexOf(song.index) !== -1 }">{{list.name}}</div>
    </div>
    <footer style="padding-top: 0.5em;">
      <div class="button button-2" @click="$store.commit('newList')">Ny lista</div>
      <div class="button button-2" @click="$emit('close')">Avbryt</div>
    </footer>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import Modal from '@/components/Modal'

import { getSongFromRoute } from '@/lyrics'

export default defineComponent({
  name: 'SongViewListModal',
  components: { Modal },
  setup() { return { store: useStore(key) } },
  data() {
    const store = useStore(key)
    return { lists: store.state.lists }
  },
  computed: {
    /**
     * @returns The Song object associated with the current route.
     */
    song () {
      return getSongFromRoute(this.$route)
    }
  },
  methods: {
    /**
     * Method that adds the current song to the list given by `listIdx`
     * @param listIdx the index of the list to add the song to.
     */
    addToList(listIdx: number) {
      (this as any).song && (this as any).store.commit('addToList', { list: listIdx, index: (this as any).song.index })
    }
  }
})
</script>

<style lang="scss" scoped>
  /* TODO: Make a general class for this. Don't scope it. */
  div.row {
    padding: 0.75em;
    text-align: center;

    &.disabled {
      opacity: 0.3;
      text-decoration: line-through;
    }
  }
</style>
