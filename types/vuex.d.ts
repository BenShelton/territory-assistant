import { IMap, INotification, ISettings, IBoundaryText } from 'types'

export interface IDrawerState {
  open: boolean
}

export interface IMapState {
  list: IMap[]
  loading: boolean
}

export interface INotificationState {
  list: INotification[]
}

export type ISettingsState = ISettings

export interface ITerritoryState {
  info: IBoundaryText[]
  loading: boolean
}

export interface IRootState {
  drawer: IDrawerState
  map: IMapState
  notification: INotificationState
  settings: ISettingsState
  territory: ITerritoryState
}
