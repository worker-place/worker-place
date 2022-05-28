declare module 'pngjs/browser' {
  export class PNG {
    parse(data: ArrayBuffer, callback: (error: Error, data: ArrayBuffer) => void): void
  }
}

interface HeartEnvironment {
  PLACE: DurableObjectNamespace
}
