<template>
  <v-container
    flex-column
    flex-nowrap
    align-start
    fill-height
  >
    <h1 class="headline mb-3">
      Edit Information Markers
    </h1>
    <TerritoryEditor
      edit-layer="info"
      :toggle-layers="['territory', 'map']"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import TerritoryEditor from '@/components/TerritoryEditor.vue'

export default Vue.extend({
  name: 'Info',

  components: {
    TerritoryEditor
  }
})
</script>
