async function doBackup(env: BackupEnvironment): Promise<unknown> {
  // eslint-disable-next-line unicorn/no-await-expression-member
  const keys = (await env.SNAPSHOTS.list({ limit: 20 })).keys.map(key => key.name)
  const pending: Array<Promise<unknown>> = []
  if (keys.length > 0) {
    for (const key of keys) {
      const buffer = await env.SNAPSHOTS.get(key, 'arrayBuffer')
      if (!buffer) continue
      const bytes = new Uint8Array(buffer, 0)
      JSON.stringify([ ...bytes.slice(0, 10) ])
      pending.push(env.HEART.fetch('https://worker.place/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: key, value: [ ...bytes.values() ] })
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
