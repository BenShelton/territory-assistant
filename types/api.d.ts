import { IBoundaryText } from './territory'
import { ISettings } from 'types'
import { UpdatedSettings } from './settings'

export namespace API {
  export namespace Settings {
    export namespace Load {
      export type Response = ISettings
    }
    export namespace Update {
      export type Request = UpdatedSettings
      export type Response = ISettings
    }
  }

  export namespace Territory {
    export namespace GetInfo {
      export type Response = IBoundaryText[]
    }
    export namespace UpdateInfo {
      export type Request = IBoundaryText[]
      export type Response = IBoundaryText[]
    }
  }
}
