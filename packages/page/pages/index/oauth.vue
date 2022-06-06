<template>
  <Container article max>
    <Container max padded>
      <Text>Please wait...</Text>
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  import { User, Squad } from '../../types'


  const user = useState<User | undefined>('user')
  const squad = useState<Squad | undefined>('squad')

  onMounted(async () => {
    const code = useRoute().query.code
    const response = await fetch('/api/user/auth', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: { 'Content-Type': 'application/json' }
    })
    const body = response.headers.get('content-type') === 'application/json' ? await response.json() : {}
    if (response.status === 200) {
      console.log('Login successful', response.status, body)
      user.value = body.user
      squad.value = body.squad
      useRouter().push('/')
    } else {
      console.log('Login failed', response.status, body)
    }
  })
</script>
