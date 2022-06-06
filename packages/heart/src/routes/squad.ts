import { Method, useComet } from '@neoaren/comet'
import { PNG, PNGData } from 'pngjs/browser'
import { Squad } from '../../place/types'
import { authentication } from '../middlewares/authentication'
import { fetchPlace } from '../utils/place'


// Get all squads
useComet<HeartEnvironment, unknown>({
  server: 'main',
  method: Method.GET,
  pathname: '/api/squad'
}, async event => {
  const result = await fetchPlace<{ squads: Squad[] }>(event.env, '/api/squad', 'GET')
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  return event.reply.ok({ squads: result.squads })
})

// Create a new squad
useComet<HeartEnvironment, { image: File; name: string; top: string; left: string }>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/squad',
  before: [ authentication ]
}, async event => {
  // @ts-expect-error Comet does not yet support custom extensions to events
  const userId = event.userId as string
  const png = new PNG()
  const raw = await event.body.image.arrayBuffer()
  if (raw.byteLength > 1024 * 1024) return event.reply.badRequest({ error: 'The target is too large' })
  const { data, height, width } = await new Promise<PNGData>((resolve, reject) => {
    png.parse(raw, (error, result) => error ? reject(error) : resolve(result))
  })
  const dataWithoutAlpha = new Uint8Array(width * height * 3)
  let j = 0
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      dataWithoutAlpha[j++] = 4
      dataWithoutAlpha[j++] = 4
      dataWithoutAlpha[j++] = 4
    } else if (data[i] === 4 && data[i + 1] === 4 && data[i + 2] === 4) {
      dataWithoutAlpha[j++] = 3
      dataWithoutAlpha[j++] = 3
      dataWithoutAlpha[j++] = 3
    } else {
      dataWithoutAlpha[j++] = data[i]
      dataWithoutAlpha[j++] = data[i + 1]
      dataWithoutAlpha[j++] = data[i + 2]
    }
  }
  const squad: Squad = {
    id: crypto.randomUUID().replaceAll('-', ''),
    memberCount: 0,
    name: event.body.name,
    nextPixel: 0,
    owner: userId,
    target: {
      height,
      left: Number.parseInt(event.body.left),
      target: dataWithoutAlpha,
      top: Number.parseInt(event.body.top),
      width
    }
  }
  if (squad.target.width > 128) return event.reply.badRequest({ error: 'The target is too wide' })
  if (squad.target.height > 128) return event.reply.badRequest({ error: 'The target is too tall' })
  if (squad.target.top > 1024 - squad.target.height) return event.reply.badRequest({ error: 'The target is too far down' })
  if (squad.target.left > 1024 - squad.target.width) return event.reply.badRequest({ error: 'The target is too far right' })
  const result = await fetchPlace<{ squad: Squad }>(event.env, '/api/squad', 'POST', squad)
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  await event.env.SQUAD_IMAGES.put(squad.id, raw)
  return event.reply.ok({ squad: result.squad })
})

// Delete a squad
useComet<HeartEnvironment, unknown>({
  server: 'main',
  method: Method.DELETE,
  pathname: '/api/squad/:squadId',
  before: [ authentication ]
}, async event => {
  // @ts-expect-error Comet does not yet support custom extensions to events
  const userId = event.userId as string
  const path = `/api/squad/${event.params.squadId}`
  const result = await fetchPlace(event.env, path, 'DELETE', { userId })
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  return event.reply.ok()
})

// Join a squad
useComet<HeartEnvironment, unknown>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/squad/:squadId/join',
  before: [ authentication ]
}, async event => {
  // @ts-expect-error Comet does not yet support custom extensions to events
  const userId = event.userId as string
  const path = `/api/squad/${event.params.squadId}/join`
  const result = await fetchPlace(event.env, path, 'POST', { userId })
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  return event.reply.ok()
})

// Leave a squad
useComet<HeartEnvironment, unknown>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/squad/:squadId/leave',
  before: [ authentication ]
}, async event => {
  // @ts-expect-error Comet does not yet support custom extensions to events
  const userId = event.userId as string
  const path = `/api/squad/${event.params.squadId}/leave`
  const result = await fetchPlace(event.env, path, 'POST', { userId })
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  return event.reply.ok()
})

// Transfer ownership of a squad
useComet<HeartEnvironment, { to: string }>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/squad/:squadId/transfer',
  before: [ authentication ]
}, async event => {
  // @ts-expect-error Comet does not yet support custom extensions to events
  const userId = event.userId as string
  const path = `/api/squad/${event.params.squadId}/transfer`
  const result = await fetchPlace(event.env, path, 'POST', { userId, to: event.body.to })
  if (result.error) return event.reply.custom(result.status, { error: result.error })
  return event.reply.ok()
})
