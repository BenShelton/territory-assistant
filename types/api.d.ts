import { IBoundaryText } from './territory'
import { ISettings, ILoginRequest, ILoginResponse } from 'types'
import { UpdatedSettings } from './settings'

export namespace API {
  export namespace Auth {
    export namespace Login {
      export type Request = ILoginRequest
      export type Response = ILoginResponse
    }

    export namespace Logout {
      export type Request = void
      export type Response = true
    }
  }

  export namespace Settings {
    export namespace Load {
      export type Request = void
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
    export namespace AddInfo {
      export type Request = IBoundaryText
      export type Response = IBoundaryText
    }

    export namespace UpdateInfo {
      export type Request = IBoundaryText
      export type Response = IBoundaryText
    }

    export namespace DeleteInfo {
      export type Request = string
      export type Response = true
    }
  }
}
