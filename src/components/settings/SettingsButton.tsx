// Used by the Settings dropdown to render a toggleable row.
import { useStore } from 'vuex'
import { BooleanSettings, key } from '@/store'
import { Slot } from 'vue';

export default function SettingsButtonComponent(
    { setting }: { setting: BooleanSettings },
    { slots }: { slots: { [name: string]: Slot } },
  ) {
  const store = useStore(key);
  const enabled = store.state.settings[setting] as boolean;
  const slot = slots.default && slots.default();
  return (
    <div onClick={() => store.commit('toggleSetting', setting)} class="setting">
      {slot}
      <div class={{ 'bg-highlight': enabled, 'border-highlight': true, 'toggle': true }}></div>
    </div>
  )
}
