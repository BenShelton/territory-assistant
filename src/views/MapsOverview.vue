<template>
  <v-container>
    <h1 class="headline mb-3">
      Maps Overview
    </h1>
    <v-card class="my-5">
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="recalculating"
          :disabled="recalculating"
          @click="onRecalculate"
        >
          Recalculate All Maps
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-data-table
      class="elevation-1"
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

type TableMap = Omit<IMap, 'dncs'> & { dncs: number }
interface ITableHeader {
  text: string
  value: keyof TableMap
}

export default Vue.extend({
  name: 'MapsOverview',

  created () {
    store.dispatch.maps.load()
  },

  data: () => ({
    recalculating: false
  }),

  computed: {
    headers (): ITableHeader[] {
      return [
        { text: 'Map Name', value: 'name' },
        { text: 'Group', value: 'group' },
        { text: 'Houses', value: 'houses' },
        { text: 'Flats', value: 'flats' },
        { text: 'DNC Count', value: 'dncs' }
      ]
    },
    items (): TableMap[] {
      return store.state.maps.list.map(m => {
        const dncs = m.dncs ? m.dncs.length : 0
        return { ...m, dncs }
      })
    },
    loading (): boolean {
      return store.state.maps.loading
    }
  },

  methods: {
    async onRecalculate (): Promise<void> {
      if (!confirm('Are you sure you want to recalculate all maps? This could take a few seconds.')) return
      await store.dispatch.maps.recalculate()
      this.$notification({ type: 'success', text: 'All maps have been recalculated.' })
    }
  }
})
</script>
