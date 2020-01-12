export interface IBoundaryPoint {
  x: number
  y: number
  blank: boolean
}

export interface IBoundaryText {
  _id?: string
  content: string
  lat: number
  lng: number
}
