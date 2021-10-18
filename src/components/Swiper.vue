<!-- Component for handling swipes. -->
<template>
  <div class="component-swiper" v-touch:release="releaseHandler" v-touch:press="pressHandler" v-touch:drag="dragHandler"
    v-bind:style="onlyAllowZoomOut">
    <slot></slot>
    <transition name="swipe-right">
      <div class="swipe-indicator right bg-highlight" v-if="showSwipeIndicator.includes('right')"
        v-bind:class="{'disabled': showSwipeIndicator.includes('x')}">
        <img src="../assets/back.png" style="transform: scaleX(-1);" v-if="!showSwipeIndicator.includes('x')" />
        {{ showSwipeIndicator.includes('x') ? "⊘" : "" }}
      </div>
    </transition>
    <transition name="swipe-left">
      <div class="swipe-indicator left bg-highlight" v-if="showSwipeIndicator.includes('left')"
        v-bind:class="{'disabled': showSwipeIndicator.includes('x')}">
        <img src="../assets/back.png" v-if="!showSwipeIndicator.includes('x')" />
        {{ showSwipeIndicator.includes('x') ? "⊘" : "" }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import { SwipeIndicatorState, getCoordsFromEvent, onlyAllowZoomOut } from '@/utils/swipe.ts'

const SWIPE_TRESHOLD = 30

export default defineComponent({
  name: 'Swiper',
  props: {
    swipeHandler: Function,
    left: String, /* Actually 'allow' | 'disallow' | 'hide' */
    right: String,
    allowZoom: Boolean
  },
  data() {
    return {
      touchCoords: [undefined, undefined] as [number, number] | [undefined, undefined],
      showSwipeIndicator: 'none' as SwipeIndicatorState,
      onlyAllowZoomOut: this.$props.allowZoom ? {} : onlyAllowZoomOut()
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  // created() {console.log(this.$props)},
  methods: {
    releaseHandler() {
      this.$props.swipeHandler && this.$props.swipeHandler(this.showSwipeIndicator)
      this.showSwipeIndicator = 'none'
    },
    pressHandler(e: Event) { this.touchCoords = getCoordsFromEvent(e) },
    dragHandler(e: Event) {
      this.onlyAllowZoomOut = this.$props.allowZoom ? {} : onlyAllowZoomOut()
      if (['swipe', 'all'].indexOf(this.store.state.settings.touchAction) === -1 || window.visualViewport.scale > 1) {
        return
      }
      const [x, y] = getCoordsFromEvent(e)
      if (this.touchCoords[0] !== undefined && this.touchCoords[1] !== undefined && x !== undefined && y !== undefined) {
        // Absolute angle of touch path, relative to the vertical line.
        const phi = Math.abs(Math.atan2(this.touchCoords[0] - x, this.touchCoords[1] - y))
        if (Math.PI / 4 <= phi && phi <= 3 * Math.PI / 4) {
          if (this.touchCoords[0] - x > SWIPE_TRESHOLD) {
            this.showSwipeIndicator = (this.$props.right === 'disallow') ? 'xright' : ((this.$props.right === 'hide') ? 'none' : 'right')
            return
          } else if (this.touchCoords[0] - x < -SWIPE_TRESHOLD) {
            this.showSwipeIndicator = (this.$props.left === 'disallow') ? 'xleft' : ((this.$props.left === 'hide') ? 'none' : 'left')
            return
          }
        }
      }
      // The catch-all-other case
      this.showSwipeIndicator = 'none'
    }
  }
})
</script>

<style lang="scss">

  .component-swiper {
    width: 100%;
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    border: none;
    & div.swipe-indicator {
      transition: all 0.3s ease-out;
      position: fixed;
      top: 30vh;
      border-radius: 4cm;
      height: 4cm;
      width: 4cm;
      line-height: 4cm;
      opacity: 0.5;

      &.right {
        right: -3cm;
        padding-left: 1cm;
      }

      &.left {
        left: -3cm;
        padding-right: 1cm;
        text-align: right;
      }

      &>img {
        height: 1em;
        vertical-align: middle;
      }

      &.disabled {background-color: gray;}
  }

  /* TODO: Find a solution to this that does not involve !important. */
  & .swipe-right-enter-from,
  & .swipe-right-leave-to {
    right: -4cm !important;
    opacity: 0 !important;
  }

  & .swipe-left-enter-from,
  & .swipe-left-leave-to {
    left: -4cm !important;
    opacity: 0 !important;
  }
}
</style>
