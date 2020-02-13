import { ILoginRequest, ILoginResponse, ITerritory, IInfoText, IPoint } from 'types'

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

  export namespace Territory {
    export namespace Load {
      export type Request = void
      export type Response = ITerritory
    }

    export namespace UpdateOverlay {
      export type Request = Partial<ITerritory['overlay']>
      export type Response = ITerritory['overlay']
    }

    export namespace UpdatePoints {
      export type Request = IPoint[]
      export type Response = IPoint[]
    }
  }
}
