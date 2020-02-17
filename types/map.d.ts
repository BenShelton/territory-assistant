import { IPoint } from './territory'

export interface IMap {
  _id?: string
  name: string
  group: string
  bounds: IPoint[]
  dncs: string[]
}
