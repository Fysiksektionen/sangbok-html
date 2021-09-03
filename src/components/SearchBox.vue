<template>
  <form @submit="search">
    <input type="search" v-model="query2" placeholder="Sök i sångboken" />
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SearchBox',
    props: ['query'],
    data () {
        return {
            store: this.$store,
            query2: this.$props.query || ''
        }
    },
    methods: {
        search (evt: Event) {
            evt.preventDefault()
            if (this !== undefined) {
                this.$router.push('/search/' + this.query2)
            }
        }
    }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
form {width: 100%; text-align: center;}

input[type=search] {
        margin: 1.62em 0;
        width: 85%;
        /*border: 1px solid #aaa;*/
        border: 0;
        height: 1.8em;
        background-color: #f0f0f0;
        border-radius: 0.3em;
        padding-left: 0.5em !important;
        padding-right: 0.5em !important;
    }

.night input[type="search"] {
    color: white;
    background-color: #444;
}
</style>
