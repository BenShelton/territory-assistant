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
        <p>Use the editor below to edit submaps.</p>
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
import Vue, { PropOptions } from 'vue'
import { DrawMap } from 'leaflet'

import store from '@/store'

import { IMap } from 'types'

export default Vue.extend({
  name: 'MapEditorDialog',

  props: {
    value: { type: Boolean, required: true },
    prevMap: { type: Object, required: true } as PropOptions<IMap>
  },

  mounted () {
    const map = this.map = this.createMap('map-editor-dialog--map')
    this.imageOverlay.setOpacity(0.6)
    this.imageOverlay.addTo(map)
    map.addLayer(this.layers.outline)
  },

  data () {
    const { src } = store.state.territory.overlay
    const points = store.state.territory.overlay.bounds || store.state.territory.points
    const bounds = new this.$leaflet.Polygon([points]).getBounds()
    return {
      map: null as DrawMap | null,
      imageOverlay: new this.$leaflet.ImageOverlay(src, bounds),
      layers: {
        outline: new this.$leaflet.FeatureGroup()
      },
      editMap: {
        name: '',
        group: ''
      } as Partial<IMap>
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
          group: this.prevMap.group
        }
        const outline = this.$leaflet.polygon([this.prevMap.bounds], { prevMap: this.prevMap })
        outline.setStyle({ color: 'orange' })
        this.layers.outline.clearLayers()
        this.layers.outline.addLayer(outline)
        this.$nextTick(() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.map!.fitBounds(outline.getBounds())
        })
      }
    }
  },

  methods: {
    // TODO: Share between this and TerritoryEditor
    createMap (id: string): DrawMap {
      // Create the map & add the tile layer
      const tileLayer = this.$leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
      return this.$leaflet.map(id, {
        layers: [tileLayer]
      })
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
