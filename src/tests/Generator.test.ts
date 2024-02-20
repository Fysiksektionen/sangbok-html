import { expect, test, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Vue3TouchEvents from 'vue3-touch-events'
import router from '@/router'
import store, { key } from '@/store'
import App from '@/App'
import { escapeAll } from '@/utils/export/escapes'
import { systeme } from '@/utils/export/specificSettings'
import { GeneralSettings, generalSettings } from '@/utils/export/generalSettings'
import getMainTeX from '@/utils/export/mainTeX'

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
  await router.push('/song/o1')
  await flushPromises()
  await vi.dynamicImportSettled() // Since this may be the first time we load the generator component, await imports.
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

test('Système pre-processing', async () => {
  expect(systeme('W   kg   m   Wb   s\n', [{ text: '', type: 'bool', value: true }])).toContain('W & kg & m & Wb & s\\\\*')
})

test('mainTeX-GeneralSettings negative tests', async () => {
  const gs: GeneralSettings = generalSettings
  gs.title.value = 'Test-titel'
  gs.showLogo.value = false
  gs.showAuthor.value = false
  gs.showDate.value = false
  gs.showMelody.value = false
  gs.showSheetMusicNotice.value = false // TODO: Test more extensively separately
  const res: string = getMainTeX(gs)
  expect(res).toContain('Test-titel')
  expect(res).toContain('\\author{}') // The logo is in the author tag, but here it should be empty
  expect(res).toContain('\\date{}') // Empty date is no date
  expect(res).toContain('\n\\renewcommand{\\auth}')
  expect(res).toContain('\n\\renewcommand{\\melody}')
})

test('mainTeX-GeneralSettings positive tests', async () => {
  const gs: GeneralSettings = generalSettings
  gs.title.value = 'Test-titel-2'
  gs.showLogo.value = true
  gs.showAuthor.value = true
  gs.showDate.value = true
  gs.showMelody.value = true
  gs.showSheetMusicNotice.value = true // TODO: Test more extensively separately
  const res: string = getMainTeX(gs)
  expect(res).toContain('Test-titel-2')
  expect(res).toContain('\n\\author')
  expect(res).toContain('%\\date{}') // No (i.e. commented) date is auto-date
  expect(res).toContain('%\\renewcommand{\\auth}') // No command overrides
  expect(res).toContain('%\\renewcommand{\\melody}')
})

test('mainTeX-GeneralSettings bad user input tests', async () => {
  const gs: GeneralSettings = generalSettings
  gs.title.value = '}'
  expect(getMainTeX(gs)).toContain('\\title{\\}}')

  gs.title.value = '\\{'
  expect(getMainTeX(gs)).toContain('\\title{\\\\\\{}')
})
