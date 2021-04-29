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
    <MapEditorDialog
      v-if="editLayer === 'maps'"
      v-model="mapDialogOpen"
      :prev-map="activeMap ? activeMap.options.prevMap : {}"
      @cancel="deselectDrawing"
      @save="onUpdateMap"
    />
    <v-btn
      v-if="showInfoToggle"
      color="primary"
      class="info-toggle-btn"
      @click="toggleLabels"
    >
      Toggle Labels
    </v-btn>
    <div id="territory-editor--map" />
  </v-card>
</template>

<script lang="ts">
import { PropOptions, PropType } from 'vue'
import { Polygon, CircleMarker, Control, DrawMap, DrawEvents, Rectangle } from 'leaflet'

import Mappable from '@/mixins/Mappable'
import MapEditorDialog from './MapEditorDialog.vue'
import store from '@/store'

import { IInfoText, IInfoTypes, IInfoType, IPoint, IMap } from 'types'

type LayerName = 'image' | 'territory' | 'maps' | 'info'

// @vue/component
export default Mappable.extend({
  name: 'TerritoryEditor',

  components: { MapEditorDialog },

  props: {
    activeLayers: { type: Array as PropType<LayerName[]>, default: () => [] },
    toggleLayers: { type: Array as PropType<LayerName[]>, default: () => [] },
    editLayer: { type: String, default: '' } as PropOptions<LayerName | ''>
  },

  mounted () {
    this.initMap()
  },

  data () {
    const layers: Record<LayerName, L.FeatureGroup> = {
      image: new this.$leaflet.FeatureGroup(),
      territory: new this.$leaflet.FeatureGroup(),
      maps: new this.$leaflet.FeatureGroup(),
      info: new this.$leaflet.FeatureGroup()
    }
    return {
      loading: true,
      layers,
      map: null as DrawMap | null,
      drawControl: new this.$leaflet.Control.Draw(),
      editDrawControl: new this.$leaflet.Control.Draw(),
      dialogOpen: false,
      mapDialogOpen: false,
      activeDrawing: null as CircleMarker | null,
      activeInfoText: '',
      activeInfoType: 'House' as IInfoType,
      activeMap: null as Polygon | null,
      deleteMode: false,
      showLabels: false
    }
  },

  computed: {
    infoTypes (): IInfoTypes {
      return ['Houses', 'Flats', 'Businesses', 'Inaccessible', 'Comment', 'Todo']
    },
    showInfoToggle (): boolean {
      return this.editLayer === 'info' || this.toggleLayers.includes('info')
    }
  },

  methods: {
    initMap (): void {
      const map = this.map = this.createMap('territory-editor--map')

      map.fitBounds(new this.$leaflet.Polygon([store.state.territory.points]).getBounds())

      for (const l of this.activeLayers) {
        this.addLayer(l, map)
      }
      if (this.toggleLayers.length) {
        const layerMap: Record<LayerName, string> = {
          image: 'Image',
          territory: 'Territory',
          maps: 'Maps',
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
      map.on('overlayremove', this.onOverlayRemove)

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
      let remove: false | null = null
      switch (this.editLayer) {
        case 'info':
          drawOptions.circlemarker = {}
          this.updateToolTexts('circlemarker', 'Information Marker')
          break
        case 'territory':
        case 'maps':
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
          this.updateToolTexts('polygon', this.editLayer === 'maps' ? 'Map' : 'Boundary')
          break
        case 'image':
          remove = false
          this.updateToolTexts('rectangle', 'Overlay Boundary')
      }
      this.drawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: drawOptions,
        edit: { featureGroup: this.layers[this.editLayer] }
      })
      this.editDrawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: undefined,
        edit: { featureGroup: this.layers[this.editLayer], remove }
      })
      map.addControl(this.drawControl)
      map.on('click', this.deselectDrawing)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.CREATED, this.addDrawing)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.EDITRESIZE, this.editResize)
      // @ts-ignore
      map.on(this.$leaflet.Draw.Event.EDITSTOP, this.editStop)
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
    updateToolTexts (toolbarItem: 'circlemarker' | 'polygon' | 'rectangle', drawingName: string): void {
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
    onOverlayRemove (e: L.LeafletEvent): void {
      if (e.layer === this.layers.image) {
        (this.map as DrawMap).removeLayer(this.imageOverlay)
      }
    },
    async loadLayer (layer: L.FeatureGroup): Promise<void> {
      this.loading = true
      try {
        switch (layer) {
          case this.layers.image:
            layer.clearLayers()
            this.addImage()
            break
          case this.layers.info: {
            this.showLabels = false
            await store.dispatch.info.load()
            const texts = store.state.info.texts
            layer.clearLayers()
            texts.forEach((b) => {
              this.addInfoText(b)
            })
            break
          }
          case this.layers.maps: {
            await store.dispatch.maps.load()
            const maps = store.state.maps.list
            layer.clearLayers()
            maps.forEach((b) => {
              this.addMap(b)
            })
            break
          }
          case this.layers.territory: {
            const points = store.state.territory.points
            if (points.length) {
              this.addTerritory(points)
            }
          }
        }
      } finally {
        this.loading = false
      }
    },
    addImage (): void {
      const map = this.map as DrawMap
      if (this.editLayer === 'image') {
        map.removeControl(this.drawControl)
        map.addControl(this.editDrawControl)
        const rect = new this.$leaflet.Rectangle(this.imageOverlay.getBounds(), { fillOpacity: 0 })
        this.layers.image.addLayer(rect)
        this.imageOverlay.setOpacity(0.6)
      } else {
        this.imageOverlay.setOpacity(this.toggleLayers.includes('image') ? 0.6 : 1)
      }
      this.imageOverlay.addTo(map)
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
      const layer = new this.$leaflet.CircleMarker({ lat: e.lat, lng: e.lng }, { color: 'blue', prevInfoText: { ...e, type: e.type || 'Houses' } })
      layer.bindTooltip(e.content, { permanent: false, interactive: false, direction: 'top' })
      if (this.showLabels) layer.toggleTooltip()
      if (this.editLayer === 'info') layer.on({ click: this.onDrawingClick })
      layer.setStyle({ color: this.getInfoColor(layer.options.prevInfoText.type) })
      this.layers.info.addLayer(layer)
      return layer
    },
    addMap (e: IMap): Polygon {
      const layer = this.$leaflet.polygon([e.bounds], { prevMap: e })
      if (this.editLayer === 'maps') layer.on({ click: this.onDrawingClick })
      layer.setStyle({ color: 'orange' })
      layer.bindTooltip(e.name, { permanent: true, interactive: false, direction: 'center' })
      this.layers.maps.addLayer(layer)
      return layer
    },
    getInfoColor (type: IInfoType): string {
      switch (type) {
        case 'Flats': return 'purple'
        case 'Businesses': return 'green'
        case 'Inaccessible': return 'black'
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
        const points: IPoint[] = (layer.getLatLngs() as L.LatLng[][])[0]
        switch (this.editLayer) {
          case 'territory':
            await store.dispatch.territory.updatePoints(points)
            this.addTerritory(points)
            this.$notification({ type: 'success', text: 'Added territory boundary' })
            break
          case 'maps': {
            const newMap = await store.dispatch.maps.add({
              name: '',
              group: '',
              bounds: points,
              houses: 0,
              flats: 0,
              businesses: 0,
              inaccessible: 0,
              dncs: [],
              submaps: []
            })
            const newLayer = this.addMap(newMap)
            this.selectDrawing(newLayer)
          }
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
    editResize (e: DrawEvents.EditResize): void {
      if (this.editLayer === 'image') {
        const layer = e.layer as Rectangle
        this.imageOverlay.setBounds(layer.getBounds())
      }
    },
    editStop (): void {
      if (this.editLayer === 'image') {
        const rect = this.layers.image.getLayers()[0] as Rectangle
        this.imageOverlay.setBounds(rect.getBounds())
      }
    },
    isRectangleBounds (obj: IPoint[]): obj is [IPoint, IPoint, IPoint, IPoint] {
      return obj.length === 4
    },
    async editDrawings (e: DrawEvents.Edited): Promise<void> {
      e.layers.eachLayer(async layer => {
        if (layer instanceof Rectangle) {
          const bounds = (layer.getLatLngs() as L.LatLng[][])[0]
          if (!this.isRectangleBounds(bounds)) throw new Error('Rectangle is not returning rectangle bounds')
          await store.dispatch.territory.updateOverlay({ bounds })
          this.$notification({ type: 'success', text: 'Updated territory image' })
        } else if (layer instanceof Polygon) {
          const points: IPoint[] = (layer.getLatLngs() as L.LatLng[][])[0]
          switch (this.editLayer) {
            case 'territory':
              await store.dispatch.territory.updatePoints(points)
              this.addTerritory(points)
              this.$notification({ type: 'success', text: 'Updated territory boundary' })
              break
            case 'maps':
              await store.dispatch.maps.update({
                ...layer.options.prevMap,
                bounds: points
              })
              this.$notification({ type: 'success', text: 'Edited map boundary' })
          }
        } else if (layer instanceof CircleMarker) {
          try {
            const { lat, lng } = layer.getLatLng()
            const tooltip = layer.getTooltip()
            const content = tooltip ? String(tooltip.getContent()) : '0'
            const updatedInfo: IInfoText = {
              ...layer.options.prevInfoText,
              content,
              lat,
              lng
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
            case 'territory': {
              await store.dispatch.territory.updatePoints([])
              this.layers.territory.clearLayers()
              const map = this.map as DrawMap
              map.removeControl(this.editDrawControl)
              map.addControl(this.drawControl)
              this.$notification({ type: 'success', text: 'Deleted territory boundary' })
              break
            }
            case 'maps': {
              const id = layer.options.prevMap._id
              if (!id) throw new Error('No Id saved on map')
              await store.dispatch.maps.delete(id)
              this.layers.maps.removeLayer(layer)
              this.$notification({ type: 'success', text: 'Deleted map' })
            }
          }
        } else if (layer instanceof CircleMarker) {
          try {
            const id = layer.options.prevInfoText._id
            if (!id) throw new Error('No Id saved on marker')
            await store.dispatch.info.delete(id)
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
          ...this.activeDrawing.options.prevInfoText,
          content,
          lat,
          lng,
          type: this.activeInfoType || 'Houses'
        }
        await store.dispatch.info.update(updatedInfo)
        const tooltip = this.activeDrawing.getTooltip()
        if (tooltip) tooltip.setContent(content)
        this.activeDrawing.options.prevInfoText = updatedInfo
        this.activeDrawing.setStyle({ color: this.getInfoColor(updatedInfo.type) })
        this.deselectDrawing()
        this.$notification({ type: 'success', text: 'Updated information marker text' })
      } catch {
        this.$notification({ type: 'error', text: 'Could not update information marker text' })
      }
    },
    async onUpdateMap (map: Partial<IMap>): Promise<void> {
      if (!this.activeMap) return
      try {
        const updatedMap: IMap = {
          ...this.activeMap.options.prevMap,
          ...map
        }
        await store.dispatch.maps.update(updatedMap)
        Object.assign(this.activeMap.options.prevMap, map)
        const tooltip = this.activeMap.getTooltip()
        if (tooltip) tooltip.setContent(updatedMap.name)
        this.deselectDrawing()
        this.$notification({ type: 'success', text: 'Updated map' })
      } catch {
        this.$notification({ type: 'error', text: 'Could not update map' })
      }
    },
    deselectDrawing (): void {
      this.activeDrawing = null
      this.activeMap = null
      this.dialogOpen = false
      this.mapDialogOpen = false
      this.activeInfoText = ''
      this.activeInfoType = 'Houses'
    },
    selectDrawing (layer: CircleMarker | Polygon): void {
      if (layer instanceof CircleMarker) {
        this.deselectDrawing()
        this.activeDrawing = layer
        const tooltip = layer.getTooltip()
        this.activeInfoText = tooltip ? String(tooltip.getContent()) : ''
        this.activeInfoType = layer.options.prevInfoText.type
        this.dialogOpen = true
      } else {
        this.deselectDrawing()
        this.activeMap = layer
        this.mapDialogOpen = true
      }
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
#territory-editor--map
  height: 100%
  width: 100%
  z-index: 0
</style>
