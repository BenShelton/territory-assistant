<template>
  <v-card class="editor">
    <v-fade-transition>
      <v-overlay v-if="loading" absolute>
        <v-progress-circular indeterminate />
      </v-overlay>
    </v-fade-transition>
    <v-dialog v-model="dialogOpen" max-width="300">
      <v-card>
        <v-card-title>Edit Marker</v-card-title>
        <v-card-text>
          <v-text-field v-model="activeInfoText" label="Text" />
          <v-radio-group v-model="activeInfoType">
            <v-radio
              v-for="infoType of infoTypes"
              :key="infoType"
              :label="infoType"
              :value="infoType"
            />
          </v-radio-group>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="error" @click="deselectDrawing">
            CANCEL
          </v-btn>
          <v-btn color="success" @click="onUpdateMarkerText">
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-if="showInfoToggle"
      color="primary"
      class="info-toggle-btn"
      @click="toggleLabels"
    >
      Toggle Labels
    </v-btn>
    <div id="map" />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import store from '@/store'
import { Polygon, CircleMarker, Control, DrawMap, DrawEvents } from 'leaflet'

import { IInfoText, IInfoTypes, IInfoType, IPoint } from 'types'

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
      layers,
      map: null as DrawMap | null,
      drawControl: new this.$leaflet.Control.Draw(),
      editDrawControl: new this.$leaflet.Control.Draw(),
      dialogOpen: false,
      activeDrawing: null as CircleMarker | null,
      activeInfoText: '',
      activeInfoType: 'House' as IInfoType,
      deleteMode: false,
      showLabels: false
    }
  },

  computed: {
    infoTypes (): IInfoTypes {
      return ['Houses', 'Flats', 'Comment', 'Todo']
    },
    showInfoToggle (): boolean {
      return this.editLayer === 'info' || this.toggleLayers.includes('info')
    }
  },

  methods: {
    initMap (): void {
      // Create the map & add the tile layer
      const tileLayer = this.$leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
      const map = this.map = this.$leaflet.map('map', {
        layers: [tileLayer]
      })

      map.fitBounds(new this.$leaflet.Polygon([store.state.territory.points]).getBounds())

      for (const l of this.activeLayers) {
        this.addLayer(l, map)
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

      this.loading = false
    },
    addEditLayer (map: DrawMap): void {
      if (!this.editLayer) return
      this.$leaflet.EditToolbar.Delete.include({
        removeAllLayers: false
      })
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
          this.updateToolTexts('circlemarker', 'Information Marker')
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
      this.drawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: drawOptions,
        edit: { featureGroup: this.layers[this.editLayer] }
      })
      this.editDrawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: undefined,
        edit: { featureGroup: this.layers[this.editLayer] }
      })
      map.addControl(this.drawControl)
      map.on('click', this.deselectDrawing)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.CREATED, this.addDrawing)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.EDITED, this.editDrawings)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.DELETESTART, this.onDeleteStart)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.DELETESTOP, this.onDeleteStop)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.DELETED, this.removeDrawings)
      this.addLayer(this.editLayer, map)
    },
    toggleLabels (): void {
      this.showLabels = !this.showLabels
      this.layers.info.eachLayer(l => {
        if (this.showLabels) l.openTooltip()
        else l.closeTooltip()
      })
    },
    updateToolTexts (toolbarItem: 'circlemarker', drawingName: string): void {
      this.$leaflet.drawLocal.draw.toolbar.buttons[toolbarItem] = `Add ${drawingName}`
      this.$leaflet.drawLocal.draw.handlers[toolbarItem].tooltip.start = `Click map to add a new ${drawingName}.`
      this.$leaflet.drawLocal.edit.toolbar.buttons.edit = `Move ${drawingName}(s)`
      this.$leaflet.drawLocal.edit.toolbar.buttons.editDisabled = `No ${drawingName}s to move`
      this.$leaflet.drawLocal.edit.toolbar.buttons.remove = `Delete ${drawingName}(s)`
      this.$leaflet.drawLocal.edit.toolbar.buttons.removeDisabled = `No ${drawingName}s to delete`
      this.$leaflet.drawLocal.edit.handlers.edit.tooltip.text = `Drag handles or markers to edit ${drawingName}s.`
      this.$leaflet.drawLocal.edit.handlers.remove.tooltip.text = `Click to remove ${drawingName}s.`
    },
    async addLayer (name: LayerName, map: DrawMap): Promise<void> {
      const layer = this.layers[name]
      map.addLayer(layer)
      await this.loadLayer(layer)
    },
    async onOverlayAdd (e: L.LeafletEvent): Promise<void> {
      await this.loadLayer(e.layer)
      if (this.editLayer) {
        this.layers[this.editLayer].bringToFront()
      }
    },
    async loadLayer (layer: L.FeatureGroup): Promise<void> {
      this.loading = true
      try {
        switch (layer) {
          case this.layers.info:
            this.showLabels = false
            await store.dispatch.info.load()
            const texts = store.state.info.texts
            this.layers.info.clearLayers()
            texts.forEach((b) => {
              this.addInfoText(b)
            })
            break
          case this.layers.territory:
            const points = store.state.territory.points
            if (points.length) {
              this.addTerritory(points)
            }
        }
      } finally {
        this.loading = false
      }
    },
    addTerritory (points: IPoint[]): void {
      this.layers.territory.clearLayers()
      const layer = new this.$leaflet.Polygon([points])
      this.layers.territory.addLayer(layer)
      if (this.editLayer === 'territory') {
        const map = this.map as DrawMap
        map.removeControl(this.drawControl)
        map.addControl(this.editDrawControl)
      }
    },
    addInfoText (e: IInfoText): CircleMarker {
      // @ts-ignore
      const layer = new this.$leaflet.CircleMarker({ lat: e.lat, lng: e.lng }, { color: 'blue', customId: e._id, customType: e.type || 'Houses' })
      layer.bindTooltip(e.content, { permanent: false, interactive: false, direction: 'top' })
      if (this.showLabels) layer.toggleTooltip()
      if (this.editLayer === 'info') layer.on({ click: this.onDrawingClick })
      layer.setStyle({ color: this.getInfoColor(layer.options.customType) })
      this.layers.info.addLayer(layer)
      return layer
    },
    getInfoColor (type: IInfoType): string {
      switch (type) {
        case 'Flats': return 'purple'
        case 'Comment': return 'grey'
        case 'Todo': return 'red'
        default: return 'blue'
      }
    },
    onDeleteStart (): void {
      this.deleteMode = true
      this.deselectDrawing()
    },
    onDeleteStop (): void {
      this.deleteMode = false
    },
    async addDrawing (e: DrawEvents.Created): Promise<void> {
      const { layer } = e
      if (layer instanceof Polygon) {
        switch (this.editLayer) {
          case 'territory':
            const points: IPoint[] = (layer.getLatLngs() as L.LatLng[][])[0]
            await store.dispatch.territory.updatePoints(points)
            this.addTerritory(points)
            this.$notification({ type: 'success', text: 'Added territory boundary' })
            break
          case 'map':
            this.layers.map.addLayer(layer)
            let count = 0
            this.layers.info.eachLayer(l => {
              if (this.markerWithinPolygon(l as CircleMarker, layer)) {
                const tooltip = l.getTooltip()
                if (tooltip) {
                  const content = tooltip.getContent()
                  if (typeof content === 'string' && !Number.isNaN(+content)) count += +content
                }
              }
            })
            this.$notification({ type: 'success', text: 'Number of houses: ' + count })
        }
      } else if (layer instanceof CircleMarker) {
        const { lat, lng } = layer.getLatLng()
        const newInfo: IInfoText = { content: '0', lat, lng, type: 'Houses' }
        const res: IInfoText = await store.dispatch.info.add(newInfo)
        const newLayer = this.addInfoText(res)
        newLayer.setStyle({ color: this.getInfoColor(newInfo.type) })
        this.selectDrawing(newLayer)
      } else {
        console.log(layer)
      }
    },
    async editDrawings (e: DrawEvents.Edited): Promise<void> {
      e.layers.eachLayer(async layer => {
        if (layer instanceof Polygon) {
          switch (this.editLayer) {
            case 'territory':
              const points: IPoint[] = (layer.getLatLngs() as L.LatLng[][])[0]
              await store.dispatch.territory.updatePoints(points)
              this.addTerritory(points)
              this.$notification({ type: 'success', text: 'Updated territory boundary' })
          }
        } else if (layer instanceof CircleMarker) {
          try {
            const { lat, lng } = layer.getLatLng()
            const tooltip = layer.getTooltip()
            const content = tooltip ? String(tooltip.getContent()) : '0'
            const updatedInfo: IInfoText = {
              // @ts-ignore
              _id: layer.options.customId,
              content,
              lat,
              lng,
              // @ts-ignore
              type: layer.options.customType || 'Houses'
            }
            await store.dispatch.info.update(updatedInfo)
            this.$notification({ type: 'success', text: 'Edited information marker' })
          } catch {
            this.$notification({ type: 'error', text: 'Could not edit information marker' })
          }
        } else {
          this.$notification({ type: 'error', text: 'No handler to edit this layer type' })
          console.log(layer)
        }
      })
    },
    async removeDrawings (e: DrawEvents.Deleted): Promise<void> {
      e.layers.eachLayer(async layer => {
        if (layer instanceof Polygon) {
          switch (this.editLayer) {
            case 'territory':
              await store.dispatch.territory.updatePoints([])
              this.layers.territory.clearLayers()
              const map = this.map as DrawMap
              map.removeControl(this.editDrawControl)
              map.addControl(this.drawControl)
              this.$notification({ type: 'success', text: 'Deleted territory boundary' })
          }
        } else if (layer instanceof CircleMarker) {
          try {
            // @ts-ignore
            await store.dispatch('info/delete', layer.options.customId)
            this.layers.info.removeLayer(layer)
            this.$notification({ type: 'success', text: 'Deleted information marker' })
          } catch {
            this.layers.info.addLayer(layer)
            this.$notification({ type: 'error', text: 'Could not delete information marker' })
          }
        } else {
          this.$notification({ type: 'error', text: 'No handler to remove this layer type' })
          console.log(layer)
        }
      })
    },
    async onUpdateMarkerText (): Promise<void> {
      if (!this.activeDrawing) return
      try {
        const { lat, lng } = this.activeDrawing.getLatLng()
        const content = this.activeInfoText.trim() || '0'
        const updatedInfo: IInfoText = {
          // @ts-ignore
          _id: this.activeDrawing.options.customId,
          content,
          lat,
          lng,
          // @ts-ignore
          type: this.activeInfoType || 'Houses'
        }
        await store.dispatch.info.update(updatedInfo)
        const tooltip = this.activeDrawing.getTooltip()
        if (tooltip) tooltip.setContent(content)
        // @ts-ignore
        this.activeDrawing.options.customType = updatedInfo.type
        this.activeDrawing.setStyle({ color: this.getInfoColor(updatedInfo.type) })
        this.deselectDrawing()
        this.$notification({ type: 'success', text: 'Updated information marker text' })
      } catch {
        this.$notification({ type: 'error', text: 'Could not update information marker text' })
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
    deselectDrawing (): void {
      this.activeDrawing = null
      this.dialogOpen = false
      this.activeInfoText = ''
      this.activeInfoType = 'Houses'
    },
    selectDrawing (layer: CircleMarker): void {
      this.deselectDrawing()
      this.activeDrawing = layer
      const tooltip = layer.getTooltip()
      this.activeInfoText = tooltip ? String(tooltip.getContent()) : ''
      // @ts-ignore
      this.activeInfoType = layer.options.customType
      this.dialogOpen = true
    },
    onDrawingClick (e: L.LeafletMouseEvent): void {
      if (this.deleteMode) return
      this.$leaflet.DomEvent.stopPropagation(e)
      this.selectDrawing(e.target)
    }
  }
})
</script>

<style lang="sass" scoped>
.editor
  position: relative
  height: 100%
  width: 100%
.info-toggle-btn
  position: absolute
  bottom: 5px
  left: 5px
  z-index: 1
#map
  height: 100%
  width: 100%
  z-index: 0
</style>
