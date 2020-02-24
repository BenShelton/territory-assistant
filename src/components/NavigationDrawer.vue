<template>
  <v-navigation-drawer v-model="drawer" app stateless>
    <v-toolbar>
      <v-btn icon @click="closeDrawer">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Navigation</v-toolbar-title>
    </v-toolbar>
    <v-list
      v-for="list of navLists"
      :key="list.subheader"
      nav
      subheader
    >
      <v-subheader v-text="list.subheader" />
      <v-list-item v-for="item of list.items" :key="item.title" :to="item.to">
        <v-list-item-icon>
          <v-icon v-text="item.icon" />
        </v-list-item-icon>
        <v-list-item-title v-text="item.title" />
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list nav>
        <v-divider />
        <v-list-item to="/settings">
          <v-list-item-icon>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

interface INavList {
  subheader: string
  items: {
    to: string
    icon: string
    title: string
  }[]
}

export default Vue.extend({
  name: 'NavigationDrawer',

  computed: {
    drawer: {
      get (): boolean {
        return store.state.drawer.open
      },
      set (val: boolean): void {
        store.commit.drawer.setDrawer(val)
      }
    },
    navLists (): INavList[] {
      return [
        {
          subheader: 'Overview',
          items: [
            { to: '/', icon: 'mdi-home', title: 'Home' },
            { to: '/territory-overview', icon: 'mdi-map', title: 'Territory' }
          ]
        },
        {
          subheader: 'Editors',
          items: [
            { to: '/territory', icon: 'mdi-map', title: 'Territory' },
            { to: '/image', icon: 'mdi-image', title: 'Image' },
            { to: '/maps', icon: 'mdi-map-search', title: 'Maps' },
            { to: '/info', icon: 'mdi-map-marker', title: 'Info' }
          ]
        }
      ]
    }
  },

  watch: {
    '$route.name' () {
      store.commit.drawer.setDrawer(false)
    }
  },

  methods: {
    closeDrawer (): void {
      this.drawer = false
    },
    async logout (): Promise<void> {
      await store.dispatch.auth.logout()
      this.$router.push('/login')
    }
  }
})
</script>
