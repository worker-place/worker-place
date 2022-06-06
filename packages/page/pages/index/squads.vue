<template>
  <Container>
    <Container article max padded>
      <Form @submit="createSquad">
        <Input type="file" @change="onFileChange">
          File
        </Input>
        <Input v-model="name" placeholder="Squad name" type="text" />
        <Input v-model="top" placeholder="Offset from top" type="number" />
        <Input v-model="left" placeholder="Offset from left" type="number" />
        <Button type="submit">
          Create
        </Button>
      </Form>
    </Container>
    <Container article class="squad-container">
      <template v-for="squad in squads" :key="squad.id">
        <Container class="squad-entry">
          <Container center>
            <Text sectiontitle>
              {{ squad.name }}
            </Text>
          </Container>
          <Separator />
          <Text>
            Owner: {{ squad.owner }}
          </Text>
          <Text>
            Member count: {{ squad.memberCount }}
          </Text>
          <Button v-if="mayJoin(squad)" @click="join(squad)">
            Join
          </Button>
          <Separator />
        </Container>
      </template>
    </Container>
  </Container>
</template>

<script lang="ts" setup>
  import { Squad } from '../../types'


  type SquadsResponseSchema = { squads: Squad[] }

  const squads = ref<Array<Squad>>([])
  const user = useUser()
  const cardbackground = useThemeColor('background')

  onMounted(async () => {
    const response = await fetch('/api/squad')
    if (response.status === 200) {
      const data = await response.json() as SquadsResponseSchema
      squads.value = data.squads
    }
  })

  function mayJoin(squad: Squad) {
    return user.value?.squadId !== squad.id
  }

  function join(squad: Squad) {
    console.log(`Joining ${squad}`)
    // send request
  }

  // CREATE SQUAD

  const file = ref<File>()
  const name = ref<string>()
  const top = ref<string>()
  const left = ref<string>()

  function onFileChange(event: any) {
    file.value = event.target.files[0]
  }

  async function createSquad() {
    if (!file.value || !name.value || !top.value || !left.value) return
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('image', file.value)
    formData.append('top', top.value)
    formData.append('left', left.value)
    const response = await fetch('/api/squad', { method: 'POST', body: formData })
    const data = response.headers.get('content-type') === 'application/json' ? await response.json() : await response.text()
    console.log(response.status, data)
  }
</script>

<style lang="scss" scoped>
  .squad-container {
    gap: 1rem;
    margin: 2rem 0;
  }

  .squad-entry {
    background: v-bind(cardbackground);
    border-radius: 10px;
    padding: 2rem;
  }
</style>
