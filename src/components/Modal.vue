<template>
  <div class="component-modal">
    <div class="modal-box">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Settings',
  props: ['show'],
  // data () {},
  components: {}
})
</script>

<style lang="scss">
  .component-modal {
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(3px) saturate(80%);
    position: fixed;

    &>.modal-box {
      border-radius: 0.5em;
      background-color: rgba(0, 0, 0, 0);

      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      position: fixed;

      height: max-content;
      min-width: max(4cm, 30%);

      &>div {
        overflow-y: auto;
        max-height: 70vh;
        padding: 0.5em;

        &:last-child {
          border-bottom-left-radius: 0.5em;
          border-bottom-right-radius: 0.5em;
        }
      }

      & header {
        text-align: center;
        border-top-left-radius: 0.5em;
        border-top-right-radius: 0.5em;

        & h1,
        h2,
        h3,
        h4 {
          margin: 0;
        }
      }

      & footer {
        border-bottom-left-radius: 0.5em;
        border-bottom-right-radius: 0.5em;
      }
    }
  }
</style>
