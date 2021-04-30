import { IInfoText, IMap } from 'types'
import { ISubmap } from './map'

declare module 'leaflet' {
  interface CircleMarkerOptions {
    prevInfoText: IInfoText
  }
  interface Polygon {
    options: PolylineOptions & { prevMap: IMap | ISubmap }
  }
  function polygon (latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options?: PolylineOptions & { prevMap: IMap | ISubmap }): Polygon
}
