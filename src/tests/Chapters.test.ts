import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App'

test('Chapter view by index', async () => {
  router.push('/')
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  router.push('/chapter/0')
  await flushPromises()
  expect(wrapper.html()).toContain('α1')
})

test('Chapter view by index', async () => {
  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  router.push('/chapter/Aα')
  await flushPromises()
  expect(wrapper.html()).toContain('α1')
})
