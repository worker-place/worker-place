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
}
