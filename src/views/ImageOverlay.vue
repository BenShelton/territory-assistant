<template>
  <v-container
    flex-column
    flex-nowrap
    align-start
    fill-height
  >
    <h1 class="headline mb-3">
      Edit Image
    </h1>
    <p>Note: To change the image go to settings</p>
    <TerritoryEditor
      edit-layer="image"
      :toggle-layers="['territory']"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import TerritoryEditor from '@/components/TerritoryEditor.vue'

export default Vue.extend({
  name: 'ImageOverlay',

  components: {
    TerritoryEditor
  }
})
</script>
