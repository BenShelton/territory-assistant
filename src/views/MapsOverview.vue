<template>
  <v-container>
    <h1 class="headline mb-3">
      Maps Overview
    </h1>
    <v-card class="my-5" flat outlined>
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="isLoading.name === 'recalculate'"
          :disabled="isLoading.value"
          @click="onRecalculate"
        >
          Recalculate All Maps
        </v-btn>
        <v-btn
          color="primary"
          :loading="isLoading.name === 'print'"
          :disabled="isLoading.value || !selected.length"
          @click="onPrint"
        >
          Print Selected
        </v-btn>
      </v-card-actions>
      <a ref="downloadLink" style="display: none;" download="CanvasAsImage.png" />
      <div id="invisibleMap" />
    </v-card>
    <v-data-table
      v-model="selected"
      show-select
      class="elevation-1"
      item-key="_id"
      :headers="headers"
      :items="items"
      :loading="loading"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { IMap } from 'types'

type LoadingName = 'recalculate' | 'print' | ''
type TableMap = IMap & { dncCount: number, submapCount: number }
interface ITableHeader {
  text: string
  value: keyof TableMap
}

const WIDTH = 600
const HEIGHT = 300

export default Vue.extend({
  name: 'MapsOverview',

  created () {
    store.dispatch.maps.load()
  },

  mounted () {
    this.map = this.$leaflet.map('invisibleMap', { center: [0, 0], zoom: 1 })
    this.map.getSize = () => this.$leaflet.point(WIDTH, HEIGHT)
  },

  data: () => ({
    isLoading: { name: '' as LoadingName, value: false },
    selected: [] as TableMap[],
    map: null as L.Map | null
  }),

  computed: {
    headers (): ITableHeader[] {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Group', value: 'group' },
        { text: 'Houses', value: 'houses' },
        { text: 'Flats', value: 'flats' },
        { text: 'Businesses', value: 'businesses' },
        { text: 'Inaccessible', value: 'inaccessible' },
        { text: 'DNCs', value: 'dncCount' },
        { text: 'Submaps', value: 'submapCount' }
      ]
    },
    items (): TableMap[] {
      return store.state.maps.list.map(m => {
        const dncCount = m.dncs ? m.dncs.length : 0
        const submapCount = m.submaps ? m.submaps.length : 0
        return { ...m, dncCount, submapCount }
      })
    },
    loading (): boolean {
      return store.state.maps.loading
    }
  },

  methods: {
    startLoading (name: LoadingName) {
      this.isLoading.name = name
      this.isLoading.value = true
    },
    resetLoading () {
      this.isLoading.name = ''
      this.isLoading.value = false
    },
    loadImage (): Promise<{ el: HTMLImageElement, bounds: L.LatLngBounds}> {
      const el = new Image()
      const bounds = new this.$leaflet.Polygon([store.state.territory.overlay.bounds || store.state.territory.points]).getBounds()
      el.crossOrigin = ''
      el.src = store.state.territory.overlay.src
      return new Promise(resolve => {
        el.onload = () => {
          resolve({ el, bounds })
        }
      })
    },
    saveCanvas (canvas: HTMLCanvasElement): Promise<void> {
      return new Promise(resolve => {
        const downloadLink = this.$refs.downloadLink as HTMLAnchorElement
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob)
          downloadLink.setAttribute('href', url)
          downloadLink.click()
          resolve()
        })
      })
    },
    async onRecalculate (): Promise<void> {
      this.startLoading('recalculate')
      if (!confirm('Are you sure you want to recalculate all maps? This could take a few seconds.')) return
      try {
        await store.dispatch.maps.recalculate()
        this.$notification({ type: 'success', text: 'All maps have been recalculated.' })
      } catch {
        this.$notification({ type: 'error', text: 'Could not recalculate all maps.' })
      } finally {
        this.resetLoading()
      }
    },
    async onPrint (): Promise<void> {
      if (!this.selected.length) return
      this.startLoading('print')
      try {
        // create virtual canvas & map
        const map = this.map as L.Map
        const canvas = document.createElement('canvas')
        canvas.width = WIDTH
        canvas.height = HEIGHT
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 5

        // load image
        const imageProps = await this.loadImage()
        for (const selection of this.selected) {
          ctx.clearRect(0, 0, WIDTH, HEIGHT)
          const bounds = new this.$leaflet.Polygon([selection.bounds]).getBounds()
          // if the view isn't reset the bounds don't seem to update
          map.setView([0, 0], 1)
          map.fitBounds(bounds)

          // draw image
          const imgBounds = new this.$leaflet.Bounds(
            map.latLngToLayerPoint(imageProps.bounds.getNorthWest()),
            map.latLngToLayerPoint(imageProps.bounds.getSouthEast())
          )
          if (!imgBounds.min) throw new Error('Could not get image bounds.')
          const { x, y } = imgBounds.min
          const imgSize = imgBounds.getSize()
          ctx.drawImage(imageProps.el, x, y, imgSize.x, imgSize.y)

          // draw territory outline
          const drawPoints = selection.bounds.map(b => map.latLngToLayerPoint(b))
          ctx.beginPath()
          drawPoints.forEach(({ x, y }, i) => {
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          })
          ctx.lineTo(drawPoints[0].x, drawPoints[0].y)
          ctx.stroke()

          // export
          await this.saveCanvas(canvas)
        }
      } catch (err) {
        console.error(err)
        this.$notification({ type: 'error', text: 'Could not print selected maps.' })
      } finally {
        this.resetLoading()
      }
    }
  }
})
</script>
