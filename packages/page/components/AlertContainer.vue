<template>
  <Container>
    <Popup v-if="alert">
      <Container class="alert-container">
        <Container center>
          <Text>
            {{ alert.text }}
          </Text>
        </Container>
        <Separator />
        <Container center>
          <Button :color="alert.buttonColor || DEF_BUTTON_COLOR" @click="closed">
            {{ alert.buttonText || DEF_BUTTON_TEXT }}
          </Button>
        </Container>
      </Container>
    </Popup>
  </Container>
</template>

<script lang="ts" setup>
  const DEF_BUTTON_COLOR = 'red'
  const DEF_BUTTON_TEXT = 'Dismiss'

  const alert = useAlert().get()
  const background = useThemeColor('background3')

  function closed() {
    const callback = alert.value?.closed
    if (callback) {
      callback()
    }

    useAlert().destroy()
  }
</script>

<style lang="scss" scoped>
  .alert-container {
    background: v-bind(background);
    border-radius: 5px;
    padding: 2rem;
  }

  hr {
    margin: 1rem 0;
  }
</style>
