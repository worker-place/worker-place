import { Method, useComet } from '@neoaren/comet'
import { PlaceEnvironment, Squad, User } from '../types'


// Get all squads
useComet<PlaceEnvironment, unknown>({
  server: 'place',
  method: Method.GET,
  pathname: '/api/squad'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const result = await event.state.storage.list<Squad>({ prefix: 'squad_' })
  const squads = [ ...result.values() ]
  return event.reply.ok({ squads })
})

// Create a new squad
useComet<PlaceEnvironment, Squad>({
  server: 'place',
  method: Method.POST,
  pathname: '/api/squad'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const squad = await event.state.storage.get<Squad>(`squad_${event.body.id}`)
  if (squad) return event.reply.conflict({ error: 'Squad already exists' })
  const user = await event.state.storage.get<User>(`user_${event.body.owner}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  if (user.squadId) return event.reply.forbidden({ error: 'User is already in a squad' })
  user.squadId = event.body.id
  event.body.memberCount = 1
  await event.state.storage.put<User>(`user_${user.id}`, user)
  await event.state.storage.put<Squad>(`squad_${event.body.id}`, event.body)
  return event.reply.ok()
})

// Delete a squad
useComet<PlaceEnvironment, { userId: string }>({
  server: 'place',
  method: Method.DELETE,
  pathname: '/api/squad/:squadId'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const squad = await event.state.storage.get<Squad>(`squad_${event.params.squadId}`)
  if (!squad) return event.reply.notFound({ error: 'Squad not found' })
  const user = await event.state.storage.get<User>(`user_${event.body.userId}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  if (user.id !== squad.owner) return event.reply.forbidden({ error: 'User is not the owner of this squad' })
  user.squadId = undefined
  await event.state.storage.put<User>(`user_${user.id}`, user)
  await event.state.storage.delete(`squad_${squad.id}`)
  return event.reply.ok()
})

// Join a squad
useComet<PlaceEnvironment, { userId: string }>({
  server: 'place',
  method: Method.POST,
  pathname: '/api/squad/:squadId/join'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const squad = await event.state.storage.get<Squad>(`squad_${event.params.squadId}`)
  if (!squad) return event.reply.notFound({ error: 'Squad not found' })
  const user = await event.state.storage.get<User>(`user_${event.body.userId}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  if (user.squadId) return event.reply.forbidden({ error: 'User is already in a squad' })
  user.squadId = squad.id
  squad.memberCount++
  await event.state.storage.put<User>(`user_${user.id}`, user)
  await event.state.storage.put<Squad>(`squad_${squad.id}`, squad)
  return event.reply.ok()
})

// Leave a squad
useComet<PlaceEnvironment, { userId: string }>({
  server: 'place',
  method: Method.POST,
  pathname: '/api/squad/:squadId/leave'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const squad = await event.state.storage.get<Squad>(`squad_${event.params.squadId}`)
  if (!squad) return event.reply.notFound({ error: 'Squad not found' })
  const user = await event.state.storage.get<User>(`user_${event.body.userId}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  if (user.squadId !== squad.id) return event.reply.forbidden({ error: 'User is not in this squad' })
  user.squadId = undefined
  squad.memberCount--
  await event.state.storage.put<User>(`user_${user.id}`, user)
  await event.state.storage.put<Squad>(`squad_${squad.id}`, squad)
  return event.reply.ok()
})

// Transfer ownership of a squad
useComet<PlaceEnvironment, { userId: string; to: string }>({
  server: 'place',
  method: Method.POST,
  pathname: '/api/squad/:squadId/transfer'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const squad = await event.state.storage.get<Squad>(`squad_${event.params.squadId}`)
  if (!squad) return event.reply.notFound({ error: 'Squad not found' })
  const user = await event.state.storage.get<User>(`user_${event.body.userId}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  if (user.id !== squad.owner) return event.reply.forbidden({ error: 'User is not the owner of this squad' })
  const owner = await event.state.storage.get<User>(`user_${event.body.to}`)
  if (!owner) return event.reply.notFound({ error: 'New owner user not found' })
  if (owner.squadId !== squad.id) return event.reply.forbidden({ error: 'New owner user is not in this squad' })
  squad.owner = owner.id
  await event.state.storage.put<Squad>(`squad_${squad.id}`, squad)
  return event.reply.ok()
})
