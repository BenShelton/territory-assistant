import { IPoint } from './territory'

export interface IMap {
  _id?: string
  name: string
  group: string
  houses: number
  flats: number
  bounds: IPoint[]
  dncs: string[]
}
