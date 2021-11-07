<template>
  <img v-if="image" v-bind:src="image" class="inline" />
  {{ text }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const INDEX_MAP: { [key: string]: string } = {
  '✻': 'img/ths_emblem_filled_black.svg'
}

// TODO: This thing is called twice, but at the same time, we need to have our props in computed, to prevent indices from being stuck.
function computeData(index: string) {
  const keys = Object.keys(INDEX_MAP)
  for (const key of keys) {
    if (index.startsWith(key)) {
      return {
        key: key,
        image: INDEX_MAP[key],
        text: index.slice(key.length)
      }
    }
  }
  return {
    key: undefined,
    image: undefined,
    text: index
  }
}

export default defineComponent({
  name: 'Settings',
  props: ['index'],
  computed: {
    text() { return computeData(this.$props.index).text },
    image() { return computeData(this.$props.index).image }
  }
})
</script>

<style lang="scss">
</style>
