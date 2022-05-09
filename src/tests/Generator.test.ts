import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App'
import { escapeAll } from '@/utils/export/escapes'

test('Generator navigation', async () => {
  router.push('/')
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  await wrapper.find('[data-test="settingsButtonWrapper"] > button').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('sångblad')

  await wrapper.find('.component-settings [data-test="generatorSettingsButton"] > div').trigger('click')
  await flushPromises()

  await wrapper.find('[data-test="settingsButtonWrapper"] > button').trigger('click')
  await flushPromises()

  expect(wrapper.find('.component-settings').exists()).toEqual(false)

  // Add a song.
  router.push('/song/o1')
  await flushPromises()
  await wrapper.find('.generatorbuttons > [data-test="addButton"]').trigger('click')
  await flushPromises()
  expect(wrapper.find('.view-generator').html()).toContain('Paradhymn')

  // Add another song (programatically)
  store.commit('add', 'o2')
  store.commit('add', 'o3')
  expect(store.state.generator.generatorSongs).toEqual(['o1', 'o2', 'o3'])

  // Test rearrangement (clicking on invalid operations)
  await wrapper.find('.view-generator .songbook > tr:first-child .operation.up').trigger('click')
  await wrapper.find('.view-generator .songbook > tr:last-child .operation.down').trigger('click')
  await flushPromises()
  expect(store.state.generator.generatorSongs).toEqual(['o1', 'o2', 'o3'])

  // Test rearrangement (proper)
  await wrapper.find('.view-generator .songbook > tr:first-child .operation.down').trigger('click')
  await flushPromises()
  expect(store.state.generator.generatorSongs).toEqual(['o2', 'o1', 'o3'])

  await wrapper.find('.view-generator .songbook > tr:last-child .operation.up').trigger('click')
  await flushPromises()
  expect(store.state.generator.generatorSongs).toEqual(['o2', 'o3', 'o1'])

  await wrapper.find('.view-generator .songbook > tr:last-child .operation.delete').trigger('click')
  await flushPromises()
  expect(store.state.generator.generatorSongs).toEqual(['o2', 'o3'])

  await wrapper.find('.generatorbuttons [data-test="clearButton"]').trigger('click')
  await flushPromises()
  expect(store.state.generator.generatorSongs).toEqual([])
})

test('Song pre-processing', async () => {
  expect(escapeAll('"Citerad text" & annat')).toEqual("''Citerad text'' \\& annat")
})
