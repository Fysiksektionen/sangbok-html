import { expect, test } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import Song from '@/views/Song'

// TODO: Add test for getting from list.
// TODO: Add chapter tests (with lists)

test('getSongFromRoute (Song)', async () => {
  router.push('/chapter/2/song/0')
  await router.isReady()

  const wrapper = mount(Song, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  expect(wrapper.html()).toContain('Ölbytarvisan')
})

test('getSongFromRoute (SongByChapterIndex)', async () => {
  router.push('/chapter/Γγ/song/1')
  await flushPromises()

  const wrapper = mount(Song, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  expect(wrapper.html()).toContain('Strejk på Pripps')
})

test('getSongFromRoute (SongByIndex)', async () => {
  router.push('/song/γ3')
  await flushPromises()

  const wrapper = mount(Song, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })

  expect(wrapper.html()).toContain('Ode till ölet')
})
