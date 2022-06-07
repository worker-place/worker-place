<template>
  <Container max>
    <Container center max>
      <Image alt="The internet worker.place" :source="source" />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  let observer: ResizeObserver | undefined
  const source = ref('')

  onMounted(() => {
    let lastbuffer: Uint8ClampedArray | undefined
    let socket: WebSocket
    let delay = 0

    async function connectAfterDelay() {
      if (delay > 20000) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, delay))

      socket = new WebSocket('wss://worker.place/api/connect')

      socket.addEventListener('open', () => {
        console.log('connected')

        socket.send('hello')
        delay = 500
      })

      socket.addEventListener('message', async event => {
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

      socket.addEventListener('close', async event => {
        connectAfterDelay()
      })
    }

    connectAfterDelay()
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
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
