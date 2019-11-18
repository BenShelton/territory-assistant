import { createWrapper } from 'UnitTest/helpers'

import Maps from '../Maps.vue'

describe('Views/Maps', () => {
  it('should have the name "Maps"', () => {
    const wrapper = createWrapper(Maps, { store: true })
    expect(wrapper.name()).toBe('Maps')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(Maps, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
