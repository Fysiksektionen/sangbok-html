import './SheetMusicRenderer.scss'
import svglist from '@/assets/msvgs.json'
import { defineComponent } from 'vue'

function getZoomLevelFromFileName(filename: string) {
  return (filename.match(/-sf(\d(\.\d+)?)-/i) || ['', ''])[1]
}

/** @returns The available zoom-levels for this song. */
function getZoomLevels(source: string) {
  const curSongSvgs = svglist.filter(s => { return source && s.indexOf(source) > -1 })
  const zoomLevels = Array.from(new Set(curSongSvgs.map(getZoomLevelFromFileName)))
  return zoomLevels.sort()
}

/** @returns The images of the current song, for specified zoom-level. */
function getImagesForZoomLevel(source: string, zoomIdx: number): string[] {
  const curSongSvgs = svglist.filter(s => { return source && s.indexOf(source) > -1 })
  const curSongSvgsWithZoom = curSongSvgs.filter(s => getZoomLevelFromFileName(s) === getZoomLevels(source)[zoomIdx])

  // __webpack_public_path__ is undefined in our testing environment. This is a Goodhart-style fix to that.
  // TODO: find a way to define __webpack_public_path__ in the testing code instead.
  // eslint-disable-next-line
  const root = (typeof __webpack_public_path__ !== 'string') ? '' : __webpack_public_path__
  return curSongSvgsWithZoom.map(s => root + 'msvg/' + s)
}

/** Component that renders sheet music. */
export default defineComponent({
  name: 'SheetMusicRenderer',
  props: { src: String },
  data() {
    // The dot needs to be here, otherwise, songs like ζ1 may think it has ζ11 as sheet music.
    const src2 = this.src + (this.src?.endsWith('.') ? '' : '.')
    return {
      src2,
      isLoading: true,
      zoomIdx: Math.min(((window.matchMedia && window.matchMedia('only screen and (max-width: 760px)').matches)) ? 5 : 3, getZoomLevels(src2).length - 1)
    }
  },
  methods: {
  /**
   * Alters the zoom index by `z`. Generally, a positive `z` will increase the zoom by `z` levels, and decrease if `z` is negative.
   * @param z - the zoom index offset.
   */
    zoom(z: number) {
      this.zoomIdx += z
      this.zoomIdx = Math.max(0, Math.min(this.zoomIdx, getZoomLevels(this.src2).length - 1))
    }
  },
  render() {
    return (
      <div class="component-sheet-music-renderer">
        {/* Zoom control buttons */}
        <div class="zoombuttoncontainer">
          <button onClick={() => this.zoom(-1)} class={{ button: true, disabled: this.zoomIdx === 0 }}>&#128269;-</button>
          <button onClick={() => this.zoom(1)}
            class={{ button: true, disabled: this.zoomIdx === getZoomLevels(this.src2).length - 1 }}>&#128269;+</button>
        </div>

        {/* The svg images containing sheet music. Usually there will be only one (we had more previously). */}
        {getImagesForZoomLevel(this.src2, this.zoomIdx).map((img) =>
          <div>
            <img src={img} alt={this.isLoading ? 'Laddar...' : 'Noter'} onLoad={() => { this.isLoading = false }} />
          </div>)}

        {/* Error messages */}
        {getImagesForZoomLevel(this.src2, this.zoomIdx).length === 0 &&
        <div>
          <h2>Fel</h2>
          <p style="text-align: center;">
            Inga noter hittades, trots att de borde finnas. Du borde skicka ett surt mail till webmaster eller sångbokens projektledare.
          </p>
        </div>}

        {/* Loading message */}
        {this.isLoading &&
        <div>
          <h2>Laddar...</h2>
        </div>}

        <p class="notice">Notvisaren är experimentell.</p>
      </div>
    )
  }
})
