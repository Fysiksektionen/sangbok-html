import './Navbar.scss'
import { defineComponent, Transition } from 'vue'
import Dropdown from '@/components/settings/Settings'
import { RouteLocationNormalized } from 'vue-router'
import { getChapterFromRoute } from '@/lyrics'

import backImage from '@/assets/back.png'
import settingsImage from '@/assets/settings.png'
import crossImage from '@/assets/x.png'

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
  name: 'NavbarComponent',
  props: { hideBackButton: Boolean },
  components: { Dropdown },
  data() { return { showSettings: false } },
  methods: {
    goBack () {
      this.$router.push(getParentPath(this.$route))
    }
  },
  render() {
    return (
      <>
        <div class="navbar">
          <div style="float: left;">
            { !this.hideBackButton &&
              <button onClick={this.goBack} data-test="navbarBackButton"><img src={backImage} alt="Gå tillbaka"/></button> }
          </div>
          <div class="title"><a href="https://f.kth.se/sangbok#">Sångboken</a></div>
          <div style="float: right;" data-test="settingsButtonWrapper">
            {!this.showSettings && <button onClick={() => { this.showSettings = true }} data-test="navbarShowSettingsButton"><img src={settingsImage} alt="Visa inställningar" /></button>}
            {this.showSettings && <button onClick={() => { this.showSettings = false }} data-test="navbarHideSettingsButton"><img src={crossImage} alt="Dölj inställningar" /></button>}
          </div>
        </div>

        <Transition name="dropdown">
          {this.showSettings && <Dropdown style="transition: all 0.2s ease-out;" />}
        </Transition>
      </>
    )
  }
})
