import Vue from 'vue'
import Vuetify from 'vuetify'

import '@/plugins/leaflet'

require('jest-fetch-mock').enableMocks()

Vue.use(Vuetify)

Vue.prototype.$leaflet.Map.prototype._initContainer = jest.fn(function () {
  // @ts-ignore
  this._container = document.createElement('div')
})

Vue.prototype.$leaflet.EditToolbar = {
  Delete: { include: jest.fn() }
}

Vue.prototype.$leaflet.drawLocal = {
  draw: {
    toolbar: {
      buttons: {}
    },
    handlers: {
      circlemarker: { tooltip: { start: '' } },
      polygon: { tooltip: { start: '' } },
      rectangle: { tooltip: { start: '' } }
    }
  },
  edit: {
    toolbar: {
      buttons: {}
    },
    handlers: {
      edit: { tooltip: { start: '' } },
      remove: { tooltip: { start: '' } }
    }
  }
}

Vue.prototype.$leaflet.Draw = {
  Event: {
    CREATED: 'draw:created',
    DELETED: 'draw:deleted',
    DELETESTART: 'draw:deletestart',
    DELETESTOP: 'draw:deletestop',
    DRAWSTART: 'draw:drawstart',
    DRAWSTOP: 'draw:drawstop',
    DRAWVERTEX: 'draw:drawvertex',
    EDITED: 'draw:edited',
    EDITMOVE: 'draw:editmove',
    EDITRESIZE: 'draw:editresize',
    EDITSTART: 'draw:editstart',
    EDITSTOP: 'draw:editstop',
    EDITVERTEX: 'draw:editvertex',
    MARKERCONTEXT: 'draw:markercontext',
    TOOLBARCLOSED: 'draw:toolbarclosed',
    TOOLBAROPENED: 'draw:toolbaropened'
  }
}
