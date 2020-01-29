export type IInfoTypes = ['Houses', 'Flats', 'Comment', 'Todo']
export type IInfoType = IInfoTypes[number]

export interface ITerritory {
  overlay: {
    src: string
    center: {
      lat: number
      lng: number
    }
    scale: number
  }
  points: IPoint[]
}

export interface IInfoText {
  _id?: string
  content: string
  lat: number
  lng: number
  type: IInfoType
}

export interface IPoint {
  lat: number
  lng: number
}
