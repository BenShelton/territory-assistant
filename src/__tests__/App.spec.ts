import { mount } from '@vue/test-utils'

import App from '../App.vue'
import store from '@/store'

describe('App', () => {
  it('should have the name "App"', () => {
    const wrapper = mount(App, { store })
    expect(wrapper.name()).toBe('App')
  })

  it('should match the snapshot', () => {
    const wrapper = mount(App, { store })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
