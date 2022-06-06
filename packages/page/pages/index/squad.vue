<template>
  <Container article max>
    <Container max padded>
      <Form @submit="createSquad">
        <Input type="file" @change="onFileChange">
          File
        </Input>
        <Input v-model="name" placeholder="Squad name" type="text" />
        <Button type="submit">
          Create
        </Button>
      </Form>
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  const file = ref<File>()
  const name = ref<string>()

  function onFileChange(event: any) {
    file.value = event.target.files[0]
  }

  async function createSquad() {
    if (!file.value || !name.value) return
    // const formData = new FormData()
    // console.log(await file.value.arrayBuffer())
    // formData.append('name', name.value)
    // formData.append('image', file.value)
    // console.log(formData)
    const response = await fetch(`/api/squad?name=${name.value}`, {
      method: 'POST',
      headers: { 'content-type': 'image/png' },
      body: file.value
    })
    const data = response.headers.get('content-type') === 'application/json' ? await response.json() : await response.text()
    console.log(response.status, data)
  }
</script>
