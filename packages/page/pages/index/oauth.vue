<template>
  <Container article max>
    <Container max padded>
      <Container class="spinner-container">
        <Spinner />
        <Text inline>
          Loading...
        </Text>
      </Container>
      <Popup v-if="displayPopup">
        <Container center class="popup">
          <Text>
            Login attempt failed, please try again later
          </Text>
          <Button color="red" @click="displayPopup = false">
            Close
          </Button>
        </Container>
      </Popup>
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  const user = useUser()
  const squad = useSquad()
  const displayPopup = ref<boolean>()

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
      displayPopup.value = true
      console.log('Login failed', response.status, body)
    }
  })
</script>

<style lang="scss" scoped>
  .popup {
    padding: 2rem;
  }

  .spinner-contianer {
    margin-top: 2rem;
    justify-items: center;
  }
</style>
