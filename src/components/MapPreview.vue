<template>
  <v-card>
    <v-card-title v-text="map.name" />
    <v-card-text>
      <p>Houses: 0</p>
    </v-card-text>
    <v-card-actions>
      <v-btn>EDIT</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { IMap } from 'types'

export default Vue.extend({
  name: 'MapPreview',

  props: {
    map: { type: Object as PropType<IMap>, required: true }
  }
})
</script>
