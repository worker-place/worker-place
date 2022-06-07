import { PNG } from 'pngjs/browser'


async function doBackup(env: BackupEnvironment): Promise<unknown> {
  console.log('backup...')
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list({ limit: 10 })).keys.map(key => key.name)
  if (keys.length > 0) {
    const pending = keys.map(async key => {
      const value = await env.SNAPSHOTS.get(key, 'arrayBuffer')
      if (!value) return
      console.log(value)
      console.log(Object.keys(value))
      // const result = new PNG().end(each).pack().data
      const png = new PNG()
      png.data = value
      console.log('data is:')
      console.log(value)
      return env.BACKUP.put(key, value)
    })

    await Promise.all(pending)
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
