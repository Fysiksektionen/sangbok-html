// Used by the Settings dropdown to render a multiple-choice row.

import { Slot } from 'vue'
import { useStore } from 'vuex'
import { key, MultipleStateSettings } from '@/store'

export default function SettingsSwitch(
  { setting, values }: { setting: MultipleStateSettings, values: {[key: string]: string} },
  { slots }: { slots: { [name: string]: Slot } }
): JSX.Element {
  const store = useStore(key)
  const slot = slots.default && slots.default()
  return (
    <div class="component-settings-switch setting">
      {slot}
      <div class="switch">{ Object.keys(values).map((key) =>
        <span
          class={{ 'border-highlight': true, 'bg-highlight': (store.state.settings[setting]) === key }}
          onClick={() => store.commit('setSetting', { key: setting, value: key })}>
          {values[key]}
        </span>
      )}
      </div>
    </div>
  )
}
// export default defineComponent({
//   name: 'SettingsButton',
//   props: {
//     setting: String,
//     values: Object
//   }
// })
