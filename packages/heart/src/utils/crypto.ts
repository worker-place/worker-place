// Hash `value` with SHA-512 `iterations` times and return it as base64
export async function hashNtimes(value: string, iterations: number): Promise<string> {
  let result = new TextEncoder().encode(value).buffer
  for (let i = 0; i < iterations; i++) {
    result = await crypto.subtle.digest('SHA-512', result)
  }
  return btoa(String.fromCodePoint(...new Uint8Array(result)))
}

// Get a random value
export function getRandomValue(): string {
  const uuids = crypto.randomUUID() + crypto.randomUUID() + crypto.randomUUID() + crypto.randomUUID()
  return uuids.replaceAll('-', '')
}
