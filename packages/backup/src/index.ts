import { PNG } from 'pngjs/browser'


async function doBackup(env: BackupEnvironment): Promise<unknown> {
  console.log('hello')
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list()).keys.map(key => key.name)
  const values = await Promise.all(keys.map(each => env.SNAPSHOTS.get(each, { type: 'arrayBuffer' })))
  await Promise.all(values.filter(Boolean)
    // @ts-expect-error ...
    .map(each => new PNG().end(each).pack().data)
    .map(each => env.BACKUP.put(new Date().toISOString(), each)))

  return await Promise.all(keys.map(each => env.SNAPSHOTS.delete(each)))
}

export default {
  async scheduled(event: ScheduledEvent, env: BackupEnvironment, ctx: ExecutionContext) {
    console.log(`[cron - ${event.cron}] Creating backup...`)
    ctx.waitUntil(doBackup(env))
  }
}
