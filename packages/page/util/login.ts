export function loginUrl() {
  return `https://github.com/login/oauth/authorize?client_id=${useRuntimeConfig().public.GITHUB_OAUTH_CLIENT_ID}`
}
