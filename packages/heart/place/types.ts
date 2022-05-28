export interface PlaceEnvironment {
  IMAGE: Uint8Array
  SESSIONS: WebSocket[]
}

export interface SquadTarget {
  height: number
  left: number
  target: Uint8Array
  top: number
  width: number
}

export interface SquadMeta {
  memberCount: number
  name: number
  nextPixel: number
}
