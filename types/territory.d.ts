export type IInfoTypes = ['Houses', 'Flats', 'Comment', 'Todo']
export type IInfoType = IInfoTypes[number]

export interface IInfoText {
  _id?: string
  content: string
  lat: number
  lng: number
  type: IInfoType
}
