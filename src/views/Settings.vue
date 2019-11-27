<template>
  <v-container>
    <h1 class="headline mb-3">
      Settings
    </h1>
    <v-row v-for="setting of settingsList" :key="setting.key" align="center">
      <v-col cols="3">
        <span class="title" v-text="setting.name" />
      </v-col>
      <v-col cols="9">
        <v-text-field v-model="updateSettings[setting.key]" />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-btn
        color="green white--text"
        :disabled="saving || !updatedSettings.length"
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

import { ISettings, SettingName, UpdatedSettings } from 'types'

const settingNames: { [key in SettingName]: string } = {
  src: 'Image Source'
}

export default Vue.extend({
  name: 'Settings',

  mounted () {
    this.refreshSettings()
  },

  data: () => ({
    updateSettings: {} as unknown as ISettings,
    saving: false
  }),

  computed: {
    settings (): ISettings {
      return store.state.settings
    },
    settingsList (): { key: SettingName, name: string, value: string }[] {
      return Object.entries(this.settings)
        .map(([k, value]) => {
          const key: SettingName = k as SettingName
          const name = settingNames[key] || key
          return { key, name, value }
        })
        .sort((a, b) => a.key > b.key ? 1 : -1)
    },
    updatedSettings (): UpdatedSettings {
      return this.settingsList.reduce((acc: UpdatedSettings, s) => {
        const updatedValue = this.updateSettings[s.key]
        if (updatedValue !== s.value) acc.push({ key: s.key, value: updatedValue })
        return acc
      }, [])
    }
  },

  methods: {
    refreshSettings (): void {
      this.settingsList.forEach(s => {
        this.$set(this.updateSettings, s.key, s.value)
      })
    },
    async onSave (): Promise<void> {
      if (!this.updatedSettings.length || this.saving) return
      this.saving = true
      try {
        await store.dispatch('settings/update', this.updatedSettings)
        this.refreshSettings()
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
