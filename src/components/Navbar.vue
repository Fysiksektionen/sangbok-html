<!-- The top navbar. Closely tied with the Dropdown component (see Settings.vue). -->
<template>
  <div class="navbar">
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
body.night {@import '../themes/night.scss';@import './Navbar.scss';}
body.day {@import '../themes/day.scss';@import './Navbar.scss';}
body.galaxy {@import '../themes/galaxy.scss';@import './Navbar.scss';}
body.fancy {@import '../themes/fancy.scss';@import './Navbar.scss';}
body.halloween {@import '../themes/halloween.scss';@import './Navbar.scss';}

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
    font-family: 'EB Garamond', serif;
    font-size: 1.2em;
    transition: top 0.3s ease-in-out;
    z-index: 9;

    & div{
        width: 100%;
        padding: 0.8em 0;
    }
}

.settings .copy .checkmark {
    float: right;
    width: 0.8em;
    height: 0.8em;
    padding: 0;
    margin-right: 0.1em;
}
</style>
