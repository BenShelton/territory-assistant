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
      <v-img :src="territorySrc" />
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

  data: () => ({
    editKey: 0,
    editDialog: false,
    loading: false,
    saving: false
  }),

  computed: {
    territorySrc (): string {
      return this.$store.state.territory.src
    },
    buttons (): IButton[] {
      return [
        { text: 'TOGGLE INFO LAYER', icon: 'mdi-comment-eye', method: this.toggleInfo },
        { text: 'EDIT INFO LAYER', icon: 'mdi-comment-edit', method: this.editInfo }
      ]
    }
  },

  methods: {
    async toggleInfo (): Promise<void> {
      await this.loadInfo()
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
