export interface ISettings {
  src: string
}

export type SettingName = keyof ISettings

export interface ISettingsListItem {
  _id: string
  key: SettingName
  value: string
}
