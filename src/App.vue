<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-content>
      <router-view />
    </v-content>
    <Notification />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

import AppBar from '@/components/AppBar.vue'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import Notification from '@/components/Notification.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AppBar,
    NavigationDrawer,
    Notification
  }
})
</script>

<style lang="sass">
canvas
  padding: 0
  margin: 0
  width: 100%
  height: 100%
</style>
