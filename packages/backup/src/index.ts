async function doBackup(env: BackupEnvironment): Promise<unknown> {
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list({ limit: 20 })).keys.map(key => key.name)
  const pending: Array<Promise<unknown>> = []
  if (keys.length > 0) {
    for (const key of keys) {
      const value = await env.SNAPSHOTS.get(key)
      pending.push(env.HEART.fetch('https://worker.place/api/backup', {
        method: 'POST',
        body: JSON.stringify({ key: key, value: value })
      }))
    }
  }

  return Promise.all(pending)
}

export default {
  async scheduled(event: ScheduledEvent, env: BackupEnvironment, ctx: ExecutionContext) {
    console.log(`[cron - ${event.cron}] Creating backup...`)
    ctx.waitUntil(doBackup(env))
  }
}
