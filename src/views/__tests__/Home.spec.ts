import { createWrapper } from 'UnitTest/helpers'

import Home from '../Home.vue'

describe('Views/Home', () => {
  it('should have the name "Home"', () => {
    const wrapper = createWrapper(Home, { store: true })
    expect(wrapper.name()).toBe('Home')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(Home, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
