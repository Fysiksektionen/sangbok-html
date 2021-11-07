<!-- Component for handling swipes. -->
<template>
  <div class="component-swiper" v-touch:release="releaseHandler" v-touch:press="pressHandler" v-touch:drag="dragHandler"
    v-bind:style="onlyAllowZoomOut">

    <!-- Subcomponent injection -->
    <slot></slot>

    <!-- Swipe indicators -->
    <transition name="swipe-right">
      <div class="swipe-indicator right bg-highlight" v-if="showSwipeIndicator.includes('right')"
        v-bind:class="{'disabled': showSwipeIndicator.includes('x')}">
        <img src="@/assets/back.png" style="transform: scaleX(-1);" v-if="!showSwipeIndicator.includes('x')" />
        {{ showSwipeIndicator.includes('x') ? "⊘" : "" }}
      </div>
    </transition>

    <transition name="swipe-left">
      <div class="swipe-indicator left bg-highlight" v-if="showSwipeIndicator.includes('left')"
        v-bind:class="{'disabled': showSwipeIndicator.includes('x')}">
        <img src="@/assets/back.png" v-if="!showSwipeIndicator.includes('x')" />
        {{ showSwipeIndicator.includes('x') ? "⊘" : "" }}
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
// TODO: Add docs.
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import { SwipeIndicatorState, getCoordsFromEvent, onlyAllowZoomOut } from '@/utils/swipe'

// The treshold, in pixels, for how far the user has to draw their for it to be considered a swipe.
const SWIPE_TRESHOLD = 45
const SWIPE_RESET_TRESHOLD = 15
const SWIPE_ANGLE = 36 // Degrees

export default defineComponent({
  name: 'Swiper',
  props: {
    swipeHandler: Function,
    left: String, // Actually 'allow' | 'disallow' | 'hide', but Vue doesn't validate things that closely
    right: String,
    allowZoom: Boolean
  },
  data() {
    return {
      touchCoords: [[undefined, undefined, 'none']] as ([number, number, SwipeIndicatorState] | [undefined, undefined, SwipeIndicatorState])[],
      onlyAllowZoomOut: this.$props.allowZoom ? {} : onlyAllowZoomOut()
    }
  },
  computed: {
    showSwipeIndicator() {
      return (this.touchCoords.length === 0) ? 'none' : this.touchCoords[this.touchCoords.length - 1][2] as SwipeIndicatorState
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  methods: {
    releaseHandler() {
      this.$props.swipeHandler && this.$props.swipeHandler(this.showSwipeIndicator)
      this.touchCoords = []
    },
    pressHandler(e: Event) {
      this.touchCoords = [[...getCoordsFromEvent(e), 'none' as SwipeIndicatorState]]
    },
    dragHandler(e: Event) {
      this.onlyAllowZoomOut = this.$props.allowZoom ? {} : onlyAllowZoomOut()

      // If we have swipe disabled, or are zoomed in, don't enable swipes.
      if (['swipe', 'all'].indexOf(this.store.state.settings.touchAction) === -1 || window.visualViewport.scale > 1) {
        return
      }

      /*
         * this.touchCoords is a trace of drag-points and their respective associated state.
         * This loop goes back from recent drag-points to not-so-recent drag points, and looks at different criterion for changing the states.
         * If the most recent state is none, we look for a point more than SWIPE_TRESHOLD pixels away from our current point in order to trigger a swipe.
         * If the most recent state is a swipe, we look back at the last point and checks if it was further away than the SWIPE_RESET_TRESHOLD.
         * This is not perfect, but it works rather ok as long as the drag-event frequency is sufficiently low.
         */
      const [x, y] = getCoordsFromEvent(e)
      for (let i = this.touchCoords.length - 1; i >= 0; i--) {
        const coords = this.touchCoords[i]

        if (coords[0] !== undefined && coords[1] !== undefined && x !== undefined && y !== undefined) {
          // Absolute angle of touch path, relative to the vertical line.
          const phi = Math.abs(Math.atan2(coords[0] - x, coords[1] - y))

          if (Math.PI/180*(90 - SWIPE_ANGLE/2) < phi && phi < Math.PI/180*(90 + SWIPE_ANGLE/2)) {
            if (coords[2] === 'none') {
              if (coords[0] - x > SWIPE_TRESHOLD) {
                const swipeIndicator = (this.$props.right === 'disallow') ? 'xright' : ((this.$props.right === 'hide') ? 'none' : 'right')
                this.touchCoords.push([x, y, swipeIndicator])
                return
              } else if (coords[0] - x < -SWIPE_TRESHOLD) {
                const swipeIndicator = (this.$props.left === 'disallow') ? 'xleft' : ((this.$props.left === 'hide') ? 'none' : 'left')
                this.touchCoords.push([x, y, swipeIndicator])
                return
              }
            } else if (coords[2].endsWith('right') && coords[0] - x < -SWIPE_RESET_TRESHOLD) {
              this.touchCoords.push([x, y, 'none'])
              return
            } else if (coords[2].endsWith('left') && coords[0] - x > SWIPE_RESET_TRESHOLD) {
              this.touchCoords.push([x, y, 'none'])
              return
            }
          }
        }
      }

      // The catch-all-other case
      this.touchCoords.push([...getCoordsFromEvent(e), 'none' as SwipeIndicatorState])
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

      &.disabled {
        background-color: gray;
      }
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
