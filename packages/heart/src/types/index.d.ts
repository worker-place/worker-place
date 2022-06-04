declare module 'pngjs/browser' {
  export class PNG {
    parse(data: ArrayBuffer, callback: (error: Error, data: ArrayBuffer) => void): void
  }
}

interface HeartEnvironment {
  ACCESSORY: Fetcher
  ACCESSORY_SERVICE_ID: string
  ACCESSORY_TOKEN: string

  PLACE: DurableObjectNamespace
}
