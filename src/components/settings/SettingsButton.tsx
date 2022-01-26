// Used by the Settings dropdown to render a toggleable row.
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { BooleanSettings, key } from '@/store'

export default defineComponent({
  name: 'SettingsButton',
  props: {
    setting: {
      type: String,
      required: true,
    }
  },
  setup() {
    return { store: useStore(key) }
  },
  render() {
    const store = this.store;
    const setting = this.$props.setting as BooleanSettings;
    const enabled = store.state.settings[setting] as boolean;
    return (
      <div onClick={() => store.commit('toggleSetting', setting)} class="setting">
        <slot></slot>
        <div class="toggle border-highlight" v-bind:class={{'bg-highlight': enabled }}></div>
      </div>
    )
  }
})
