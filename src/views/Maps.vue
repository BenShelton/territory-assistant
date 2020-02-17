<template>
  <v-container>
    <h1 class="headline mb-3">
      Maps
    </h1>
    <v-btn color="primary" @click="onAdd">
      <v-icon left>
        mdi-plus
      </v-icon>
      ADD NEW MAP
    </v-btn>
    <v-row wrap>
      <v-col>
        <MapPreview
          v-for="map of maps"
          :key="map._id"
          :map="map"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

import { IMap } from 'types'

export default Vue.extend({
  name: 'Maps',

  computed: {
    maps (): IMap[] {
      return store.state.maps.list
    }
  },

  methods: {
    onAdd (): void {
      this.$router.push('/maps/add')
    }
  }
})
</script>
