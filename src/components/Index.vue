<template>
  <img v-if="image" v-bind:src="image" class="inline" />
  {{ text }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const INDEX_MAP: { [key: string]: string } = {
  '✻': 'img/ths_emblem_filled_black.svg'
}

type ParsedIndex = {
  key?: string,
  image?: string,
  text: string
}

// TODO: This thing is called twice, but at the same time, we need to have our props in computed, to prevent indices from being stuck.
/**
 * Takes an index, and splits it into an image part and a suffix string part.
 * @param index Index as as a string
 * @returns A ParsedIndex object, containing the index, split into an image and a string part, as well as the matched key.
 */
function computeData(index: string): ParsedIndex {
  for (const key of Object.keys(INDEX_MAP)) {
    if (index.startsWith(key)) {
      return { key: key, image: INDEX_MAP[key], text: index.slice(key.length) }
    }
  }
  return { text: index }
}

export default defineComponent({
  name: 'Index',
  props: ['index'],
  computed: {
    text() { return computeData(this.$props.index).text },
    image() { return computeData(this.$props.index).image }
  }
})
</script>
