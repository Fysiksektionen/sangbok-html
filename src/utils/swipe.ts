/**
 * State for the swipe indicator. None means hidden, left means that the left SwipeIndicator is shown (user dragged finger to the right).
 * A prefix of x means that the SwipeIndicator is shown, but grayed-out with a "no entry" sign showing.
 */
export type SwipeIndicatorState = 'xleft' | 'left' | 'none' | 'right' | 'xright'

/**
 * A dictionary used to convert a SwipeIndicatorState to an index offset.
 * Maps right -> 1, left -> -1, other -> 0
 */
export const swipeIndicatorToOffset: {[key: string]: -1 | 0 | 1} = {
  right: 1, left: -1, none: 0, xleft: 0, xright: 0
}

/**
 * Accepts a TouchEvent (or MouseEvent if in development mode), and returns the clientX & clientY coordinates for the event.
 * If the event is of a non-allowed type, returns [undefined, undefined].
 * @param e TouchEvent (or MouseEvent in development mode)
 * @returns A list on the form [x, y] with event coordinates, or [undefind, undefined] if unsuccessful.
 */
export function getCoordsFromEvent(e: Event): [number, number] | [undefined, undefined] {
  if (e.constructor.name === 'TouchEvent') {
    const touch = (e as TouchEvent).touches[0]
    return ((e as TouchEvent).touches.length === 1) ? [touch.clientX, touch.clientY] : [undefined, undefined]
  } else if (process.env.NODE_ENV === 'development' && e.constructor.name === 'MouseEvent') { // We only accept MouseEvents as swipe events in development mode.
    return [(e as MouseEvent).clientX, (e as MouseEvent).clientY]
  }
  return [undefined, undefined]
}

/**
 * Returns a style object that enables all touch actions (even zooming) if the viewport is zoomed in.
 * If the viewport is at 100%, only allows scrolling in the y-direction.
 * @returns a style object
 */
export function onlyAllowZoomOut(): {'touchAction': string} | Record<string, never> {
  return { touchAction: (!window || !window.visualViewport || window.visualViewport.scale > 1) ? 'manipulation' : 'pan-y' }
}
