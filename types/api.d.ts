import { IInfoText } from './territory'
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

  export namespace Info {
    export namespace List {
      export type Response = IInfoText[]
    }
    export namespace Add {
      export type Request = IInfoText
      export type Response = IInfoText
    }

    export namespace Update {
      export type Request = IInfoText
      export type Response = IInfoText
    }

    export namespace Delete {
      export type Request = string
      export type Response = true
    }
  }
}
