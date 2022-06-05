import { PreMiddlewareEvent } from '@neoaren/comet'
import { hashNtimes } from '../utils/crypto'


export async function authentication(event: PreMiddlewareEvent<HeartEnvironment, unknown>) {
  const cookie = event.cookies.get('worker_place_auth')
  if (!cookie) {
    return event.reply.unauthorized({ error: 'Authorization token missing' })
  }
  const [ prefix, userId, token ] = cookie.split('_')
  if (prefix !== 'wp' || !userId || !token) {
    return event.reply.unauthorized({ error: 'Authorization token malformatted' })
  }
  const hash = await hashNtimes(token, 64)
  const result = await event.env.SESSION_TOKENS.get(`wp_${userId}_${hash}`)
  if (result === null) {
    return event.reply.unauthorized({ error: 'Authorization token invalid or expired' })
  }
  // @ts-expect-error Comet does not yet support custom extensions to events
  event.userId = userId
  return event.next()
}
