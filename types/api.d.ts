import { IBoundaryText } from './territory'
import { ISettings } from 'types'

export namespace API {
  export namespace Settings {
    export namespace Load {
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
