import { Method, useComet } from '@neoaren/comet'
import { PNG } from 'pngjs/browser'


useComet<HeartEnvironment, unknown>({
  server: 'main',
  method: Method.GET,
  pathname: '/api/squad'
}, async event => {
  const squads = [
    { id: 'abc', name: 'Squad 1', memberCount: 2, owner: '123' },
    { id: 'fgh', name: 'Squad 1', memberCount: 37, owner: '856' },
    { id: 'nml', name: 'Squad 1', memberCount: 8, owner: '384' },
    { id: 'dvf', name: 'Squad 1', memberCount: 11, owner: '745' },
    { id: 'htz', name: 'Squad 1', memberCount: 24, owner: '235' },
    { id: 'joi', name: 'Squad 1', memberCount: 19, owner: '171' }
  ]
  return event.reply.ok({ squads })
})

// Create a new squad
useComet<HeartEnvironment, { image: File; name: string }>({
  server: 'main',
  method: Method.POST,
  pathname: '/api/squad'
}, async event => {
  const png = new PNG()
  const raw = await event.body.image.arrayBuffer()
  const data = await new Promise<Uint8Array>((resolve, reject) => {
    png.parse(raw, (error, result) => {
      if (error) return reject(error)
      return resolve(result.data)
    })
  })
  return event.reply.ok({ data })
})
