import { PNG } from 'pngjs/browser'


async function doBackup(env: BackupEnvironment): Promise<unknown> {
  console.log('backup...')
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list()).keys.map(key => key.name).splice(0, 10)
  console.log('keys: ')
  console.log(keys)
  if (keys.length > 0) {
    console.log('keys.length > 0')
    const values = await Promise.all(keys.map(each => env.SNAPSHOTS.get(each, { type: 'arrayBuffer' })))
    console.log('Values:')
    console.log(JSON.stringify(values))
    console.log('-----')
    values.forEach(each => console.log(each))
    console.log('abc')
    console.log('not doing anything...')
    /*await Promise.all(values.filter(Boolean)
      .map(each => {
        // @ts-expect-error ...
        const result = new PNG().end(each).pack().data
        console.log('data is:')
        console.log(result)
      })
      .map(each => {
        // @ts-expect-error ...
        env.BACKUP.put(new Date().toISOString(), each)
        console.log('updated')
      }))*/

    return await Promise.all(keys.map(each => env.SNAPSHOTS.delete(each)))
  }

  console.log('keys.length < 0')
}

export default {
  async scheduled(event: ScheduledEvent, env: BackupEnvironment, ctx: ExecutionContext) {
    console.log(`[cron - ${event.cron}] Creating backup...`)
    ctx.waitUntil(doBackup(env))
  }
}
