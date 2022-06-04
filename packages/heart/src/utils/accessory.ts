interface AccessoryConfig {
  GITHUB_OAUTH_CLIENT_ID: string
  GITHUB_OAUTH_CLIENT_SECRET: string
}

export async function getConfig(env: HeartEnvironment): Promise<AccessoryConfig> {
  const cached = await caches.default.match(new Request('/services/config/get'))
  if (cached) {
    const data = await cached.json<{config: AccessoryConfig}>()
    return data.config
  }

  const response = await env.ACCESSORY.fetch('/services/config/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': env.ACCESSORY_TOKEN
    },
    body: JSON.stringify({
      environment: 'worker-place-production',
      service_id: env.ACCESSORY_SERVICE_ID
    })
  })

  caches.default.put(new Request('/services/config/get', {
    headers: {
      'Cache-Control': 's-maxage=3600, max-age=3600'
    }
  }), response.clone())

  const data = await response.json<{config: AccessoryConfig}>()
  return data.config
}
