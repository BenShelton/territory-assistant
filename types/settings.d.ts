export type ValidSettings = ['src', 'centerLat', 'centerLng', 'defaultZoom']

export type SettingName = ValidSettings[number]

export type ISettings = Record<SettingName, string>

export interface ISettingsListItem {
  _id: string
  key: SettingName
  value: string
}

export type UpdatedSettings = { key: SettingName, value: string }[]
