export type SwipeIndicatorState = 'xleft' | 'left' | 'none' | 'right' | 'xright'

export function getCoordsFromEvent(e: Event): [number, number] | [undefined, undefined] {
  if (e.constructor.name === 'TouchEvent') {
    const touch = (e as TouchEvent).touches[0]
    return ((e as TouchEvent).touches.length === 1) ? [touch.clientX, touch.clientY] : [undefined, undefined]
  } else if (process.env.NODE_ENV === 'development' && e.constructor.name === 'MouseEvent') { // We only accept MouseEvents as swipe events in development mode.
    return [(e as MouseEvent).clientX, (e as MouseEvent).clientY]
  }
  return [undefined, undefined]
}

export function genericDragHandler(touchCoords: [number, number] | [undefined, undefined], [x, y]:[number, number] | [undefined, undefined]): SwipeIndicatorState {
  if (touchCoords[0] !== undefined && touchCoords[1] !== undefined && x !== undefined && y !== undefined) {
    // Absolute angle of touch path, relative to the vertical line.
    const phi = Math.abs(Math.atan2(touchCoords[0] - x, touchCoords[1] - y))
    if (Math.PI / 4 <= phi && phi <= 3 * Math.PI / 4) {
      if (touchCoords[0] - x > 30) {
        return 'right'
      } else if (touchCoords[0] - x < -30) {
        return 'left'
      }
    }
  }
  return 'none'
}
