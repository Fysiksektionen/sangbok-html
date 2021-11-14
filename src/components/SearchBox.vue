<template>
  <form @submit="search" class="component-search">
    <input type="search" v-model="query2" placeholder="Sök i sångboken" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// query is a parameter setting the default value of the input box.
// Internally, this component uses query2

export default defineComponent({
  name: 'SearchBox',
  props: { query: String },
  data () {
    return {
      query2: this.$props.query || ''
    }
  },
  methods: {
    search (evt: Event) {
      evt.preventDefault()
      if (this !== undefined) {
        if (this.$route.name === 'Search') {
          // Replace the history entry if we stay on the search page.
          this.$router.replace('/search/' + this.query2)
        } else {
          // If we come from somewhere else, we push a new history item.
          this.$router.push('/search/' + this.query2)
        }
      }
    }
  }
})
</script>

<!-- Add "scoped" limits CSS to this component only -->
<style scoped lang="scss">
form {width: 100%; text-align: center;}

input[type=search] {
        margin: 1.62em 0;
        width: 85%;
        border: 0;
        height: 1.8em;
        border-radius: 0.3em;
        padding-left: 0.5em !important;
        padding-right: 0.5em !important;
    }
</style>
