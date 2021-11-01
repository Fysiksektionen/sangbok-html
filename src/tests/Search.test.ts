import { flushPromises, mount } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App.vue'

test('Porthos', async () => {
  router.push('/search/portos')
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router, [store, key], Vue3TouchEvents] }
  })
  expect(wrapper.html()).toContain('Porthos')
  await wrapper.find('td.index').trigger('click')
  await flushPromises()
  expect(wrapper.html()).toContain('β1')
})
