import { PNG } from 'pngjs/browser'


async function doBackup(env: BackupEnvironment): Promise<unknown> {
  console.log('backup...')
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list()).keys.map(key => key.name)
  if (keys.length > 0) {
    /*const values = await Promise.all(keys.map(each => env.SNAPSHOTS.get(each, 'arrayBuffer')))
    await Promise.all(values.filter(Boolean)
      .map(each => {
        console.log(each)
        // @ts-expect-error ...
        console.log(Object.keys(each))
        // const result = new PNG().end(each).pack().data
        const png = new PNG()
        // @ts-expect-error ...
        png.data = each
        console.log('data is:')
        console.log(result)
      })
      .map(each => {
        // @ts-expect-error ...
        env.BACKUP.put(new Date().toISOString(), each)
        console.log('updated')
      }))*/
    const value = env.SNAPSHOTS.get(keys[0], 'arrayBuffer')
    console.log(value)

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
