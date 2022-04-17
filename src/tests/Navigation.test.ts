import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App'

// Tests for inter-view navigation. For more specific views, see other tests.

test('Chapter views', async () => {
  router.push('/')
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  expect(wrapper.html()).toContain('Visor vi minns')

  await wrapper.find('td.index').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('α1')

  await wrapper.find('td.index').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('α1')
})
