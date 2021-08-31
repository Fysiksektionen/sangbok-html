<template>
  <Navbar/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from '@/components/Navbar.vue' // @ is an alias to /src

export default defineComponent({
  name: 'ChapterView',
  components: {
    Navbar
  }
})
</script>
