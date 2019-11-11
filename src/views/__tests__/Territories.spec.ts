import { createWrapper } from 'UnitTest/helpers'

import Territories from '../Territories.vue'

describe('Views/Territories', () => {
  it('should have the name "Territories"', () => {
    const wrapper = createWrapper(Territories, { store: true })
    expect(wrapper.name()).toBe('Territories')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(Territories, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
