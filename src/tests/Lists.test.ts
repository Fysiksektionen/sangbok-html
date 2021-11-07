import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App.vue'

test('List song management', async () => {
  // Attempt new list
  store.commit('newList')

  // Add to list
  store.commit('addToList', { list: 0, index: 'α1' })
  store.commit('addToList', { list: 0, index: 'α2' })
  store.commit('addToList', { list: 0, index: 'α3' })
  expect(store.state.lists[0].songs).toEqual(['α1', 'α2', 'α3'])
  // Attempt to add an invalid index. Expect no change.
  store.commit('addToList', { list: 0, index: '' })
  expect(store.state.lists[0].songs).toEqual(['α1', 'α2', 'α3'])

  // Move back and forth
  store.commit('moveInList', { list: 0, index: 1, direction: 1 })
  expect(store.state.lists[0].songs).toEqual(['α1', 'α3', 'α2'])
  store.commit('moveInList', { list: 0, index: 1, direction: -1 })
  expect(store.state.lists[0].songs).toEqual(['α3', 'α1', 'α2'])
  // Attempt an invalid move. Expect no change
  store.commit('moveInList', { list: 0, index: 0, direction: -1 })
  expect(store.state.lists[0].songs).toEqual(['α3', 'α1', 'α2'])
  store.commit('moveInList', { list: 0, index: 2, direction: 1 })
  expect(store.state.lists[0].songs).toEqual(['α3', 'α1', 'α2'])
  store.commit('moveInList', { list: 0, index: 5, direction: 1 })
  expect(store.state.lists[0].songs).toEqual(['α3', 'α1', 'α2'])

  // Deletion
  store.commit('deleteFromList', { list: 0, index: 1 })
  expect(store.state.lists[0].songs).toEqual(['α3', 'α2'])
  // Invalid deletion
  store.commit('deleteFromList', { list: 0, index: 7 })
  expect(store.state.lists[0].songs).toEqual(['α3', 'α2'])

  // List not found. Expect no crash.
  store.commit('addToList', { list: 42, index: 'α1' })
  store.commit('moveInList', { list: 42, index: 1, direction: -1 })
  store.commit('deleteFromList', { list: 42, index: 0 })
  store.commit('deleteList', 42)

  // Delete our list
  store.commit('deleteList', 0)
  await flushPromises()
  expect(store.state.lists.length).toEqual(0)
})

test('List navigation', async () => {
  router.push('/')
  await router.isReady()

  store.commit('newList')
  store.commit('addToList', { list: 0, index: 'α1' })
  store.commit('addToList', { list: 0, index: 'α2' })
  await flushPromises()
  expect(store.state.lists[0].songs).toEqual(['α1', 'α2'])

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  expect(wrapper.findComponent({ name: 'ChaptersView' }).exists()).toEqual(true)

  // Enter lists view
  await wrapper.find('tr:last-child > td.index').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'ListsView' }).exists()).toEqual(true)

  // Enter list view
  await wrapper.find('tr > td.index').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'ListView' }).exists()).toEqual(true)

  // Enter some song in list
  await wrapper.find('tr > td.index').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'SongView' }).exists()).toEqual(true)
  expect(wrapper.html()).toContain('α1')
  expect(wrapper.find('.navbuttons > div.button[data-test="next"]').exists()).toEqual(true)

  // Go to next song
  await wrapper.find('.navbuttons > div.button[data-test="next"]').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'SongView' }).exists()).toEqual(true)
  expect(wrapper.html()).toContain('α2')

  // Go to some other song
  await wrapper.find('.navbuttons > div.button[data-test="previous"]').trigger('click')
  await flushPromises()
  expect(wrapper.findComponent({ name: 'SongView' }).exists()).toEqual(true)
  expect(wrapper.html()).toContain('α1')

  // Check that the back button gets you back to the list view.
  // TODO: This test doesn't work (router.back doesn't work in tests forsome reason)
  // expect(wrapper.find('.navbar > div:first-child').exists()).toEqual(true)
  // await wrapper.find('.navbar > div:first-child').trigger('click')
  // await flushPromises()
  // expect(wrapper.html()).toContain('Lista')
  // expect(wrapper.findComponent({ name: 'ListView' }).exists()).toEqual(true)

  // Delete our list (we want a clean store for the next test)
  router.push('/') // Prevent 404s when programatically deleting the list wile viewing it
  await flushPromises()
  store.commit('deleteList', 0)
  expect(store.state.lists.length).toEqual(0)
})

test('Share modal', async () => {
  expect(store.state.lists.length).toEqual(0)

  store.commit('newList')
  store.commit('addToList', { list: 0, index: 'α1' })
  store.commit('addToList', { list: 0, index: 'α2' })

  router.push('/list/0')
  await flushPromises()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  await wrapper.find('.button[title=\'Dela\']').trigger('click')
  await flushPromises()

  expect(wrapper.html()).toContain('Kopiera länk')
})
