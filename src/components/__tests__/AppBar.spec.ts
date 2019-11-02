import { mount } from '@vue/test-utils'

import AppBar from '../AppBar.vue'
import store from '@/store'

describe('Components/AppBar', () => {
  it('should have the name "AppBar"', () => {
    const wrapper = mount(AppBar, { store })
    expect(wrapper.name()).toBe('AppBar')
  })

  it('should match the snapshot', () => {
    const wrapper = mount(AppBar, { store })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
