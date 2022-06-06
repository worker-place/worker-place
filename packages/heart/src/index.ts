import { comet } from '@neoaren/comet'
import './routes/user'
import './routes/squad'


export default {
  async fetch(request: Request, env: HeartEnvironment, ctx: ExecutionContext): Promise<Response> {
    console.log(request.url)

    switch (new URL(request.url).pathname) {
      case '/api/connect':
        // eslint-disable-next-line no-case-declarations
        const id = env.PLACE.idFromName('worker-place')
        return env.PLACE.get(id).fetch(request)
    }

    return comet({ name: 'main', cors: { origins: '*', headers: '*', methods: '*' } })(request, env, ctx)
  }
}

export { Place } from '../place/Place'
