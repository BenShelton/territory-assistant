import { mount } from '@vue/test-utils'

import Territories from '../Territories.vue'

describe('Views/Territories', () => {
  it('should have the name "Territories"', () => {
    const wrapper = mount(Territories)
    expect(wrapper.name()).toBe('Territories')
  })

  it('should match the snapshot', () => {
    const wrapper = mount(Territories)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
