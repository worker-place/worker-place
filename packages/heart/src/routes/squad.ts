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

