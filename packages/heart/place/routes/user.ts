import { Method, useComet } from '@neoaren/comet'
import { PlaceEnvironment, Squad, User } from '../types'


// Create or update a user
useComet<PlaceEnvironment, { avatar?: string; username: string }>({
  server: 'place',
  method: Method.POST,
  pathname: '/api/user/:userId'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const foundUser = await event.state.storage.get<User>(`user_${event.params.userId}`)
  const updatedUser: User = {
    id: event.params.userId,
    username: event.body.username,
    avatar: event.body.avatar,
    squadId: foundUser?.squadId
  }
  let squad: Squad | undefined
  if (updatedUser.squadId) {
    squad = await event.state.storage.get<Squad>(`squad_${updatedUser.squadId}`)
    if (!squad) updatedUser.squadId = undefined
  }
  await event.state.storage.put<User>(`user_${updatedUser.id}`, updatedUser)
  return event.reply.ok({ user: updatedUser, squad })
})

// Get a user and optionally their squad
useComet<PlaceEnvironment, unknown>({
  server: 'place',
  method: Method.GET,
  pathname: '/api/user/:userId'
}, async event => {
  if (!event.state) return event.reply.internalServerError()
  const user = await event.state.storage.get<User>(`user_${event.params.userId}`)
  if (!user) return event.reply.notFound({ error: 'User not found' })
  let squad: Squad | undefined
  if (user.squadId) {
    squad = await event.state.storage.get<Squad>(`squad_${user.squadId}`)
    if (!squad) {
      user.squadId = undefined
      await event.state.storage.put<User>(`user_${user.id}`, user)
    }
  }
  return event.reply.ok({ user, squad })

})
