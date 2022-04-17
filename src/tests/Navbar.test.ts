import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import Navbar from '@/components/Navbar'

test('Navbar dropdown', async () => {
  router.push('/')
  await router.isReady()

  const wrapper = mount(Navbar, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  expect(wrapper.html()).toContain('Sångboken')

  await wrapper.find('img[alt=\'Visa inställningar\']').trigger('click')
  await flushPromises()
  expect(wrapper.find('.component-settings').exists())

  await wrapper.find('img[alt=\'Dölj inställningar\']').trigger('click')
  await flushPromises()
  expect(wrapper.find('.component-settings').exists()).toBe(false)
})
