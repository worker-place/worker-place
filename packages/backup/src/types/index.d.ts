declare module 'pngjs/browser' {
  export interface PNGData {
    data: Uint8Array
    height: number
    width: number
  }

  export class PNG {
    data: ArrayBuffer
    end(data: ArrayBuffer): PNG
    pack(): PNG
  }
}

interface BackupEnvironment {
  BACKUP: R2Bucket
  SNAPSHOTS: KVNamespace
}
