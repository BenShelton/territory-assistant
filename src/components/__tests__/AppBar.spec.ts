import { createWrapper } from 'UnitTest/helpers'

import AppBar from '../AppBar.vue'

describe('Components/AppBar', () => {
  it('should have the name "AppBar"', () => {
    const wrapper = createWrapper(AppBar, { store: true })
    expect(wrapper.name()).toBe('AppBar')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(AppBar, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
