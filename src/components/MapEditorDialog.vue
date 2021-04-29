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
import { PropOptions } from 'vue'
import { DrawMap } from 'leaflet'

import Mappable from '@/mixins/Mappable'

import { IMap } from 'types'

// @vue/component
export default Mappable.extend({
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
    return {
      map: null as DrawMap | null,
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
