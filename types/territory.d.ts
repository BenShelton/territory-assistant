export type IInfoTypes = ['Houses', 'Flats', 'Comment', 'Todo']
export type IInfoType = IInfoTypes[number]

export interface ITerritory {
  overlay: {
    src: string
    bounds: [IPoint, IPoint, IPoint, IPoint] | null
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
