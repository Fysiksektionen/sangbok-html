// Component for handling swipes.

import './Swiper.scss'
import backImage from '@/assets/back.png'

import { Transition, h, withDirectives, resolveDirective, Directive, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

import { SwipeIndicatorState, getCoordsFromEvent, onlyAllowZoomOut } from '@/utils/swipe'

// The treshold, in pixels, for how far the user has to draw their for it to be considered a swipe.
const SWIPE_TRESHOLD = 45
const SWIPE_RESET_TRESHOLD = 15
const SWIPE_ANGLE = 36 // Degrees

type TouchCoord = [number, number, SwipeIndicatorState] | [undefined, undefined, SwipeIndicatorState]

/** A content container supporting swipes, handled by
 * @param swipeHandler - Handle swipe events. Signature: (s: SwipeIndicatorState): void
 * @param left - 'allow' or 'disallow' or 'hide'. Controls the appearance of the swipe indicator.
 * @param right - Equivalent to left, but for the right side.
 * @param allowZoom - Wether to allow zoom or not.
 */
export default defineComponent({
  name: 'SwiperWrapper',
  props: {
    swipeHandler: Function,
    left: String, // Actually 'allow' | 'disallow' | 'hide', but Vue doesn't validate things that closely
    right: String,
    allowZoom: Boolean
  },
  data() {
    return {
      /** A list containing recent touch coordinates, as well as the SwipeIndicatorState at that point. */
      touchCoords: [[undefined, undefined, 'none']] as TouchCoord[],
      /** A style-object, which allows zooming, only if we are zoomed in. See also dragHandler.  */
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
      // Let swipehandler decide what to do, if it's defined, and reset the touchCoords list.
      this.$props.swipeHandler && this.$props.swipeHandler(this.showSwipeIndicator)
      this.touchCoords = []
    },
    pressHandler(e: Event) {
      // Reset the touchCoords list and add the starting point.
      this.touchCoords = [[...getCoordsFromEvent(e), 'none' as SwipeIndicatorState]]
    },
    dragHandler(e: Event) {
      // if this.$props.allowZoom, set the touch-actions to only allow zoom if we are zoomed in.
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

          if (Math.PI / 180 * (90 - SWIPE_ANGLE / 2) < phi && phi < Math.PI / 180 * (90 + SWIPE_ANGLE / 2)) {
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
  },
  render() {
    const slot = this.$slots.default && this.$slots.default()

    // TODO: Ideally we would use something like:
    // import Vue3TouchEvents from 'vue3-touch-events'
    // instead. (Or at least catch undefined-errors here.)
    const touch = resolveDirective('touch') as Directive

    // TODO: Import images via
    return withDirectives(
      h('div', { class: 'component-swiper', style: this.onlyAllowZoomOut }, (
        <>
          {/* <!-- Subcomponent injection --> */}
          {slot}

          {/* <!-- Swipe indicators --> */}
          <Transition name="swipe-right">
            {this.showSwipeIndicator.includes('right') &&
              <div class={{ 'swipe-indicator': true, right: true, 'bg-highlight': true, disabled: this.showSwipeIndicator.includes('x') }}>
                {!this.showSwipeIndicator.includes('x') && <img src={backImage} style="transform: scaleX(-1);" />}
                {this.showSwipeIndicator.includes('x') ? '⊘' : ''}
              </div>}
          </Transition>
          <Transition name="swipe-left">
            {this.showSwipeIndicator.includes('left') &&
              <div class={{ 'swipe-indicator': true, left: true, 'bg-highlight': true, disabled: this.showSwipeIndicator.includes('x') }}>
                {!this.showSwipeIndicator.includes('x') && <img src={backImage} />}
                {this.showSwipeIndicator.includes('x') ? '⊘' : ''}
              </div>}
          </Transition>
        </>
      )),
      [[touch, this.dragHandler, 'drag'],
        [touch, this.pressHandler, 'press'],
        [touch, this.releaseHandler, 'release']
      ])
  }
})
