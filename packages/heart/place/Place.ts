import { PlaceEnvironment } from "./types"
import { comet } from '@neoaren/comet'

import update from './update'

export class Place {
  state: DurableObjectState
  env: PlaceEnvironment
  mem: Partial<PlaceEnvironment>

  constructor(state: DurableObjectState, env: PlaceEnvironment) {
    this.state = state
    this.env = env
    this.mem = {
      IMAGE: new Uint8Array(1024 * 1024 * 3)
    }

    // todo retrieve saved image parts

    if (this.state.storage.getAlarm() == null) {
      const date = Date.now()
      this.state.storage.setAlarm(date)
      this.state.storage.put('next_alarm_date', date)
    }
  }

  async alarm() {
    await update(this.state, {...this.env, ...this.mem})

    const alarm = await this.state.storage.get('next_alarm_date') as number ?? Date.now()

    this.state.storage.setAlarm(alarm + 1000 * 20)
    this.state.storage.put('next_alarm_date', alarm + 1000 * 20)

    // todo save current image
    // todo update all viewers
  }

  async fetch(request: Request): Promise<Response> {
    return comet({
      name: 'place'
    })(request, {...this.env, ...this.mem}, {
      waitUntil: this.state.waitUntil,
      passThroughOnException() {
        console.warn('context.passThroughOnException() is not supported in this environment')
      }
    }, this.state)
  }
}