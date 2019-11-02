import { mount } from '@vue/test-utils'

import Home from '../Home.vue'

describe('Views/Home', () => {
  it('should have the name "Home"', () => {
    const wrapper = mount(Home)
    expect(wrapper.name()).toBe('Home')
  })

  it('should match the snapshot', () => {
    const wrapper = mount(Home)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
