import { comet } from '@neoaren/comet'
import { PlaceEnvironment } from './types'
import update from './update'
import './routes/user'
import './routes/squad'


export class Place {
  state: DurableObjectState
  env: PlaceEnvironment
  mem: Partial<PlaceEnvironment>

  constructor(state: DurableObjectState, env: PlaceEnvironment) {
    this.state = state
    this.env = env
    this.mem = {
      IMAGE: new Uint8Array(1024 * 1024 * 3),
      SESSIONS: []
    }

    // todo retrieve saved image parts

    this.state.blockConcurrencyWhile(async () => {
      await this.loadImage()
      await this.setupAlarm()
    })
  }

  async loadImage() {
    for (let i = 0; i < 25; i++) {
      const piece = await this.state.storage.get<Uint8Array>(`stored_image_${i}`)
      if (!piece) {
        // deliberate overhead, max would be 128*1024
        this.mem.IMAGE?.fill(4, i * 128000, (i + 1) * 128000)
      } else {
        this.mem.IMAGE?.set(piece, i * 128000)
      }
    }
  }

  async saveImage() {
    const writes = []
    for (let i = 0; i < 25; i++) {
      const piece = this.mem.IMAGE?.subarray(i * 128000, (i + 1) * 128000)
      writes.push(this.state.storage.put(`stored_image_${i}`, piece))
    }
    await Promise.all(writes)
  }

  async setupAlarm() {
    console.log('Place setupAlarm called')
    if (await this.state.storage.getAlarm() === null) {
      const date = Date.now() + 1000
      await this.state.storage.setAlarm(date)
      await this.state.storage.put('next_alarm_date', date)
    }
  }

  async alarm() {
    console.log('Place alarm fired')

    await update(this.state, { ...this.env, ...this.mem })
    await this.saveImage()

    const alarm = await this.state.storage.get('next_alarm_date') as number ?? Date.now()

    await this.state.storage.setAlarm(alarm + 1000 * 20)
    await this.state.storage.put('next_alarm_date', alarm + 1000 * 20)

    // todo save current image

    this.mem.SESSIONS?.forEach(session => {
      session.send(this.mem.IMAGE!)
    })

    // TODO save this.mem.IMAGE to KV

    console.log('Place alarm done')
  }

  async fetch(request: Request): Promise<Response> {
    console.log('fetch', request.url)
    switch (new URL(request.url).pathname) {
      case '/api/connect':
        return this.connect(request)
    }

    return comet({
      name: 'place'
    })(request, { ...this.env, ...this.mem }, {
      waitUntil: this.state.waitUntil,
      passThroughOnException() {
        console.warn('context.passThroughOnException() is not supported in this environment')
      }
    }, this.state)
  }

  async connect(request: Request): Promise<Response> {
    const session = new WebSocketPair()
    session[1].accept()
    this.mem.SESSIONS?.push(session[1])

    session[1].addEventListener('close', async event => {
      this.mem.SESSIONS?.splice(this.mem.SESSIONS?.indexOf(session[1]), 1)
    })
    session[1].addEventListener('error', async event => {
      this.mem.SESSIONS?.splice(this.mem.SESSIONS?.indexOf(session[1]), 1)
    })
    session[1].addEventListener('message', async event => {
      if (event.data) {
        session[1].send(this.mem.IMAGE!)
      }
    })

    return new Response(null, { status: 101, webSocket: session[0] })
  }
}
