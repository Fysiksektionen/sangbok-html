/* TODO: Import images with webpack. */
import './Navbar.scss'
import { defineComponent, Transition } from 'vue'
import Dropdown from '@/components/settings/Settings'
import { RouteLocationNormalized } from 'vue-router'
import { getChapterFromRoute } from '@/lyrics'

/** Returns the path of the parent page. */
function getParentPath(route: RouteLocationNormalized): string {
  const rn: string = route.name ? route.name.toString() : ''

  if (rn.startsWith('Song')) {
    const chapter = getChapterFromRoute(route)
    return chapter ? chapter.path : '/'
  } else if (rn === 'List' || rn === 'AddList') {
    // Actually one is never supposed to be stuck on the AddList view, but we have it here for good measure anyway.
    return '/list/'
  }
  // else if (rn.startsWith('Chapter') || rn === 'Search' || rn === 'Lists')
  return '/'
}

/** The top navbar. Closely tied with the Dropdown component (see Settings.tsx). */
export default defineComponent({
  name: 'Navbar',
  props: { hideBackButton: Boolean },
  components: { Dropdown },
  data() { return { showSettings: false } },
  methods: {
    goBack () {
      if (history.state.back === null) {
        // The back button in the Navbar should never leave the sångbok page. (See issue #29)
        // Hence if we got here directly, we will compute the path to go to instead of using history to go back.
        this.$router.push(getParentPath(this.$route))
      } else {
        this.$router.go(-1)
      }
    }
  },
  render() {
    return (
      <>
        <div class="navbar">
          {
            !this.hideBackButton &&
            <div style="float: left;" onClick={this.goBack} data-test="navbarBackButton">
              <button><img src="img/back.png" alt="Gå tillbaka" /></button>
            </div>
          }
          <div class="title">Sångboken</div>
          <div style="float: right;" data-test="settingsButtonWrapper">
            {!this.showSettings && <button onClick={() => { this.showSettings = true }} data-test="navbarShowSettingsButton"><img src="img/settings.png" alt="Visa inställningar" /></button>}
            {this.showSettings && <button onClick={() => { this.showSettings = false }} data-test="navbarHideSettingsButton"><img src="img/x.png" alt="Dölj inställningar" /></button>}
          </div>
        </div>

        <Transition name="dropdown">
          {this.showSettings && <Dropdown style="transition: all 0.2s ease-out;" />}
        </Transition>
      </>
    )
  }
})
