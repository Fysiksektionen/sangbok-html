import './ABC.scss'
import { defineComponent } from 'vue'
import mxllist from '@/../music/abcs.json'
import { Abc } from 'abc2svg/abc2svg-1'


class Abc2svgCallbacks {
    abc_svg_output
    abc_error_output
    img_out
    errmsg
    read_file
    anno_start
    anno_stop
    get_abcmodel
    page_format
    constructor() {
        this.abc_svg_output = ''
        this.abc_error_output = ''
        this.img_out = (data: string) => { this.abc_svg_output += data }
        this.errmsg = (msg: string) => { this.abc_error_output += msg + '<br/>\n' }
        this.read_file = () => ''
        this.anno_start = () => { }
        this.anno_stop = () => { }
        this.get_abcmodel = () => { }
        this.page_format = true
    }
}

/** Component that renders sheet music from abc. Loosely based on https://github.com/rigobauer/react-abc2svg */
export default defineComponent({
    name: 'OSMD',
    props: { src: String },
    data() {
        return {
            isLoading: true,
            fileName: mxllist.find(fn => { return this.src && fn.indexOf(this.src) == 0 }),
            zoomLevel: 1,
            /** The raw abc data. */
            abc: '',
            /** The rendered svg data. */
            rawSvg: [] as string[],
            /** The rendered svg data URLs. */
            svgURL: [] as string[],
        }
    },
    methods: {
        async zoom(factor: number) {
            // if (this.osmd) {
            // this.isLoading = true;
            // this.osmd.zoom *= factor;
            // requestIdleCallback(() => { this.osmd?.render(); this.isLoading = false; }, { timeout: 1000 })
            // }
        },
        async fetchAbc() {
            this.abc = await (await (await fetch('/abc/' + this.fileName)).blob()).text()
            console.log("Fetched.")
        },
        async renderAbc() {
            const abcCallbacks = new Abc2svgCallbacks()
            const abc = new Abc(abcCallbacks)
            // See http://moinejf.free.fr/abcm2ps-doc/
            const options = ['%%vocalfont serif 13', '%%gchordfont * 9', '%%annotationfont serifItalic *', '%%fullsvg x']
            abc.tosvg('ABC NOTATION', options.join('\n') +'\n' + this.abc)
            this.rawSvg = abcCallbacks.abc_svg_output.replace(/^<div class="nobrk">/, '').replace(/<\/div>$/, '').split('</svg>').filter(s => s !== '').map(s => s + '</svg>')
            this.svgURL = this.rawSvg.map(s => URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' })))
            this.isLoading = false;
            // console.log(this.rawSvg)
            // console.log(this.svgURL)
        }
    },
    mounted() {
        this.fetchAbc().then(() => { this.renderAbc() })
    },
    render() {
        return (
            <div class="component-sheet-music-renderer">
                {/* Zoom control buttons */}
                <div class="zoombuttoncontainer">
                    {/* <button onClick={() => this.zoom(0.8)} class={{ button: true, disabled: this.osmd ? (this.osmd.zoom < 0.25) : true }}>&#128269;-</button> */}
                    {/* <button onClick={() => this.zoom(1.25)} class={{ button: true, disabled: this.osmd ? (this.osmd.zoom > 4) : true }}>&#128269;+</button> */}
                </div>

                {/* Loading message */}
                {this.isLoading && <div><h2>Laddar...</h2></div>}

                {/* Main display */}
                {this.svgURL.length>0 && <div class="svg-list">{this.svgURL.map(u => <img src={u}/>)}</div>}

                {/* Error messages */}
                {this.fileName === undefined &&
                    <div>
                        <h2>Fel</h2>
                        <p style="text-align: center;">
                            Inga noter hittades, trots att de borde finnas. Du borde skicka ett surt mail till webmaster eller sångbokens projektledare.
                        </p>
                    </div>}


                <p class="notice">Notvisaren är experimentell.</p>
            </div>
        )
    }
})
