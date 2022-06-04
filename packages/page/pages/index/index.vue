<template>
  <Container article max>
    <Container max padded>
      <canvas ref="canvas" height="1024" width="1024" />
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  const canvas = ref<HTMLCanvasElement | null>()

  onMounted(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const context: CanvasRenderingContext2D = canvas.value.getContext('2d')

    const socket = new WebSocket('wss://worker.place/api/connect')

    socket.addEventListener('open', () => {
      console.log('connected')

      socket.send('test')
    })

    socket.addEventListener('message', async event => {
      console.log(event)
      if (event.data) {
        const buffer = await (event.data as Blob).arrayBuffer()
        const uintBuffer = new Uint8Array(buffer)
        const array = new Uint8ClampedArray(4 * 1024 * 1024)
        array.fill(255)
        for (let i = 0; i < 1024 * 1024; i++) {
          array[4 * i] = uintBuffer[3 * i]
          array[4 * i + 1] = uintBuffer[3 * i + 1]
          array[4 * i + 2] = uintBuffer[3 * i + 2]
        }
        context.putImageData(new ImageData(array, 1024, 1024), 0, 0)
      }
    })
  })
</script>
