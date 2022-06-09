<template>
  <Container>
    <Popup v-if="alert.display">
      <Container center class="alert-container">
        <Text>
          {{ alert.text }}
        </Text>
        <Separator />
        <Button :color="alert.buttonColor || DEF_BUTTON_COLOR" @click="closed">
          {{ alert.buttonText || DEF_BUTTON_TEXT }}
        </Button>
      </Container>
    </Popup>
  </Container>
</template>

<script lang="ts" setup>
  const DEF_BUTTON_COLOR = 'red'
  const DEF_BUTTON_TEXT = 'Dismiss'

  const alert = useAlert()

  function closed() {
    const callback = alert.value?.closed
    if (callback) {
      callback()
    }
  }
</script>

<style>
</style>
