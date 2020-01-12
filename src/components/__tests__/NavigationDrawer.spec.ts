import { createWrapper } from 'UnitTest/helpers'

import NavigationDrawer from '../NavigationDrawer.vue'

describe('Components/NavigationDrawer', () => {
  it('should have the name "NavigationDrawer"', () => {
    const wrapper = createWrapper(NavigationDrawer, { store: true })
    expect(wrapper.name()).toBe('NavigationDrawer')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(NavigationDrawer, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
