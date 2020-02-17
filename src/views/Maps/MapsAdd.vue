<template>
  <v-container
    flex-column
    flex-nowrap
    align-start
    fill-height
  >
    <h1 class="headline mb-3">
      Add New Map
    </h1>
    <MapEditor @save="onSave" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import MapEditor from '@/components/MapEditor.vue'

import store from '@/store'

import { IMap } from 'types'

export default Vue.extend({
  name: 'MapsAdd',

  components: {
    MapEditor
  },

  methods: {
    onSave (map: IMap): void {
      store.dispatch.maps.add(map)
    }
  }
})
</script>
