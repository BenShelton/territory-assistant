/* eslint-disable @typescript-eslint/interface-name-prefix */
import { IInfoText, IMap } from 'types'

declare module 'leaflet' {
  interface CircleMarkerOptions {
    prevInfoText: IInfoText
  }

  function polygon (latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions & { prevMap: IMap }): Polygon
  interface Polygon {
    options: PolylineOptions & { prevMap: IMap }
  }
}
