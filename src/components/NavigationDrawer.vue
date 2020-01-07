<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-toolbar>
      <v-btn icon @click="closeDrawer">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Navigation</v-toolbar-title>
    </v-toolbar>
    <v-list nav>
      <v-list-item v-for="item of navItems" :key="item.title" :to="item.to">
        <v-list-item-icon>
          <v-icon v-text="item.icon" />
        </v-list-item-icon>
        <v-list-item-title v-text="item.title" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

export default Vue.extend({
  name: 'NavigationDrawer',

  computed: {
    drawer: {
      get (): boolean {
        return store.state.drawer.open
      },
      set (val: boolean): void {
        store.commit('drawer/setDrawer', val)
      }
    },
    navItems (): { to: string, icon: string, title: string }[] {
      return [
        { to: '/', icon: 'mdi-home', title: 'Home' },
        { to: '/maps', icon: 'mdi-map-search', title: 'Maps' },
        { to: '/info', icon: 'mdi-map-marker', title: 'Info' },
        { to: '/settings', icon: 'mdi-settings', title: 'Settings' }
      ]
    }
  },

  methods: {
    closeDrawer (): void {
      this.drawer = false
    }
  }
})
</script>
