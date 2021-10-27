<template>
  <form @submit="search" class="component-search">
    <input type="search" v-model="query2" placeholder="Sök i sångboken" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

export default defineComponent({
  name: 'SearchBox',
  props: ['query'],
  data () {
    return {
      query2: this.$props.query || ''
    }
  },
  setup () {
    return { store: useStore(key) }
  },
  methods: {
    search (evt: Event) {
      evt.preventDefault()
      if (this !== undefined) {
        if (this.$route.name === 'Home') {
          this.$router.push('/search/' + this.query2)
        } else {
          this.$router.replace('/search/' + this.query2)
        }
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
form {width: 100%; text-align: center;}

input[type=search] {
        margin: 1.62em 0;
        width: 85%;
        /*border: 1px solid #aaa;*/
        border: 0;
        height: 1.8em;
        border-radius: 0.3em;
        padding-left: 0.5em !important;
        padding-right: 0.5em !important;
    }
</style>
