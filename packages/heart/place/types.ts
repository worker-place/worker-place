// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaceEnvironment {
  IMAGE: Uint8Array
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
