import { mount } from '@vue/test-utils'

import Maps from '../Maps.vue'

describe('Views/Maps', () => {
  it('should have the name "Maps"', () => {
    const wrapper = mount(Maps)
    expect(wrapper.name()).toBe('Maps')
  })

  it('should match the snapshot', () => {
    const wrapper = mount(Maps)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
