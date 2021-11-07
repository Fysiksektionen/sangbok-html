<!-- The top navbar. Closely tied with the Dropdown component (see Settings.vue). -->
<template>
  <div class="navbar">
    <div style="float: left;" v-if="!hideBackButton" @click="() => $router.go(-1)">
      <button><img src="../assets/back.png" alt="Gå tillbaka" /></button>
    </div>
    <div class="title">Sångboken</div>
    <div style="float: right;" data-test="settingsButtonWrapper">
      <button @click="showSettings=true" v-if="!showSettings"><img src="../assets/settings.png" alt="Visa inställningar" /></button>
      <button @click="showSettings=false" v-if="showSettings"><img src="../assets/x.png" alt="Dölj inställningar" /></button>
    </div>
  </div>
  <transition name="dropdown">
    <Dropdown style="transition: all 0.2s ease-out;" v-if="showSettings"/>
  </transition>
</template>

<script lang="ts">
// Async-loading dropdown only saves about 1 KiB of entrypoint size. Its benefit is negligible.
import { defineComponent /* , defineAsyncComponent */ } from 'vue'
import Dropdown from '@/components/settings/Settings.vue'

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
<style lang="scss">
.dropdown-enter-from, .dropdown-leave-to {/* See hard-coded style property to set transition speed. */
    /* TODO: Set dropdown speeds using classes. */
    transform: translateY(-100%);
    opacity: 0;
  }

.navbar {
      position: sticky;
      width: 100%;
      top: 0;
      height: 2.3em;
      z-index: 100;

  & img {height: 1em;}

  & button {
      background-color: transparent;
      height: 100%;
      border: 0;
      padding: 0.8em 0.8em;
  }

  & .title {
      font-family: "Lato", sans-serif;
      position: absolute;
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 1.1em;
      padding-top: 0.4em;
      z-index: -1;
  }
}
</style>
