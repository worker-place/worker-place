declare module 'pngjs/browser' {
  export interface PNGData {
    data: Uint8Array
    height: number
    width: number
  }
  export class PNG {
    parse(data: ArrayBuffer, callback: (error: Error, data: PNGData) => void): void
  }
}

interface HeartEnvironment {
  ACCESSORY: Fetcher
  ACCESSORY_SERVICE_ID: string
  ACCESSORY_TOKEN: string
  PLACE: DurableObjectNamespace
  SESSION_TOKENS: KVNamespace
}
