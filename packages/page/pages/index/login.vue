<template>
  <Container article max>
    <Container max padded>
      <Text>Login</Text>
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  import { useRoute } from '#imports'


  onMounted(async () => {
    const code = useRoute().query.code
    await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
</script>
