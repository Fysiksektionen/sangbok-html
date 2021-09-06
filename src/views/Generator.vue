<template>
  <div class="generator">
    <h2>Sångbladsskaparen</h2>
    <p>Är ännu inte implementerad.</p>
    <button @click="go">Jag bryr mig inte. Visa mig ändå.</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getContentTeX } from '@/utils/export.ts'
import { chapters } from '@/utils/lyrics.ts'
import { mainTex, blad, logga } from '@/assets/tex/resources.ts'

export default defineComponent({
  name: 'GeneratorView',
  methods: {
    go () {
      const content = getContentTeX(chapters.map(c => c.songs).flat(), (this as any).$store.state.settings.download)

      var form = document.createElement('form')
      form.setAttribute('method', 'post')
      form.setAttribute('action', 'https://www.overleaf.com/docs')
      form.setAttribute('target', '_blank')

      const files: {[key: string]: string} = {
        'main.tex': mainTex,
        'blad.cls': blad,
        'logga.svg': logga,
        'content.tex': content
      }

      for (const [key, value] of Object.entries(files)) {
        const name = document.createElement('input')
        name.setAttribute('type', 'hidden')
        name.setAttribute('name', 'snip_name[]')
        name.setAttribute('value', key)

        const content = document.createElement('input')
        content.setAttribute('type', 'hidden')
        content.setAttribute('name', 'snip[]')
        content.setAttribute('value', value)

        form.appendChild(name)
        form.appendChild(content)
      }

      document.body.appendChild(form)
      form.submit()
    }
  }
})
</script>

<style scoped lang="scss">
.generator {
  width: 30%;
  right: 0;
}
</style>
