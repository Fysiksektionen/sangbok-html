<!--TODO: Make a NavbarButton component. -->

<template>
  <div class="navbar">
    <div style="float: left;">
      <button><img src="../assets/back.png" alt="back" /></button>
    </div>
    <div class="title">
        Sångboken
    </div>
    <div style="float: right;">
      <button @click="showSettings=true" v-if="!showSettings"><img src="../assets/settings.png" alt="settings" /></button>
      <button @click="showSettings=false" v-if="showSettings"><img src="../assets/x.png" alt="close" /></button>
    </div>
  </div>
  <Dropdown v-if="showSettings"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Dropdown from '@/components/Dropdown.vue'

export default defineComponent({
  name: 'Navbar',
  components: {
    Dropdown
  },
  data () {
    return {
      showSettings: false,
      store: this.$store
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {height: 1em;}

button {
    background-color: transparent;
    height: 100%;
    border: 0;
    padding: 0.8em 0.8em;
}

button:active {
    background-color: rgba(255, 255, 255, 0.20);
}

.navbar {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: #F60;
    height: 2.3em;
    z-index: 10;
}

.title {
    font-family: "Lato", sans-serif;
    position: absolute;
    width: 100%;
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 1.1em;
    padding-top: 0.4em;
    z-index: -1;
}
</style>
