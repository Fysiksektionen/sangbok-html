import { useStore } from 'vuex'
import { BooleanSettings, key } from '@/store'
import { Slot } from 'vue'

/** A row with a toggle. Used by the settings dropdown. */
export default function SettingsButtonComponent(
  { setting }: { setting: BooleanSettings },
  { slots, attrs }: { slots: { [name: string]: Slot }, attrs: { [name: string]: string } }
): JSX.Element {
  const store = useStore(key)
  const slot = slots.default && slots.default()

  const isEnabled = store.state.settings[setting] as boolean

  return (
    <div onClick={() => store.commit('toggleSetting', setting)} class="setting" {...attrs}>
      {slot}
      <div class={{ 'bg-highlight': isEnabled, 'border-highlight': true, toggle: true }}></div>
    </div>
  )
}
