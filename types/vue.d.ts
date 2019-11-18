
/* eslint-disable */
// extends Vue with custom plugins
import Vue from 'vue'
import { INotificationOptions } from './notification'

declare module 'vue/types/vue' {
  interface Vue {
    $notification: (options: INotificationOptions) => void
  }
}
