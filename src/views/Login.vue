<template>
  <v-container>
    <h1 class="headline mb-3">
      Login
    </h1>
    <v-card max-width="300">
      <v-card-title class="text-center">
        Please enter the password to continue
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="password"
          label="Password"
          :type="visible ? 'text' : 'password'"
          :append-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="toggleVisible"
          @keydown.enter="onLogin"
        />
        <v-btn
          block
          color="primary"
          :loading="loading"
          :disabled="loading || !password"
          @click="onLogin"
        >
          LOGIN
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import store from '@/store'

export default Vue.extend({
  name: 'Login',

  data: () => ({
    password: '',
    visible: false,
    loading: false
  }),

  methods: {
    toggleVisible (): void {
      this.visible = !this.visible
    },
    async onLogin (): Promise<void> {
      if (!this.password) return
      this.loading = true
      try {
        await store.dispatch('auth/login', this.password)
        this.$notification({ type: 'success', text: 'Logged in' })
        this.$router.push('/')
      } catch {
        this.$notification({ type: 'error', text: 'Incorrect Password' })
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
