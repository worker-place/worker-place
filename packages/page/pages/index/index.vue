<script lang="ts" setup>
  onMounted(() => {
    const socket = new WebSocket('wss://worker.place/api/connect')

    socket.addEventListener('open', () => {
      console.log('connected')
    })

    socket.addEventListener('message', event => {
      console.log(event)
    })
  })
</script>
