// Modal visibility logic is handled by the parent component.

import { Slots } from 'vue'

export default function Modal(_: any, { slots }: { slots: Slots }): JSX.Element {
  const slot = slots.default && slots.default()
  return (
    <div class="component-modal">
      <div class="modal-box">
        {slot}
      </div>
    </div>
  )
}
