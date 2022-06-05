import { User } from '../../place/types'
import { getConfig } from './accessory'


// Get GitHub access token from a GitHub OAuth temporary code
export async function getAccessTokenFromTemporaryCode(
  code: string,
  env: HeartEnvironment
): Promise<string | undefined> {
  // @ts-expect-error I made a typo while uploading the config
  const { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIEND_SECRET: GITHUB_OAUTH_CLIENT_SECRET } = await getConfig(env)
  const baseUrl = 'https://github.com/login/oauth/access_token'
  const url = `${baseUrl}?client_id=${GITHUB_OAUTH_CLIENT_ID}&client_secret=${GITHUB_OAUTH_CLIENT_SECRET}&code=${code}`
  const response = await fetch(url, { method: 'post', headers: { 'accept': 'application/json' } })
  const data = await response.json<{ error?: string; access_token: string }>()
  if (data.error) {
    console.log('Failed to fetch access token from temporary code', data.error)
    return
  }
  return data.access_token
}

// Get user data from a GitHub access token
export async function getUserDataFromAccessToken(accessToken: string): Promise<User | undefined> {
  const url = 'https://api.github.com/user'
  const headers = { 'authorization': `token ${accessToken}`, 'accept': 'application/json', 'user-agent': 'worker-place' }
  const response = await fetch(url, { headers })
  const data = await response.json<{ message?: string; id: string; login: string; avatar_url?: string }>()
  if (data.message) {
    console.log('Failed to fetch user data from access token', data.message)
    return
  }
  return { id: data.id, username: data.login, avatar: data.avatar_url }
}
