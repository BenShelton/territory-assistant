import { IPoint } from 'types'

export function isObject (obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && !Array.isArray(obj) && !!obj
}

export function isPointList (obj: unknown): obj is IPoint[] {
  if (!Array.isArray(obj)) return false
  const basePoint: IPoint = { lat: 0, lng: 0 }
  return Object.entries(basePoint)
    .every(([k, v]) => {
      return obj.every(p => {
        if (!isObject(p)) return false
        return typeof p[k] === typeof v
      })
    })
}
