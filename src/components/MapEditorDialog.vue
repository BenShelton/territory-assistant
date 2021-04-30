<template>
  <v-dialog v-model="dialog" max-width="800" eager>
    <v-card>
      <v-card-title>Edit Map</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="editMap.name" label="Name" />
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editMap.group" label="Group" />
          </v-col>
        </v-row>
        <p>Use the editor below to adjust submaps. Add, Edit or Remove submaps using the tools on the top right, or click an existing submap to adjust the name.</p>
        <div id="map-editor-dialog--map" />
        <v-divider class="my-4" />
        <p class="mb-0 subtitle-1">
          Selected Submap Information
        </p>
        <v-row>
          <v-col cols="6">
            <v-text-field v-if="selectedSubmapLayer" v-model="selectedSubmapName" label="Name" />
            <p v-else class="my-4 font-weight-bold">
              (Nothing Selected)
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" :disabled="deleteMode" @click="onCancel">
          CANCEL
        </v-btn>
        <v-btn color="success" :disabled="deleteMode" @click="onSave">
          SAVE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { PropOptions } from 'vue'
import { Control, DrawEvents, DrawMap, Polygon } from 'leaflet'

import Mappable from '@/mixins/Mappable'

import { IMap, IPoint, ISubmap } from 'types'

// @vue/component
export default Mappable.extend({
  name: 'MapEditorDialog',

  props: {
    value: { type: Boolean, required: true },
    prevMap: { type: Object, required: true } as PropOptions<IMap>
  },

  mounted () {
    this.initMap()
  },

  data () {
    return {
      map: null as DrawMap | null,
      deleteMode: false,
      drawControl: new this.$leaflet.Control.Draw(),
      editDrawControl: new this.$leaflet.Control.Draw(),
      layers: {
        outline: new this.$leaflet.FeatureGroup(),
        submaps: new this.$leaflet.FeatureGroup()
      },
      editMap: {
        name: '',
        group: '',
        submaps: []
      } as Pick<IMap, 'name' | 'group' | 'submaps'>,
      selectedSubmapLayer: null as Polygon | null
    }
  },

  computed: {
    dialog: {
      get (): boolean {
        return this.value
      },
      set (v: boolean) {
        this.$emit('input', v)
      }
    },
    selectedSubmapName: {
      get (): string {
        if (!this.selectedSubmapLayer) return ''
        return this.selectedSubmapLayer.options.prevMap.name
      },
      set (v: string) {
        if (!this.selectedSubmapLayer) return
        this.selectedSubmapLayer.options.prevMap.name = v
        this.selectedSubmapLayer.setTooltipContent(v)
      }
    }
  },

  watch: {
    value (val) {
      if (val) {
        this.deleteMode = false
        this.selectedSubmapLayer = null
        this.editMap = {
          name: this.prevMap.name,
          group: this.prevMap.group,
          // soft migration
          submaps: this.prevMap.submaps ? [...this.prevMap.submaps] : []
        }
        const outline = this.$leaflet.polygon([this.prevMap.bounds], { prevMap: this.prevMap })
        outline.setStyle({ color: 'orange' })
        this.layers.outline.clearLayers()
        this.layers.outline.addLayer(outline)

        this.layers.submaps.clearLayers()
        for (const submap of this.editMap.submaps) {
          this.addSubmap(submap)
        }

        this.$nextTick(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.map!.fitBounds(outline.getBounds())
        })
      }
    }
  },

  methods: {
    initMap (): void {
      const map = this.map = this.createMap('map-editor-dialog--map')
      this.imageOverlay.setOpacity(0.6)
      this.imageOverlay.addTo(map)
      map.addLayer(this.layers.outline)
      map.addLayer(this.layers.submaps)

      this.$leaflet.EditToolbar.Delete.include({
        removeAllLayers: false
      })
      const drawOptions: Control.DrawOptions = {
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
        rectangle: false,
        marker: false,
        circle: false,
        circlemarker: false
      }
      this.drawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: drawOptions,
        edit: { featureGroup: this.layers.submaps }
      })
      this.editDrawControl = new this.$leaflet.Control.Draw({
        position: 'topright',
        draw: undefined,
        edit: { featureGroup: this.layers.submaps, remove: null }
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
    },
    addDrawing (e: DrawEvents.Created): void {
      const layer = e.layer as Polygon
      const points: IPoint[] = (layer.getLatLngs() as L.LatLng[][])[0]
      const newSubmap: ISubmap = {
        name: '',
        bounds: points
      }
      this.editMap.submaps.push(newSubmap)
      const newLayer = this.addSubmap(newSubmap)
      this.selectDrawing(newLayer)
    },
    editDrawings (e: DrawEvents.Edited): void {
      e.layers.eachLayer((l) => {
        const layer = l as Polygon
        const points: IPoint[] = (layer.getLatLngs() as L.LatLng[][])[0]
        layer.options.prevMap.bounds = points
      })
    },
    removeDrawings (e: DrawEvents.Deleted): void {
      e.layers.eachLayer((l) => {
        const layer = l as Polygon
        this.layers.submaps.removeLayer(layer)
        const index = this.editMap.submaps.indexOf(layer.options.prevMap)
        if (index > -1) {
          this.editMap.submaps.splice(index, 1)
        }
      })
    },
    addSubmap (submap: ISubmap): Polygon {
      const layer = this.$leaflet.polygon([submap.bounds], { prevMap: submap })
      layer.on({ click: this.onDrawingClick })
      layer.setStyle({ color: 'purple' })
      layer.bindTooltip(submap.name, { permanent: true, interactive: false, direction: 'center' })
      this.layers.submaps.addLayer(layer)
      return layer
    },
    selectDrawing (layer: Polygon): void {
      this.selectedSubmapLayer = layer
    },
    deselectDrawing (): void {
      this.selectedSubmapLayer = null
    },
    onDrawingClick (e: L.LeafletMouseEvent): void {
      if (this.deleteMode) return
      this.$leaflet.DomEvent.stopPropagation(e)
      this.selectDrawing(e.target)
    },
    onDeleteStart (): void {
      this.deleteMode = true
      this.deselectDrawing()
    },
    onDeleteStop (): void {
      this.deleteMode = false
    },
    onCancel (): void {
      this.dialog = false
      this.$emit('cancel')
    },
    onSave (): void {
      this.$emit('save', this.editMap)
    }
  }
})
</script>

<style lang="sass" scoped>
#map-editor-dialog--map
  height: 300px
  width: 100%
</style>
