<template>
  <v-container>
    <h1 class="headline mb-3">
      Settings
    </h1>
    <v-row align="center">
      <v-col cols="3">
        <span class="title">Image Overlay URL</span>
      </v-col>
      <v-col cols="9">
        <v-text-field v-model="overlaySrc" />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-btn
        color="green white--text"
        :disabled="saving || !settingChanged"
        :loading="saving"
        @click="onSave"
      >
        <v-icon left>
          mdi-content-save
        </v-icon>
        SAVE
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

export default Vue.extend({
  name: 'Settings',

  created () {
    this.overlaySrc = store.state.territory.overlay.src
  },

  data: () => ({
    overlaySrc: '',
    saving: false
  }),

  computed: {
    settingChanged (): boolean {
      return this.overlaySrc !== store.state.territory.overlay.src
    }
  },

  methods: {
    async onSave (): Promise<void> {
      if (!this.settingChanged || this.saving) return
      this.saving = true
      try {
        await store.dispatch.territory.updateOverlay({ src: this.overlaySrc })
        this.$notification({ text: 'Settings have been saved', type: 'success' })
      } catch (err) {
        console.error(err)
        this.$notification({ text: 'Could not update settings', type: 'error' })
      } finally {
        this.saving = false
      }
    }
  }
})
</script>
