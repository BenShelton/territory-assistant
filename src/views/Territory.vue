<template>
  <v-container
    flex-column
    flex-nowrap
    align-start
    fill-height
  >
    <h1 class="headline mb-3">
      Edit Territory Boundary
    </h1>
    <TerritoryEditor
      edit-layer="territory"
      :toggle-layers="['image', 'info']"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import TerritoryEditor from '@/components/TerritoryEditor.vue'

export default Vue.extend({
  name: 'Territory',

  components: {
    TerritoryEditor
  }
})
</script>
