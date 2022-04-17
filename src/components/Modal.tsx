import { HTMLAttributes, SetupContext } from 'vue'

/**
 * Puts the given nodes (using a slot) in a modal box.
 * Modal visibility logic and transitions are to be handled by the parent component.
 */
export default function Modal(props: HTMLAttributes, { slots, attrs }: Omit<SetupContext, 'expose'>): JSX.Element {
  const slot = slots.default && slots.default()
  return (
    <div class="component-modal" {...props} {...attrs}>
      <div class="modal-box">
        {slot}
      </div>
    </div>
  )
}
