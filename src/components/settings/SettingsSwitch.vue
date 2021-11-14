<!-- Used by the Settings dropdown to render a multiple-choice row. -->
<template>
  <div class="setting">
    <slot></slot>
    <div class="switch">
      <span v-for="val, key in $props.values" v-bind:key="key"
        class="border-highlight"
        v-bind:class="{'bg-highlight': $store.state.settings[$props.setting]===key}"
        @click="$store.commit('setSetting', {key: $props.setting, value: key})">
        {{val}}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SettingsButton',
  props: {
    setting: String,
    values: Object
  }
})
</script>

<style scoped lang="scss">
  div.setting {padding: 0.8em 0;}

  div.switch {
      float: right;
      padding: 0;

      &>span {
      font-size: 0.8em;
        border-width: 1px 0px;
        border-style: solid;
        display: inline-block;
        padding: 0.2em 0.5em;
      }
      &>span:first-child {
        border-left-width: 1px;
        border-top-left-radius: 0.4em;
        border-bottom-left-radius: 0.4em;
      }
      &>span:last-child {
        border-right-width: 1px;
        border-top-right-radius: 0.4em;
        border-bottom-right-radius: 0.4em;
      }
  }
</style>
