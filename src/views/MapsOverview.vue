<template>
  <v-container>
    <h1 class="headline mb-3">
      Maps Overview
    </h1>
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
  }
})
</script>
