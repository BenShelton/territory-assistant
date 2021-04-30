<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
    <v-main>
      <router-view />
    </v-main>
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
