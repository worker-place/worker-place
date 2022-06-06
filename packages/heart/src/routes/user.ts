import { Method, useComet } from '@neoaren/comet'
import { Squad, User } from '../../place/types'
import { authentication } from '../middlewares/authentication'
import { getAccessTokenFromTemporaryCode, getUserDataFromAccessToken } from '../utils/github'
import { getRandomValue, hashNtimes } from '../utils/crypto'
import { fetchPlace } from '../utils/place'


// Authenticate user
useComet<HeartEnvironment, { code: string }>({
  method: Method.POST,
  pathname: '/api/user/auth'
}, async event => {
  const accessToken = await getAccessTokenFromTemporaryCode(event.body.code, event.env)
  if (!accessToken) return event.reply.badRequest({ error: 'Invalid temporary code' })
  const user = await getUserDataFromAccessToken(accessToken)
  if (!user) return event.reply.internalServerError({ error: 'Invalid access token' })
  const result = await fetchPlace<{ user: User; squad: Squad }>(event.env, `/api/user/${user.id}`, 'POST', user)
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  const value = getRandomValue()
  const hash = await hashNtimes(value, 64)
  const tokenWithValue = `wp_${user.id}_${value}`
  const tokenWithHash = `wp_${user.id}_${hash}`
  await event.env.SESSION_TOKENS.put(tokenWithHash, '', { expirationTtl: 30 * 24 * 60 * 60 })
  event.reply.cookies.set('worker_place_auth', tokenWithValue, { httpOnly: true, secure: true, sameSite: 'Strict' })
  return event.reply.ok({ user: result.user, squad: result.squad })
})

// Get current user data
useComet<HeartEnvironment, unknown>({
  method: Method.GET,
  pathname: '/api/user/current',
  before: [ authentication ]
}, async event => {
  // @ts-expect-error Comet does not yet support custom extensions to events
  const userId = event.userId as string
  const result = await fetchPlace<{ user: User; squad: Squad }>(event.env, `/api/user/${userId}`, 'GET')
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  return event.reply.ok({ user: result.user, squad: result.squad })
})
