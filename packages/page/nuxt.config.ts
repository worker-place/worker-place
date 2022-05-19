import { defineNuxtConfig } from 'nuxt'


export default defineNuxtConfig({
  alias: {
    '@vue/devtools-api': '@vue/devtools-api'
  },
  modules: [ 'paintbrush-ui', '@pinia/nuxt' ],
  paintbrush: {
    prefixComponents: false
  },
  typescript: {
    shim: false
  }
})
