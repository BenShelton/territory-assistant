<template>
  <div class="fill-height d-flex flex-column">
    <v-toolbar class="editor-toolbar shrink">
      <v-toolbar-title>Information Editor</v-toolbar-title>
      <v-spacer />
      <v-switch
        v-model="debug"
        hide-details
        label="Debug"
        @change="draw"
      />
      <v-card outlined class="mx-3">
        <v-btn icon :disabled="zoom <= zoomLimits.min" @click="onZoom(-10)">
          <v-icon>mdi-magnify-minus-outline</v-icon>
        </v-btn>
        <span class="grey--text text--darken-1">{{ zoom }}%</span>
        <v-btn icon :disabled="zoom >= zoomLimits.max" @click="onZoom(10)">
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </v-btn>
      </v-card>
      <v-btn color="primary" @click="addText">
        ADD TEXT
      </v-btn>
      <v-btn class="ml-3 mr-n1" color="green" @click="onSave">
        <v-icon left>
          mdi-content-save
        </v-icon>
        Save
      </v-btn>
      <v-btn class="ml-3 mr-n1" icon @click="onClose">
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="canvas-area">
      <v-overlay v-if="loading" absolute>
        <v-progress-circular indeterminate />
      </v-overlay>
      <canvas
        ref="canvas"
        @mousedown="onMousedown"
        @mouseup="onMouseup"
        @mouseleave="onMouseup"
        @mousemove="onMousemove"
        @contextmenu.prevent
      />
      <v-card v-if="selectedItem" class="item-menu">
        <v-card-text>
          <v-text-field v-model="selectedItem.content" label="Content" @input="draw" />
        </v-card-text>
      </v-card>
      <v-card v-if="debug" class="debug-menu">
        <v-card-title>Debug</v-card-title>
        <v-card-text>
          <p>Offset: {{ offset }}</p>
          <p>Mouse: {{ mousePos }}</p>
          <p>Dragging: <v-icon :color="dragging ? 'green' : 'red'" v-text="dragging ? 'mdi-check' : 'mdi-close'" /></p>
          <p>Selected: {{ selectedItem || 'N/A' }}</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { IBoundaryText } from 'types'

export default Vue.extend({
  name: 'InformationEditor',

  mounted () {
    this.initialise()
  },

  data: () => ({
    debug: false,
    loading: true,
    img: null as HTMLImageElement | null,
    texts: [] as IBoundaryText[],
    zoom: 50, // percentage
    offset: { x: 0, y: 0 },
    dragging: false,
    dragPos: { x: 0, y: 0 },
    mousePos: { x: 0, y: 0 },
    selectedItem: null as IBoundaryText | null
  }),

  computed: {
    zoomLimits (): { min: number, max: number } {
      return { min: 10, max: 200 }
    },
    scale (): number {
      return this.zoom / 100
    },
    canvas (): HTMLCanvasElement {
      return this.$refs.canvas as HTMLCanvasElement
    },
    ctx (): CanvasRenderingContext2D {
      return this.canvas.getContext('2d') as CanvasRenderingContext2D
    }
  },

  methods: {
    initialise (): void {
      this.img = new Image()
      this.img.onload = () => {
        this.draw()
        this.loading = false
      }
      this.img.src = this.$store.state.territory.src
    },
    draw (): void {
      const { canvas, ctx } = this
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = width
      canvas.height = height
      ctx.scale(this.scale, this.scale)
      ctx.translate(-this.offset.x, -this.offset.y)
      if (this.img) ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height)
      ctx.textBaseline = 'top'
      ctx.font = '32px bold Roboto'
      for (const text of this.texts) {
        const { x, y, w, h } = this.getTextHitbox(text)
        ctx.fillStyle = 'yellow'
        ctx.fillRect(x, y, w, h)
        if (this.selectedItem === text) {
          ctx.lineWidth = 3
          ctx.strokeStyle = 'black'
          ctx.setLineDash([12, 6])
          ctx.strokeRect(x, y, w, h)
        }
        ctx.fillStyle = 'black'
        ctx.fillText(text.content, text.x, text.y)
      }
      if (this.debug) {
        ctx.fillStyle = 'red'
        ctx.arc(this.mousePos.x, this.mousePos.y, 8 / this.scale, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    addText (): void {
      this.texts.push({
        content: `Text ${this.texts.length + 1}`,
        x: this.offset.x + 30,
        y: this.offset.y + 30
      })
      this.draw()
    },
    getTextHitbox (text: IBoundaryText): { x: number, y: number, w: number, h: number } {
      const padding = 4
      const { x, y, content } = text
      const w = Math.round(this.ctx.measureText(content).width)
      return { x: x - padding, y: y - padding, w: w + padding * 2, h: 32 + padding * 2 }
    },
    updateMousePos (e: MouseEvent): void {
      const { x, y } = e
      this.dragPos = { x, y }
      const { left, top } = this.canvas.getBoundingClientRect()
      this.mousePos.x = Math.round(this.offset.x + ((x - left) / this.scale))
      this.mousePos.y = Math.round(this.offset.y + ((y - top) / this.scale))
    },
    updateSelectedItem (): void {
      const { x, y } = this.mousePos
      for (let i = this.texts.length - 1; i >= 0; i--) {
        const text = this.texts[i]
        const hitbox = this.getTextHitbox(text)
        if (
          x >= hitbox.x &&
          x <= hitbox.x + hitbox.w &&
          y >= hitbox.y &&
          y <= hitbox.y + hitbox.h
        ) {
          this.selectedItem = text
          return
        }
      }
      this.selectedItem = null
    },
    onMousedown (e: MouseEvent): void {
      this.dragging = true
      this.updateMousePos(e)
      this.updateSelectedItem()
      this.draw()
    },
    onMouseup (): void {
      this.dragging = false
    },
    onMousemove (e: MouseEvent): void {
      const { x, y } = e
      const delta = {
        x: Math.round((this.dragPos.x - x) / this.scale),
        y: Math.round((this.dragPos.y - y) / this.scale)
      }
      this.updateMousePos(e)
      if (this.dragging) {
        if (this.selectedItem) {
          this.selectedItem.x -= delta.x
          this.selectedItem.y -= delta.y
        } else {
          this.offset.x += delta.x
          this.offset.y += delta.y
        }
        this.draw()
      } else if (this.debug) {
        this.draw()
      }
    },
    onZoom (delta: number) {
      this.zoom += delta
      const { min, max } = this.zoomLimits
      if (this.zoom < min) this.zoom = min
      if (this.zoom > max) this.zoom = max
      this.draw()
    },
    onSave (): void {
      this.$emit('close')
    },
    onClose (): void {
      if (!confirm('Are you sure you want to close? All changes will be lost!')) return
      this.$emit('close')
    }
  }
})
</script>

<style lang="sass" scoped>
.editor-toolbar
  z-index: 1
.canvas-area
  position: relative
  height: calc(100% - 64px)
canvas
  padding: 0
  margin: 0
  width: 100%
  height: 100%
.item-menu
  position: absolute
  bottom: 12px
  right: 12px
.debug-menu
  position: absolute
  top: 12px
  right: 12px
  z-index: 1000
</style>
