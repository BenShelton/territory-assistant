export interface IMap {
  id: string
  name: string
  subTerritories: ISubMap[]
}

export interface ISubMap {
  title: string
  doNotCalls: string[]
}
