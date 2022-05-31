import { comet } from '@neoaren/comet'
import { PlaceEnvironment } from './types'

import update from './update'


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

    if (this.state.storage.getAlarm() === null) {
      const date = Date.now()
      this.state.storage.setAlarm(date)
      this.state.storage.put('next_alarm_date', date)
    }
  }

  async alarm() {
    await update(this.state, { ...this.env, ...this.mem })

    const alarm = await this.state.storage.get('next_alarm_date') as number ?? Date.now()

    this.state.storage.setAlarm(alarm + 1000 * 20)
    this.state.storage.put('next_alarm_date', alarm + 1000 * 20)

    // todo save current image

    this.mem.SESSIONS?.forEach(session => {
      session.send(this.mem.IMAGE!)
    })
  }

  async fetch(request: Request): Promise<Response> {
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

    return new Response(null, { status: 101, webSocket: session[0] })
  }
}
