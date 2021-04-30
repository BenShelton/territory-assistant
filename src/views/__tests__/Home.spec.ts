import { createWrapper } from 'UnitTest/helpers'

import Home from '../Home.vue'

import { API } from 'types'

describe('Views/Home', () => {
  // Setup
  beforeAll(() => {
    fetchMock.mockResponse(async (req) => {
      const url = req.url.replace('/.netlify/functions/', '')
      switch (url) {
        case 'info': {
          const res: API.Info.List.Response = []
          return JSON.stringify(res)
        }
      }
      return JSON.stringify({})
    })
  })

  // Tests
  it('should have the name "Home"', () => {
    const wrapper = createWrapper(Home, { store: true })
    expect(wrapper.name()).toBe('Home')
  })

  it('should match the snapshot', () => {
    const wrapper = createWrapper(Home, { store: true })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
