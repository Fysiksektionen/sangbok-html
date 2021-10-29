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
  expect(store.state.lists.length).toEqual(0)
})

test('List back-button behavior', async () => {
  router.push('/')
  await router.isReady()

  store.commit('newList')
  store.commit('addToList', { list: 0, index: 'α1' })
  store.commit('addToList', { list: 0, index: 'α2' })

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
