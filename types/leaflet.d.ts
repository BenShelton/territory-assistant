/* eslint-disable */
import { IInfoText } from 'types'
import * as L from 'leaflet'

declare module 'leaflet' {
  interface CircleMarkerOptions {
    prevInfoText: IInfoText
  }
}
