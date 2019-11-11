<template>
  <div>
    <v-row class="my-3">
      <v-col v-for="button of buttons" :key="button.text" align="center">
        <v-btn class="mx-3" color="primary" @click="button.method">
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
        <InformationEditor @close="closeEditor" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import InformationEditor from '@/components/InformationEditor.vue'

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
    editDialog: false
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
    toggleInfo (): void {

    },
    editInfo (): void {
      this.editDialog = true
    },
    closeEditor (): void {
      this.editDialog = false
    }
  }
})
</script>
