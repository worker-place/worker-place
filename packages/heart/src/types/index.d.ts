declare module 'pngjs/browser' {
  export class PNG {
    parse(data: ArrayBuffer, callback: (error: Error, data: { data: Uint8Array }) => void): void
  }
}

interface HeartEnvironment {
  ACCESSORY: Fetcher
  ACCESSORY_SERVICE_ID: string
  ACCESSORY_TOKEN: string
  PLACE: DurableObjectNamespace
  SESSION_TOKENS: KVNamespace
}
