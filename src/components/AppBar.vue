<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="toggleDrawer" />
    <v-toolbar-title class="headline">
      <span>Territory Assistant</span>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

export default Vue.extend({
  name: 'AppBar',

  methods: {
    toggleDrawer (): void {
      store.commit('drawer/toggleDrawer')
    }
  }
})
</script>
