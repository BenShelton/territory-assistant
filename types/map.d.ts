import { IBoundaryPoint } from './territory'

export interface IMap {
  id: string
  name: string
  outline: IBoundaryPoint[]
  subTerritories: ISubMap[]
}

export interface ISubMap {
  title: string
  highlight: IBoundaryPoint[]
  doNotCalls: string[]
}
