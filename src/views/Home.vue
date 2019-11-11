<template>
  <v-container>
    <h1 class="headline">
      Welcome to Territory Assistant
    </h1>
    <TerritoryOverview />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import TerritoryOverview from '@/components/TerritoryOverview.vue'

export default Vue.extend({
  name: 'Home',

  components: {
    TerritoryOverview
  }
})
</script>
