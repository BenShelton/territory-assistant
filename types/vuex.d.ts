import { IMap, INotification, ISettings, IInfoText } from 'types'

export interface IAuthState {
  token: string
}

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

export interface IInfoState {
  texts: IInfoText[]
  loading: boolean
}

export interface IRootState {
  auth: IAuthState
  drawer: IDrawerState
  info: IInfoState
  map: IMapState
  notification: INotificationState
  settings: ISettingsState
}
