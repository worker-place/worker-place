import { comet, Method, useComet } from '@neoaren/comet'
import { PNG } from 'pngjs/browser'
import { getAccessTokenFromTemporaryCode, getUserDataFromAccessToken } from './utils/github'
import { hashNtimes, getRandomValue } from './utils/crypto'


useComet<unknown, { image: File }>({
  method: Method.POST,
  pathname: '/api'
}, async event => {
  const png = new PNG()
  const raw = await event.body.image.arrayBuffer()
  const data = await new Promise<Uint8Array>((resolve, reject) => {
    png.parse(raw, (error, data) => {
      if (error) return reject(error)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return resolve(data.data as Uint8Array)
    })
  })
  console.log('data', data)
  return event.reply.ok({ message: 'Hello, Comet!' })
})

useComet<HeartEnvironment, { code: string }>({
  method: Method.POST,
  pathname: '/api/login'
}, async event => {
  console.log(event.cookies.values())
  const accessToken = await getAccessTokenFromTemporaryCode(event.body.code, event.env)
  if (!accessToken) return event.reply.badRequest({ message: 'Invalid temporary code' })
  const user = await getUserDataFromAccessToken(accessToken)
  if (!user) return event.reply.internalServerError({ message: 'Invalid access token' })
  console.log('user', user)
  const value = getRandomValue()
  const hash = await hashNtimes(value, 64)
  const tokenWithValue = `wp_${user.id}_${value}`
  const tokenWithHash = `wp_${user.id}_${hash}`
  event.env.SESSION_TOKENS.put(tokenWithHash, '', { expirationTtl: 30 * 24 * 60 * 60 })
  event.reply.cookies.set('worker_place_auth', tokenWithValue, { httpOnly: true, secure: true, sameSite: 'Strict' })
  return event.reply.ok()
})

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
