<template>
  <div @click="$store.commit('toggleSetting', $props.setting)" class="setting">
    <slot></slot>
    <div class="toggle border-orange" v-bind:class="{'bg-orange': $store.state.settings[$props.setting]}"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SettingsButton',
  props: ['setting', 'name']
})
</script>

<style scoped lang="css">
  .toggle {
      float: right;
      width: 0.8em;
      height: 0.8em;
      border-width: 1px;
      border-style: solid;
      border-radius: 0.4em;
      margin-top: 0.3em;
      padding: 0;
  }
  div.setting {padding: 0.8em 0;}
</style>
