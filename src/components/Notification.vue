<template>
  <div class="notifications-wrapper">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="notification of notifications"
        :key="notification.id"
        :min-width="300"
        :type="notification.type"
      >
        {{ notification.text }}
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { INotification } from 'types'

export default Vue.extend({
  name: 'Notification',

  computed: {
    notifications (): INotification[] {
      return this.$store.state.notification.list
    }
  }
})
</script>

<style lang="sass" scoped>
.notifications-wrapper
  position: fixed
  bottom: 5px
  right: 5px
  height: auto
  width: auto
</style>
