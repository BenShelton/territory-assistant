export type JWT = string

export interface IToken {
  _id: string
}

export interface ILoginRequest {
  password: string
}

export interface ILoginResponse {
  token: JWT
}
