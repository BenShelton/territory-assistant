<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

import AppBar from '@/components/AppBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AppBar,
    NavigationDrawer
  }
})
</script>
