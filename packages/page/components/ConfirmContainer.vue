<template>
  <Container>
    <Popup v-if="confirm">
      <Container class="confirm-container">
        <Container center>
          <Text>
            {{ confirm.text }}
          </Text>
        </Container>
        <Separator />
        <Container center>
          <Container v-if="confirm.task" class="task-container">
            <Text v-if="confirm.task.instruction">
              {{ confirm.task.instruction }}
            </Text>
            <Input v-model="inputValue" @keyup.enter="accept" />
            <Text v-if="error" class="error">
              {{ error }}
            </Text>
          </Container>
        </Container>
        <Container grid="repeat(2, minmax(250px, 1fr))">
          <Button :color="confirm.buttonColor || DEF_BUTTON_COLOR" ghost @click="cancel">
            Cancel
          </Button>
          <Button :color="confirm.buttonColor || DEF_BUTTON_COLOR" @click="accept">
            Accept
          </Button>
        </Container>
      </Container>
    </Popup>
  </Container>
</template>

<script lang="ts" setup>
  const DEF_BUTTON_COLOR = 'red'

  const confirm = useConfirm().get()
  const inputValue = ref<string>()
  const error = ref<string>()
  const errorcolor = useThemeColor('red')

  const displayError = (message?: string) => error.value = message || 'You need to specify a valid value'

  function accept() {
    const task = confirm?.value?.task
    if (task) {
      if (!inputValue.value) {
        displayError(task.errorMessage)
        return
      }

      const result = task.validate(inputValue.value)
      if (!result) {
        displayError(task.errorMessage)
        return
      }
    }

    close(confirm?.value?.success)
  }

  function cancel() {
    close(confirm?.value?.failure)
  }

  function close(callback?: () => void) {
    if (callback) {
      callback()
    }

    useConfirm().destroy()
  }
</script>

<style lang="scss" scoped>
  .confirm-container {
    padding: 2rem;
  }

  p.error {
    color: v-bind(errorcolor);
  }

  .task-container {
    padding: 2rem;
  }

  hr {
    margin: 1rem 0;
  }
</style>
