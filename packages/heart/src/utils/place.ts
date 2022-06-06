// Fetch from the Place durable object
export async function fetchPlace<TResponse = unknown>(env: HeartEnvironment, path: string, method: string, body?: any) {
  const place = env.PLACE.get(env.PLACE.idFromName('worker-place'))
  const headers = body ? { 'content-type': 'application/json' } : undefined
  const request = new Request(`http://place${path}`, { method, body: JSON.stringify(body), headers })
  const response = await place.fetch(request)
  const responseBody = response.headers.get('content-type') === 'application/json' ? await response.json() : {}
  return responseBody as TResponse & { error?: string }
}
