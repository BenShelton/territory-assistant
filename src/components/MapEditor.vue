<template>
  <v-container align-start fill-height>
    <v-row class="fill-height">
      <v-col cols="12" md="6">
        <h2>Map Info</h2>
        <v-text-field
          v-model="editMap.name"
          label="Name"
        />
        <v-text-field
          v-model="editMap.group"
          label="Group"
        />
        <v-btn
          :disabled="incomplete"
          @click="onSave"
        >
          SAVE
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <TerritoryEditor
          edit-layer="map"
          :toggle-layers="['image', 'territory', 'info']"
          @update:map="onUpdate"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import TerritoryEditor from '@/components/TerritoryEditor.vue'

import { IMap, IPoint } from 'types'

interface IData {
  editMap: IMap
}

export default Vue.extend({
  name: 'MapEditor',

  components: {
    TerritoryEditor
  },

  data: (): IData => ({
    editMap: {
      name: '',
      group: '',
      bounds: [],
      dncs: []
    }
  }),

  computed: {
    incomplete (): boolean {
      return !this.editMap.name ||
        !this.editMap.group ||
        !this.editMap.bounds.length
    }
  },

  methods: {
    onUpdate (bounds: IPoint[]): void {
      this.editMap.bounds = bounds
    },
    onSave (): void {
      this.$emit('save', this.editMap)
    }
  }
})
</script>
