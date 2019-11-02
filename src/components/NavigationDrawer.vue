<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-toolbar>
      <v-btn icon @click="closeDrawer">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Navigation</v-toolbar-title>
    </v-toolbar>
    <v-list nav>
      <v-list-item to="/">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-item to="/maps">
        <v-list-item-icon>
          <v-icon>mdi-map-search</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Maps</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NavigationDrawer',

  computed: {
    drawer: {
      get (): boolean {
        return this.$store.state.drawer.open
      },
      set (val: boolean): void {
        this.$store.commit('drawer/setDrawer', val)
      }
    }
  },

  methods: {
    closeDrawer (): void {
      this.drawer = false
    }
  }
})
</script>
