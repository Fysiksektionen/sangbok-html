// Modal visibility logic is handled by the parent component.

import { Slots, SetupContext } from 'vue'

// eslint-disable-next-line
export default function Modal({ }, { slots, attrs }: Omit<SetupContext, 'expose'>): JSX.Element {
  const slot = slots.default && slots.default()
  return (
    <div class="component-modal" {...attrs}>
      <div class="modal-box">
        {slot}
      </div>
    </div>
  )
}
