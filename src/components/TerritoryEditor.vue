<template>
  <v-card class="editor">
    <v-fade-transition>
      <v-overlay v-if="loading" absolute>
        <v-progress-circular indeterminate />
      </v-overlay>
    </v-fade-transition>
    <div id="map" />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import store from '@/store'
import { Polygon, CircleMarker, Control, DrawMap } from 'leaflet'

import { IBoundaryText } from 'types'

type LayerName = 'territory' | 'map' | 'info'

export default Vue.extend({
  name: 'TerritoryEditor',

  props: {
    activeLayers: { type: Array as PropType<LayerName[]>, default: () => [] },
    toggleLayers: { type: Array as PropType<LayerName[]>, default: () => [] },
    editLayer: { type: String as PropType<LayerName | ''>, default: '' }
  },

  mounted () {
    this.initMap()
  },

  data () {
    const layers: Record<LayerName, L.FeatureGroup> = {
      territory: new this.$leaflet.FeatureGroup(),
      map: new this.$leaflet.FeatureGroup(),
      info: new this.$leaflet.FeatureGroup()
    }
    return {
      loading: true,
      layers
    }
  },

  methods: {
    initMap (): void {
      // Create the map & add the tile layer
      const { centerLat, centerLng, defaultZoom } = store.state.settings
      const tileLayer = this.$leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
      const map = this.$leaflet.map('map', {
        center: { lat: +centerLat, lng: +centerLng },
        zoom: +defaultZoom,
        layers: [tileLayer]
      })

      for (const l of this.activeLayers) {
        const layer = this.layers[l]
        map.addLayer(layer)
        this.loadLayer(layer)
      }
      if (this.toggleLayers.length) {
        const layerMap: Record<LayerName, string> = {
          territory: 'Territory',
          map: 'Map',
          info: 'Info'
        }
        const overlays = this.toggleLayers.reduce((acc: Record<typeof layerMap[LayerName], L.FeatureGroup>, l) => {
          acc[layerMap[l]] = this.layers[l]
          return acc
        }, {})
        this.$leaflet.control.layers({}, overlays).addTo(map)
      }

      this.addEditLayer(map)

      // Handle events
      map.on('overlayadd', this.onOverlayAdd)
      map.on(this.$leaflet.Draw.Event.CREATED, this.addDrawing)

      this.loading = false
    },
    addEditLayer (map: DrawMap): void {
      if (!this.editLayer) return
      const drawOptions: Control.DrawOptions = {
        polygon: false,
        polyline: false,
        rectangle: false,
        marker: false,
        circle: false,
        circlemarker: false
      }
      switch (this.editLayer) {
        case 'info':
          drawOptions.circlemarker = {}
          break
        case 'territory':
        case 'map':
          drawOptions.polygon = {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: 'Lines cannot cross over'
            },
            shapeOptions: {
              color: '#97009c'
            }
          }
      }
      const drawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: drawOptions,
        edit: {
          featureGroup: this.layers[this.editLayer],
          remove: false
        }
      })
      map.addControl(drawControl)
    },
    onOverlayAdd (e: L.LeafletEvent): void {
      this.loadLayer(e.layer)
    },
    async loadLayer (layer: L.FeatureGroup): Promise<void> {
      this.loading = true
      try {
        switch (layer) {
          case this.layers.info:
            await this.loadInfoTexts()
        }
      } finally {
        this.loading = false
      }
    },
    async loadInfoTexts (): Promise<void> {
      await store.dispatch('territory/loadInfo')
      const texts = store.state.territory.info
      this.layers.info.clearLayers()
      texts.forEach((b) => {
        this.addBoundaryText(b)
      })
    },
    addBoundaryText (e: IBoundaryText): void {
      const layer = new this.$leaflet.CircleMarker({ lat: e.lat, lng: e.lng }, { color: 'blue' })
      layer.bindTooltip(e.content, { permanent: true, interactive: true, direction: 'top' })
      layer.on({ click: this.onMarkerClick })
      this.layers.info.addLayer(layer)
    },
    async addDrawing (e: L.LeafletEvent): Promise<void> {
      const { layer } = e
      if (layer instanceof Polygon) {
        this.layers.info.addLayer(layer)
        let count = 0
        this.layers.info.eachLayer(l => {
          if (l instanceof CircleMarker) {
            if (this.markerWithinPolygon(l, layer)) {
              const tooltip = l.getTooltip()
              if (tooltip) {
                const content = tooltip.getContent()
                if (typeof content === 'string' && !Number.isNaN(+content)) count += +content
              }
            }
          }
        })
        this.$notification({ type: 'success', text: 'Number of houses: ' + count })
      } else if (layer instanceof CircleMarker) {
        const { lat, lng } = layer.getLatLng()
        const newInfo: IBoundaryText = { content: '0', lat, lng }
        const res: IBoundaryText = await store.dispatch('territory/addInfo', newInfo)
        this.addBoundaryText(res)
      } else {
        console.log(layer)
      }
    },
    markerWithinPolygon (marker: CircleMarker, polygon: Polygon): boolean {
      const polyPoints = (polygon.getLatLngs() as L.LatLng[][])[0]
      const { lat: x, lng: y } = marker.getLatLng()
      let inside = false
      for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        const { lat: xi, lng: yi } = polyPoints[i]
        const { lat: xj, lng: yj } = polyPoints[j]
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
        if (intersect) inside = !inside
      }
      return inside
    },
    deselectMarker (): void {
      // if (this.editMarker) {
      //   this.editMarker.setStyle({ color: 'blue' })
      // }
      // this.editMarker = null
    },
    selectMarker (layer: CircleMarker): void {
      this.deselectMarker()
      // this.editMarker = layer
      layer.setStyle({ color: 'green' })
    },
    onMarkerClick (e: L.LeafletMouseEvent): void {
      this.selectMarker(e.target)
    }
  }
})
</script>

<style lang="sass" scoped>
.editor
  position: relative
  height: 100%
  width: 100%
#map
  height: 100%
  width: 100%
  z-index: 0
</style>
