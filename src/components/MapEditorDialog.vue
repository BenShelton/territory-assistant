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
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="onCancel">
          CANCEL
        </v-btn>
        <v-btn color="success" @click="onSave">
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
      } as Pick<IMap, 'name' | 'group' | 'submaps'>
    }
  },

  computed: {
    dialog: {
      get (): boolean {
        return this.value
      },
      set (v: boolean) {
        this.$emit('update', v)
      }
    }
  },

  watch: {
    value (val) {
      if (val) {
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
      // // @ts-ignore
      // map.on(this.$leaflet.Draw.Event.EDITRESIZE, this.editResize)
      // // @ts-ignore
      // map.on(this.$leaflet.Draw.Event.EDITSTOP, this.editStop)
      // // @ts-ignore
      // map.on(this.$leaflet.Draw.Event.EDITED, this.editDrawings)
      // // @ts-ignore
      // map.on(this.$leaflet.Draw.Event.DELETESTART, this.onDeleteStart)
      // // @ts-ignore
      // map.on(this.$leaflet.Draw.Event.DELETESTOP, this.onDeleteStop)
      // // @ts-ignore
      // map.on(this.$leaflet.Draw.Event.DELETED, this.removeDrawings)
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
    addSubmap (submap: ISubmap): Polygon {
      const layer = this.$leaflet.polygon([submap.bounds])
      layer.setStyle({ color: 'purple' })
      this.layers.submaps.addLayer(layer)
      return layer
    },
    selectDrawing (layer: Polygon): void {
      // TODO: Show editable submap information
      console.log(layer)
    },
    deselectDrawing (): void {
      // TODO: Hide editable submap information
      console.log('click')
    },
    onCancel (): void {
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
