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

import Modal from '@/components/Modal.vue'

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
    song () {
      return getSongFromRoute(this.$route)
    }
  },
  methods: {
    addToList(listIdx: number) {
      this.song && this.store.commit('addToList', { list: listIdx, index: this.song.index })
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
