<template>
  <Paintbrush
    app-name="The internet worker.place"
    canonical="https://worker.place"
    :color-scheme="colorScheme"
    :dark-colors="darkColors"
    description="Contribute to the worker.place"
    favicon="/assets/icon.png"
    favicon-svg="/assets/icon.svg"
    large-image="/assets/icon.png"
    large-image-alt="worker.place logo"
    :light-colors="lightColors"
    page-title="The internet worker.place"
    url="https://worker.place"
  >
    <NuxtPage />
  </Paintbrush>
</template>

<script lang="ts" setup>
  import { useNuxtApp } from '#app'


  useNuxtApp().vueApp.config.unwrapInjectedRef = true

  const colorScheme = {
    black: '#021d27',
    blue: '#549ab6',
    dark: '#022b3a',
    green: '#1f7a8c',
    lightblue: '#bfdbf7',
    lightgray: '#e1e5f2',
    orange: '#faa916',
    red: '#e83151',
    white: '#ffffff'
  }
  const lightColors = {
    background: 'lightgray',
    background2: 'white',
    doubleUnit: '8px',
    primary: 'green',
    radius: '4px',
    secondary: 'black',
    text: 'black',
    textOnPrimary: 'white',
    textShade: 'lightgray',
    unit: '4px'
  }
  const darkColors = {
    background: 'black',
    background2: 'dark',
    doubleUnit: '8px',
    primary: 'green',
    radius: '4px',
    secondary: 'blue',
    text: 'white',
    textOnPrimary: 'white',
    textShade: 'blue',
    unit: '4px'
  }
</script>
