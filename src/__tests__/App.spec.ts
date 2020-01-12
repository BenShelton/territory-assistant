import { createWrapper } from 'UnitTest/helpers'

import App from '../App.vue'

describe('App', () => {
  it('should have the name "App"', () => {
    const wrapper = createWrapper(App, { store: true })
    expect(wrapper.name()).toBe('App')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(App, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
