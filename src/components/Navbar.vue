<!-- The top navbar. Closely tied with the Dropdown component (see Settings.vue). -->
<template>
  <div class="navbar bg-orange">
    <div style="float: left;" v-if="!hideBackButton" @click="() => $router.go(-1)">
      <button><img src="../assets/back.png" alt="Go back" /></button>
    </div>
    <div class="title">Sångboken</div>
    <div style="float: right;">
      <button @click="showSettings=true" v-if="!showSettings"><img src="../assets/settings.png" alt="Show settings" /></button>
      <button @click="showSettings=false" v-if="showSettings"><img src="../assets/x.png" alt="Close settings" /></button>
    </div>
  </div>
  <transition name="dropdown">
    <Dropdown style="transition: all 0.2s ease-out;" v-if="showSettings"/>
  </transition>
</template>

<script lang="ts">
// Async-loading dropdown only saves about 1 KiB of entrypoint size. Its benefit is negligible.
import { defineComponent /* , defineAsyncComponent */ } from 'vue'
import Dropdown from '@/components/Settings.vue'

export default defineComponent({
  name: 'Navbar',
  props: ['hideBackButton'],
  components: {
    Dropdown: Dropdown
    // Dropdown: defineAsyncComponent(() => import(/* webpackChunkName: "dropdown", webpackPreload: true */ '@/components/Settings.vue'))
  },
  data () {
    return {
      showSettings: false
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown-enter-from, .dropdown-leave-to {/* See hard-coded style property to set transition speed. */
  /* TODO: Set dropdown speeds using classes. */
  transform: translateY(-100%);
  opacity: 0;
}

img {height: 1em;}

button {
    background-color: transparent;
    height: 100%;
    border: 0;
    padding: 0.8em 0.8em;
    &:active {background-color: rgba(255, 255, 255, 0.20);}
}

.navbar {
    position: sticky;
    width: 100%;
    top: 0;
    height: 2.3em;
    z-index: 100;
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

.settings {
    position: fixed;
    left: 0;
    right: 0;
    padding: 0.5em;
    padding-bottom: 0;
    background-color: #fff;
    font-family: 'EB Garamond', serif;
    font-size: 1.2em;
    box-shadow: 0 0 14px black;
    transition: top 0.3s ease-in-out;
    z-index: 9;

    & div{
        width: 100%;
        padding: 0.8em 0;
    }
}

.night .settings {
    color: #ddd;
    background-color: #222;
}
.settings .copy .checkmark {
    float: right;
    width: 0.8em;
    height: 0.8em;
    padding: 0;
    margin-right: 0.1em;
    color: #0E0;
}
</style>
