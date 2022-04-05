// Component that renders sheet music.
import './SheetMusicRenderer.scss'
import svglist from '@/assets/msvgs.json'

/** @returns The images of the current song, for specified zoom-level. */
function getImagesForZoomLevel(source: string, zoomIdx: number): string[] {
  const curSongSvgs = svglist.filter(s => { return source && s.indexOf(source) > -1 })
  const curSongSvgsWithZoom = curSongSvgs.filter(s => (s.match(/-sf(\d(\.\d+)?)-/i) || ['', ''])[1] === getZoomLevels(source)[zoomIdx])

  // __webpack_public_path__ is undefined in our testing environment. This is a Goodhart-style fix to that.
  // TODO: find a way to define __webpack_public_path__ in the testing code instead.
  // eslint-disable-next-line
  const root = (typeof __webpack_public_path__ !== 'string') ? '' : __webpack_public_path__
  return curSongSvgsWithZoom.map(s => root + 'msvg/' + s)
}

/** @returns The available zoom-levels for this song. */
function getZoomLevels(source: string) {
  const curSongSvgs = svglist.filter(s => { return source && s.indexOf(source) > -1 })
  const zoomLevels = Array.from(new Set(curSongSvgs.map(s => (s.match(/-sf(\d(\.\d+)?)-/i) || ['', ''])[1])))
  return zoomLevels.sort()
}

export default function SheetMusicRenderer({ src }: { src: string }): JSX.Element {
  let zoomIdx = Math.min(((window.matchMedia && window.matchMedia('only screen and (max-width: 760px)').matches)) ? 5 : 3, getZoomLevels(src).length - 1);
  let isLoading = true

  /**
   * Alters the zoom index by `z`. Generally, a positive `z` will increase the zoom by `z` levels, and decrease if `z` is negative.
   * @param z - the zoom index offset.
   */
  function zoom(z: number) {
    zoomIdx += z
    zoomIdx = Math.max(0, Math.min(zoomIdx, getZoomLevels(src).length - 1))
  }

  return (
    <div class="component-sheet-music-renderer">
      {/* Zoom control buttons */}
      <div class="zoombuttoncontainer">
        <button onClick={() => zoom(-1)} class={{ 'button': true, 'disabled': zoomIdx == 0 }}>&#128269;-</button>
        <button onClick={() => zoom(1)}
          class={{ 'button': true, 'disabled': zoomIdx == getZoomLevels(src).length - 1 }}>&#128269;+</button>
      </div>
      {/* The svg images containing sheet music. Usually there will be only one (we had more previously). */}
      {getImagesForZoomLevel(src, zoomIdx).map((img) => <div>
        <img src={img} alt={isLoading ? 'Laddar...' : 'Noter'} onLoad={() => isLoading = false} />
      </div>)}
      {/* Error messages */}
      {getImagesForZoomLevel(src, zoomIdx).length == 0 && <div>
        <h2>Fel</h2>
        <p style="text-align: center;">
          Inga noter hittades, trots att de borde finnas. Du borde skicka ett surt mail till webmaster eller sångbokens projektledare.
        </p>
      </div>}
      {/* Loading message */}
      {isLoading && <div>
        <h2>Laddar...</h2>
      </div>}
      <p class="notice">Notvisaren är experimentell.</p>
    </div>
  )
}