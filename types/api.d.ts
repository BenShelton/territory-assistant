import { IBoundaryText } from './territory'

export namespace API {
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
