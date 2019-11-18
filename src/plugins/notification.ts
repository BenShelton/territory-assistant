import Vue from 'vue'

import { INotificationOptions, INotification } from 'types/notification'

Vue.use({
  install (Vue) {
    let id = 1
    Vue.prototype.$notification = function (options: INotificationOptions) {
      const notificationId = id++
      const notification: INotification = {
        id: notificationId,
        text: options.text,
        type: options.type
      }
      this.$store.commit('notification/add', notification)
      setTimeout(() => {
        this.$store.commit('notification/remove', notificationId)
      }, options.timeout || 3000)
    }
  }
})
