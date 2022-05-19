import { comet, Method, useComet } from '@neoaren/comet'


useComet({
  method: Method.POST,
  pathname: '/api'
}, async event => {
  return event.reply.ok({ message: 'Hello, Comet!' })
})

export default {
  fetch: comet({ name: 'main' })
}
