import { expect, test } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key, BooleanSettings } from '@/store'
import App from '@/App'

test('Search box', async () => {
  router.push('/')
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  const box = wrapper.find('.component-search > input')
  await box.setValue('beta')
  await box.trigger('submit')
  await flushPromises()
  expect(wrapper.html()).toContain('β1')

  await box.setValue('omikron')
  await box.trigger('submit')
  await flushPromises()
  expect(wrapper.html()).toContain('Paradhymn')
})

test('Porthos', async () => {
  router.push('/search/portos')
  await flushPromises()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  expect(wrapper.html()).toContain('Porthos')
  await wrapper.find('td.index').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('β1')
})

test('Empty search', async () => {
  router.push('/search/somestringthatisnotfound')
  await flushPromises()
  const wrapper = mount(App, { global: { plugins: [router, [store, key], Vue3TouchEvents] } })
  expect(wrapper.find('[data-test="noSongsFound"]').exists()).toEqual(true)
})

test('Live search setting on', async () => {
  router.push('/search/')
  await flushPromises()
  const wrapper = mount(App, { global: { plugins: [router, [store, key], Vue3TouchEvents] } })

  // Set the setting (and make sure its set)
  store.commit('toggleSettingTo', { key: BooleanSettings.livesearch, value: true })
  await flushPromises()
  expect(store.state.settings.livesearch).toEqual(true)

  // Add some stuff to the text box.
  const box = wrapper.find('.component-search > input')
  await box.setValue('porthos') // Keyup events don't actually add stuff to the textbox in testing mode.
  await box.trigger('keyup', { key: 'p' })
  await box.trigger('keyup', { key: 'o' })
  await box.trigger('keyup', { key: 'r' })
  await box.trigger('keyup', { key: 't' })
  await box.trigger('keyup', { key: 'h' })
  await box.trigger('keyup', { key: 'o' })
  await box.trigger('keyup', { key: 's' })
  await flushPromises()

  // We should not be at the main view.
  expect(wrapper.findComponent({ name: 'ChaptersView' }).exists()).toEqual(false)
  // Porthos should have been found.
  expect(wrapper.html()).toContain('β1')
})

test('Live search setting off', async () => {
  router.push('/search/')
  await flushPromises()
  const wrapper = mount(App, { global: { plugins: [router, [store, key], Vue3TouchEvents] } })

  // Set the setting (and make sure its set)
  store.commit('toggleSettingTo', { key: BooleanSettings.livesearch, value: false })
  await flushPromises()
  expect(store.state.settings.livesearch).toEqual(false)

  // Add some stuff to the text box.
  const box = wrapper.find('.component-search > input')
  await box.setValue('porthos') // Keyup events don't actually add stuff to the textbox in testing mode.
  await box.trigger('keyup', { key: 'p' })
  await box.trigger('keyup', { key: 'o' })
  await box.trigger('keyup', { key: 'r' })
  await box.trigger('keyup', { key: 't' })
  await box.trigger('keyup', { key: 'h' })
  await box.trigger('keyup', { key: 'o' })
  await box.trigger('keyup', { key: 's' })
  await flushPromises()

  // We should still be at the main view.
  expect(wrapper.findComponent({ name: 'ChaptersView' }).exists()).toEqual(true)
})
