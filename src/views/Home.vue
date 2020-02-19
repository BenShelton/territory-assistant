<template>
  <v-container
    flex-column
    flex-nowrap
    align-start
    fill-height
  >
    <h1 class="headline mb-3">
      Welcome to Territory Assistant
    </h1>
    <TerritoryEditor
      :active-layers="['image', 'territory', 'maps', 'info']"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import TerritoryEditor from '@/components/TerritoryEditor.vue'

export default Vue.extend({
  name: 'Home',

  components: {
    TerritoryEditor
  }
})
</script>
