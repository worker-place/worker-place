import { defineNuxtConfig } from 'nuxt'


export default defineNuxtConfig({
  alias: {
    '@vue/devtools-api': '@vue/devtools-api'
  },
  modules: [ 'paintbrush-ui', '@pinia/nuxt' ],
  paintbrush: {
    prefixComponents: false
  },
  runtimeConfig: {
    public: {
      GITHUB_OAUTH_CLIENT_ID: '54510296119a4aa281d3'
    }
  },
  typescript: {
    shim: false
  }
})
