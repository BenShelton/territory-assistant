<template>
  <div>
    <v-row class="my-3">
      <v-col v-for="button of buttons" :key="button.text" align="center">
        <v-btn
          class="mx-3"
          color="primary"
          :disabled="loading"
          :loading="loading"
          @click="button.method"
        >
          <v-icon left v-text="button.icon" />
          {{ button.text }}
        </v-btn>
      </v-col>
    </v-row>
    <v-card>
      <canvas ref="canvas" :style="{ height: canvasHeight + 'px' }" />
    </v-card>
    <v-dialog v-model="editDialog" persistent :transition="false">
      <v-card height="90vh">
        <InformationEditor
          :key="editKey"
          :saving="saving"
          @close="closeEditor"
          @save="onSave"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import InformationEditor from '@/components/InformationEditor.vue'
import { IBoundaryText } from 'types'

interface IButton {
  text: string
  icon: string
  method: () => void
}

export default Vue.extend({
  name: 'TerritoryOverview',

  components: {
    InformationEditor
  },

  mounted () {
    this.img = new Image()
    this.img.onload = () => {
      this.draw()
    }
    this.img.src = this.$store.state.settings.src
  },

  data: () => ({
    img: null as HTMLImageElement | null,
    scale: 1,
    canvasHeight: 10,
    showInfo: false,
    editKey: 0,
    editDialog: false,
    loading: false,
    saving: false
  }),

  computed: {
    texts (): IBoundaryText[] {
      return this.$store.state.territory.info
    },
    buttons (): IButton[] {
      return [
        { text: 'TOGGLE INFO LAYER', icon: 'mdi-comment-eye', method: this.toggleInfo },
        { text: 'EDIT INFO LAYER', icon: 'mdi-comment-edit', method: this.editInfo }
      ]
    },
    canvas (): HTMLCanvasElement {
      return this.$refs.canvas as HTMLCanvasElement
    },
    ctx (): CanvasRenderingContext2D {
      return this.canvas.getContext('2d') as CanvasRenderingContext2D
    }
  },

  methods: {
    draw (): void {
      if (!this.img) return
      const { canvas, ctx } = this
      const { width } = canvas.getBoundingClientRect()
      const { naturalWidth, naturalHeight } = this.img
      this.scale = width / naturalWidth
      this.canvasHeight = naturalHeight * this.scale
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = width
      canvas.height = this.canvasHeight
      ctx.scale(this.scale, this.scale)
      ctx.drawImage(this.img, 0, 0, naturalWidth, naturalHeight)
      if (this.showInfo) {
        ctx.textBaseline = 'top'
        ctx.font = '32px bold Roboto'
        for (const text of this.texts) {
          const { x, y, w, h } = this.getTextHitbox(text)
          ctx.fillStyle = 'yellow'
          ctx.fillRect(x, y, w, h)
          ctx.fillStyle = 'black'
          ctx.fillText(text.content, text.x, text.y)
        }
      }
    },
    getTextHitbox (text: IBoundaryText): { x: number, y: number, w: number, h: number } {
      const padding = 4
      const { x, y, content } = text
      const w = Math.round(this.ctx.measureText(content).width)
      return { x: x - padding, y: y - padding, w: w + padding * 2, h: 32 + padding * 2 }
    },
    async toggleInfo (): Promise<void> {
      if (!this.showInfo) await this.loadInfo()
      this.showInfo = !this.showInfo
      this.draw()
    },
    async editInfo (): Promise<void> {
      const loaded = await this.loadInfo()
      if (loaded) {
        this.editKey = Date.now()
        this.editDialog = true
      }
    },
    async loadInfo (): Promise<boolean> {
      let loaded = false
      this.loading = true
      try {
        await this.$store.dispatch('territory/loadInfo')
        loaded = true
      } catch (err) {
        this.$notification({ text: 'Could not load territory information', type: 'error' })
      } finally {
        this.loading = false
      }
      return loaded
    },
    closeEditor (): void {
      this.editDialog = false
    },
    async onSave (texts: IBoundaryText[]): Promise<void> {
      this.saving = true
      try {
        await this.$store.dispatch('territory/updateInfo', texts)
        this.$notification({ text: 'Information Texts have been saved', type: 'success' })
        this.closeEditor()
      } catch (err) {
        this.$notification({ text: 'Could not update territory information', type: 'error' })
      } finally {
        this.saving = false
      }
    }
  }
})
</script>
