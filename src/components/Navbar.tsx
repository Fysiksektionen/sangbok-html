/* TODO: Import images with webpack. */
import './Navbar.scss'
import { defineComponent, Transition } from 'vue'
import Dropdown from '@/components/settings/Settings'

/** The top navbar. Closely tied with the Dropdown component (see Settings.tsx). */
export default defineComponent({
  name: 'Navbar',
  props: { hideBackButton: Boolean },
  components: { Dropdown },
  data() { return { showSettings: false } },
  render() {
    return (
      <>
        <div class="navbar">
          {
            !this.hideBackButton &&
            <div style="float: left;" onClick={() => this.$router.go(-1)}>
              <button><img src="img/back.png" alt="Gå tillbaka" /></button>
            </div>
          }
          <div class="title">Sångboken</div>
          <div style="float: right;" data-test="settingsButtonWrapper">
            {!this.showSettings && <button onClick={() => { this.showSettings = true }}><img src="img/settings.png" alt="Visa inställningar" /></button>}
            {this.showSettings && <button onClick={() => { this.showSettings = false }}><img src="img/x.png" alt="Dölj inställningar" /></button>}
          </div>
        </div>

        <Transition name="dropdown">
          {this.showSettings && <Dropdown style="transition: all 0.2s ease-out;" />}
        </Transition>
      </>
    )
  }
})
