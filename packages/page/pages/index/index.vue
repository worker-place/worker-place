<template>
  <Container max>
    <Container center max>
      <Image alt="The internet worker.place" :source="source" />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  const source = ref('')
  const socket = ref<WebSocket>()
  const delay = ref(0)

  onMounted(() => {
    let lastbuffer: Uint8ClampedArray | undefined

    async function connectAfterDelay() {
      if (delay.value > 20000) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, delay.value))

      socket.value = new WebSocket('wss://worker.place/api/connect')

      socket.value.addEventListener('open', () => {
        console.log('connected')

        socket.value?.send('hello')
        delay.value = 500
      })

      socket.value.addEventListener('message', async event => {
        if (event.data) {
          const buffer = await (event.data as Blob).arrayBuffer()
          const uintBuffer = new Uint8Array(buffer)
          lastbuffer = new Uint8ClampedArray(4 * 1024 * 1024)
          lastbuffer.fill(255)
          for (let i = 0; i < 1024 * 1024; i++) {
            if (uintBuffer[3 * i] === 4 && uintBuffer[3 * i + 1] === 4 && uintBuffer[3 * i + 2] === 4) {
              lastbuffer[4 * i + 3] = 0
            } else {
              lastbuffer[4 * i] = uintBuffer[3 * i]
              lastbuffer[4 * i + 1] = uintBuffer[3 * i + 1]
              lastbuffer[4 * i + 2] = uintBuffer[3 * i + 2]
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = 1024
          canvas.height = 1024
          canvas.getContext('2d')!.putImageData(new ImageData(lastbuffer, 1024, 1024), 0, 0)
          source.value = canvas.toDataURL()
        }
      })

      socket.value.addEventListener('close', async event => {
        delay.value *= 2
        connectAfterDelay()
      })
    }

    connectAfterDelay()
  })

  onBeforeUnmount(() => {
    socket.value?.close()
  })
</script>

<style lang="scss" scoped>
  img {
    aspect-ratio: 1 / 1;
    background: var(--background-3);
    max-height: 100%;
    max-width: 100%;
  }
</style>
