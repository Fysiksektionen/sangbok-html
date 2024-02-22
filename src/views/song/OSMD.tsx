import './OSMD.scss'
import { defineComponent } from 'vue'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'
import mxllist from '@/../music/mxls.json'

/** Component that renders sheet music using OSMD from MXL. */
export default defineComponent({
    name: 'OSMD',
    props: { src: String },
    data() {
        return {
            isLoading: true,
            osmd: undefined as OpenSheetMusicDisplay | undefined,
            fileName: mxllist.find(fn => { return this.src && fn.indexOf(this.src) == 0 }),
            zoomLevel: 1,
        }
    },
    methods: {
        async zoom(factor: number) {
            if (this.osmd) {
                this.isLoading = true;
                this.osmd.zoom *= factor;
                requestIdleCallback(() => { this.osmd?.render(); this.isLoading = false; }, { timeout: 1000 })
            }
        }
    },
    mounted() {
        // TODO: Doe this in a more Vue-esque fashion, with proper (non-string) Refs and hooks.
        this.osmd = new OpenSheetMusicDisplay(this.$refs.container as any);
        this.osmd.setOptions({
            backend: "svg",
            drawTitle: true,
            drawingParameters: "default",
            drawMeasureNumbersOnlyAtSystemStart: true,
        });
        this.osmd.EngravingRules.PageTopMargin = 0;
        this.osmd.zoom = 1;
        this.osmd.load('/mxl/' + this.fileName).then(() => { { this.osmd?.render(); this.isLoading = false; } });
    },
    render() {
        return (
            <div class="component-sheet-music-renderer">
                {/* Zoom control buttons */}
                <div class="zoombuttoncontainer">
                    <button onClick={() => this.zoom(0.8)} class={{ button: true, disabled: this.osmd ? (this.osmd.zoom < 0.25) : true }}>&#128269;-</button>
                    <button onClick={() => this.zoom(1.25)}
                        class={{ button: true, disabled: this.osmd ? (this.osmd.zoom > 4) : true }}>&#128269;+</button>
                </div>

                {/* Loading message */}
                {this.isLoading &&<div><h2>Laddar...</h2></div>}

                {/* Main display */}
                <div ref="container" class="canvas"></div>
                
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
