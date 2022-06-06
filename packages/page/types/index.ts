export interface User {
  avatar?: string
  id: string
  squadId?: string
  username: string
}

export interface Squad {
  id: string
  memberCount: number
  name: string
  nextPixel: number
  owner: string
  target: {
    height: number
    left: number
    target: Uint8Array
    top: number
    width: number
  }
}
