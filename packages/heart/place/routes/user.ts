import { Method, useComet } from '@neoaren/comet'
import { PlaceEnvironment, Squad, User } from '../types'


// Create or update a user
useComet<PlaceEnvironment, { avatar?: string; username: string }>({
  method: Method.POST,
  pathname: '/api/user/:userId',
  server: 'place'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const user = await event.state.storage.get<User>(`user_${event.params.userId}`)
  const updatedUser: User = {
    id: event.params.userId,
    username: event.body.username,
    avatar: event.body.avatar,
    squadId: user?.squadId
  }
  await event.state.storage.put<User>(`user_${updatedUser.id}`, updatedUser)
  return event.reply.ok()
})

// Get a user and optionally their squad
useComet<PlaceEnvironment, unknown>({
  method: Method.GET,
  pathname: '/api/user/:userId',
  server: 'place'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const user = await event.state.storage.get<User>(`user_${event.params.userId}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  if (!user.squadId) return event.reply.ok({ user })
  const squad = await event.state.storage.get<Squad>(`squad_${user.squadId}`)
  if (squad) return event.reply.ok({ user, squad })
  user.squadId = undefined
  await event.state.storage.put<User>(`user_${user.id}`, user)
  return event.reply.ok({ user })
})
