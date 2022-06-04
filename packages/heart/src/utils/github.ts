import { getConfig } from './accessory'


interface GitHubOAuthError {
  error: string
}

interface GitHubOAuthSuccess {
  access_token: string
  scope: string
  type: string
}

interface GitHubGetUserError {
  message: string
}

interface GitHubGetUserSuccess {
  avatar_url: string
  id: string
  login: string
  name: string
}

export interface User {
  accessToken: string
  fullname: string
  id: string
  url: string
  username: string
}

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
  const data = await response.json<GitHubOAuthError & GitHubOAuthSuccess>()
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
  const data = await response.json<GitHubGetUserError & GitHubGetUserSuccess>()
  if (data.message) {
    console.log('Failed to fetch user data from access token', data.message)
    return
  }
  return { id: data.id, username: data.login, fullname: data.name, url: data.avatar_url, accessToken }
}
