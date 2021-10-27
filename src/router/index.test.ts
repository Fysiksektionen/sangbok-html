import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App.vue'

test('List back-button behavior', async () => {
  router.push('/')
  await router.isReady()

  store.commit('newList')
  store.commit('addToList', { list: 0, index: 'α1' })
  store.commit('addToList', { list: 0, index: 'α2' })
  await flushPromises()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  expect(wrapper.findComponent({ name: 'ChaptersView' }).exists())

  // Enter lists view
  await wrapper.find('tr:last-child > td.index').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'ListsView' }).exists())

  // Enter list view
  await wrapper.find('tr > td.index').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'ListView' }).exists())

  // Enter some song in list
  await wrapper.find('tr > td.index').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'Song' }).exists())
  expect(wrapper.find('.navbuttons > .button'))

  // Go to next song
  wrapper.find('.navbuttons > .button').trigger('click')
  await flushPromises()

  // Go to some other song
  wrapper.find('.navbuttons > .button').trigger('click')
  await flushPromises()

  // Check that the back button gets you back to the list view.
  wrapper.find('.navbar > div:first-child').trigger('click')
  await flushPromises()
  expect(wrapper.find('button[title=\'Skapa sångblad\']').exists())
})
