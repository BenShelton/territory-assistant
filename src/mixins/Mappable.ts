import Vue from 'vue'
import { DrawMap } from 'leaflet'

import store from '@/store'

export default Vue.extend({
  data () {
    const { src } = store.state.territory.overlay
    const points = store.state.territory.overlay.bounds || store.state.territory.points
    const bounds = new this.$leaflet.Polygon([points]).getBounds()
    return {
      imageOverlay: new this.$leaflet.ImageOverlay(src, bounds)
    }
  },

  methods: {
    createMap (id: string): DrawMap {
      // Create the map & add the tile layer
      const tileLayer = this.$leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
      return this.$leaflet.map(id, {
        layers: [tileLayer]
      })
    }
  }
})
