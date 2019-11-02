import { mount } from '@vue/test-utils'

import NavigationDrawer from '../NavigationDrawer.vue'
import store from '@/store'

describe('Components/NavigationDrawer', () => {
  it('should have the name "NavigationDrawer"', () => {
    const wrapper = mount(NavigationDrawer, { store })
    expect(wrapper.name()).toBe('NavigationDrawer')
  })

  it('should match the snapshot', () => {
    const wrapper = mount(NavigationDrawer, { store })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
