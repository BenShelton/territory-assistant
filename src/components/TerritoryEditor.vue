<template>
  <div class="fill-height d-flex flex-column">
    <v-toolbar class="editor-toolbar shrink">
      <v-toolbar-title>Territory Editor</v-toolbar-title>
      <v-spacer />
      <template v-if="editMarker">
        <v-text-field v-model="editMarkerModel" hide-details label="Update House Count" />
      </template>
      <v-btn
        class="ml-3 mr-n1"
        icon
        @click="onClose"
      >
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-toolbar>

    <div id="map" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'
import { Polygon, CircleMarker } from 'leaflet'

import { IBoundaryText } from 'types'

export default Vue.extend({
  mounted () {
    this.initMap()
    this.loadInfoTexts()
  },

  data () {
    return {
      infoLayer: new this.$leaflet.FeatureGroup(),
      territoryLayer: new this.$leaflet.FeatureGroup(),
      mapLayer: new this.$leaflet.FeatureGroup(),
      editMarker: null as CircleMarker | null
    }
  },

  computed: {
    editMarkerModel: {
      get (): string {
        if (!this.editMarker) return ''
        return (this.editMarker.getTooltip() as L.Tooltip).getContent() as string
      },
      set (val: string) {
        if (!this.editMarker) return
        this.editMarker.setTooltipContent(val)
      }
    }
  },

  methods: {
    initMap (): void {
      // Create the map & add the tile layer
      const { centerLat, centerLng, defaultZoom } = store.state.settings
      const map = this.$leaflet.map('map').setView({ lat: +centerLat, lng: +centerLng }, +defaultZoom)
      this.$leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      // Add the feature layers
      map.addLayer(this.infoLayer)
      map.addLayer(this.territoryLayer)
      map.addLayer(this.mapLayer)

      // Create the drawing controls
      const drawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: 'Lines cannot cross over'
            },
            shapeOptions: {
              color: '#97009c'
            }
          },
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false
          // circlemarker: false
        },
        edit: {
          featureGroup: this.infoLayer,
          remove: false
        }
      })
      map.addControl(drawControl)

      // Handle events
      map.on(this.$leaflet.Draw.Event.CREATED, this.addDrawing)
    },
    loadInfoTexts (): void {
      const texts = store.state.territory.info
      texts.forEach((b) => {
        this.addBoundaryText(b)
      })
    },
    addBoundaryText (e: IBoundaryText): void {
      const layer = new this.$leaflet.CircleMarker({ lat: e.lat, lng: e.lng })
      layer.bindTooltip(e.content, { permanent: true, interactive: true, direction: 'top' })
      layer.on({ click: this.onMarkerClick })
      this.infoLayer.addLayer(layer)
    },
    async addDrawing (e: L.LeafletEvent): Promise<void> {
      const { layer } = e
      if (layer instanceof Polygon) {
        this.infoLayer.addLayer(layer)
        let count = 0
        this.infoLayer.eachLayer(l => {
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
    selectMarker (layer: CircleMarker): void {
      this.editMarker = layer
    },
    onMarkerClick (e: L.LeafletMouseEvent): void {
      this.selectMarker(e.target)
    },
    onClose (): void {
      this.$emit('close')
    }
  }
})
</script>

<style lang="sass" scoped>
#map
  height: calc(100% - 64px)
  width: 100%
.editor-toolbar
  z-index: 500
</style>
