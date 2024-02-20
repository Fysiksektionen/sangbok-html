import { expect, test, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App'
import svglist from '@/assets/msvgs.json'

test('Sheet music view', async () => {
  await router.push('/')
  await router.isReady()
  const sheetMusicIndexes = [...new Set(svglist.map(s => s.split('.')[0]))]

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  // Make sure sheetmusic is enabled
  store.commit('toggleSettingTo', { key: 'sheetmusic', value: true })

  for (const index of sheetMusicIndexes) {
    await router.push('/song/' + index)
    await flushPromises()

    await wrapper.find('button.musicbutton').trigger('click')
    await vi.dynamicImportSettled() // Since this may be the first time we load the SheetMusicRenderer component, await imports.
    await flushPromises()

    expect(wrapper.find('.component-sheet-music-renderer').exists()).toBe(true)
    await wrapper.find('button.musicbutton').trigger('click')
    expect(wrapper.find('.component-sheet-music-renderer').exists()).toBe(false)
  }
})

// TODO: Test the zoom buttons
