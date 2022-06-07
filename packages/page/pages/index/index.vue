<template>
  <Container article max>
    <Container center max>
      <canvas ref="canvas" />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  const canvas = ref<HTMLCanvasElement | null>()

  let observer: ResizeObserver | undefined

  onMounted(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const context: CanvasRenderingContext2D = canvas.value.getContext('2d')

    let lastbuffer: Uint8ClampedArray | undefined
    let size = 1024

    observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        size = Math.min(entry.contentRect.width, entry.contentRect.height)
        if (canvas.value) {
          canvas.value.width = size
          canvas.value.height = size
          if (lastbuffer) {
            context.putImageData(new ImageData(lastbuffer, 1024, 1024), 0, 0, 0, 0, size, size)
          }
        }
      }
    })

    if (canvas.value?.parentElement) {
      observer.observe(canvas.value?.parentElement)
    }

    let socket: WebSocket
    let delay = 0

    async function connectAfterDelay() {
      if (delay > 20000) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, delay))

      socket = new WebSocket('ws://localhost:8787/api/connect')

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
          context.putImageData(new ImageData(lastbuffer, 1024, 1024), 0, 0, 0, 0, size, size)
        }
      })

      socket.addEventListener('close', async event => {
        if (!event.wasClean) {
          delay *= 2
        }
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
  canvas {
    aspect-ratio: 1 / 1;
    max-height: 100%;
    max-width: 100%;
  }
</style>
