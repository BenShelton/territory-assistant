export interface IBoundaryPoint {
  x: number
  y: number
  blank: boolean
}

export interface IBoundaryText {
  content: string
  x: number
  y: number
}

export interface ITerritory {
  id: string
  name: string
  outline: IBoundaryPoint[]
  subTerritories: ISubTerritory[]
}

export interface ISubTerritory {
  title: string
  highlight: IBoundaryPoint[]
  doNotCalls: string[]
}
