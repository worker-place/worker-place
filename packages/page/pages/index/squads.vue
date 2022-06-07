<template>
  <Container max>
    <Container v-if="mayCreateSquad()" article padded>
      <Form @submit="createSquad">
        <Text sectiontitle>
          Create a new squad
        </Text>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Input class="squad-create-image" required type="file" @change="onFileChange" />
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Input v-model="name" placeholder="Squad name" required type="text" />
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Input v-model="top" placeholder="Top offset" required type="number" />
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Input v-model="left" placeholder="Left offset" required type="number" />
        <Button type="submit">
          Create
        </Button>
      </Form>
    </Container>
    <Container article>
      <Container class="squad-container">
        <template v-for="squad in squads" :key="squad.id">
          <Container class="squad-entry">
            <Container center>
              <Text sectiontitle>
                {{ squad.name }}
              </Text>
            </Container>
            <Separator />
            <Container class="squad-content">
              <Container class="squad-image-container">
                <Image
                  alt="Squad image"
                  class="squad-image"
                  :source="`https://worker.place/api/image?id=${squad.id}`"
                />
              </Container>
              <Container class="squad-info-container">
                <Text>
                  ID: {{ squad.id }}
                </Text>
                <Text>
                  Member count: {{ squad.memberCount }}
                </Text>
                <Button v-if="mayJoinSquad()" @click="joinSquad(squad)">
                  Join
                </Button>
                <Button v-if="mayLeaveSquad(squad)" @click="leaveSquad(squad)">
                  Leave
                </Button>
                <Button v-if="mayDeleteSquad(squad)" @click="deleteSquad(squad)">
                  Delete
                </Button>
              </Container>
            </Container>
          </Container>
        </template>
      </Container>
    </Container>
    <Popup v-if="showJoinError">
      <Container center class="popup">
        <Text>
          Joining squad failed, please try again later
        </Text>
        <Button color="red" @click="showJoinError = false">
          Close
        </Button>
      </Container>
    </Popup>
    <Popup v-if="showLeaveError">
      <Container center class="popup">
        <Text>
          Leaving squad failed, please try again later
        </Text>
        <Button color="red" @click="showLeaveError = false">
          Close
        </Button>
      </Container>
    </Popup>
    <Popup v-if="showDeleteError">
      <Container center class="popup">
        <Text>
          Deleting squad failed, please try again later
        </Text>
        <Button color="red" @click="showDeleteError = false">
          Close
        </Button>
      </Container>
    </Popup>
    <Popup v-if="showCreateError">
      <Container center class="popup">
        <Text>
          Creating squad failed, please try again later
        </Text>
        <Button color="red" @click="showCreateError = false">
          Close
        </Button>
      </Container>
    </Popup>
  </Container>
</template>

<script lang="ts" setup>
  import { Squad } from '../../types'
  import { loginUrl } from '../../util/login'


  const showJoinError = ref<boolean>()
  const showLeaveError = ref<boolean>()
  const showDeleteError = ref<boolean>()
  const showCreateError = ref<boolean>()

  const currentUser = useUser()
  const currentSquad = useSquad()
  const squads = ref<Array<Squad>>([])
  const cardbackground = useThemeColor('background')

  onMounted(async () => {
    const response = await fetch('/api/squad')
    if (response.status === 200) {
      const data = await response.json() as { squads: Squad[] }
      squads.value = data.squads
    }
  })

  // JOIN SQUAD

  function mayJoinSquad() {
    return currentUser.value?.squadId === undefined
  }

  async function joinSquad(squad: Squad) {
    if (!currentUser.value) return navigateTo(loginUrl())
    const response = await fetch(`/api/squad/${squad.id}/join`, { method: 'POST' })
    if (response.status !== 200) {
      showJoinError.value = true
      return
    }
    squad.memberCount++
    currentUser.value.squadId = squad.id
    currentSquad.value = squad
    squads.value = squads.value.map(x => x.id !== squad.id ? x : squad)
  }

  // LEAVE SQUAD

  function mayLeaveSquad(squad: Squad) {
    return currentUser.value?.squadId === squad.id && currentUser.value?.id !== squad.owner
  }

  async function leaveSquad(squad: Squad) {
    if (!currentUser.value) return
    const response = await fetch(`/api/squad/${squad.id}/leave`, { method: 'POST' })
    if (response.status !== 200) {
      showLeaveError.value = true
      return
    }
    squad.memberCount--
    currentUser.value.squadId = undefined
    currentSquad.value = undefined
    squads.value = squads.value.map(x => x.id !== squad.id ? x : squad)
  }

  // DELETE SQUAD

  function mayDeleteSquad(squad: Squad) {
    return currentUser.value?.squadId === squad.id && currentUser.value?.id === squad.owner
  }

  async function deleteSquad(squad: Squad) {
    if (!currentUser.value) return
    const response = await fetch(`/api/squad/${squad.id}`, { method: 'DELETE' })
    if (response.status !== 200) {
      showDeleteError.value = true
      return
    }
    currentUser.value.squadId = undefined
    currentSquad.value = undefined
    squads.value = squads.value.filter(x => x.id !== squad.id)
  }

  // CREATE SQUAD

  function mayCreateSquad() {
    return currentUser.value?.squadId === undefined
  }

  const file = ref<File>()
  const name = ref<string>()
  const top = ref<string>()
  const left = ref<string>()

  function onFileChange(event: any) {
    file.value = event.target.files[0]
  }

  async function createSquad() {
    if (!currentUser.value || !file.value || !name.value || !top.value || !left.value) return
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('image', file.value)
    formData.append('top', top.value)
    formData.append('left', left.value)
    const response = await fetch('/api/squad', { method: 'POST', body: formData })
    if (response.status !== 200) {
      showCreateError.value = true
      return
    }
    const data = await response.json() as { squad: Squad }
    currentUser.value.squadId = data.squad.id
    currentSquad.value = data.squad
    squads.value = [ ...squads.value, data.squad ]
  }
</script>

<style lang="scss" scoped>
  .squad-container {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
    margin: 2rem 0;
  }

  .squad-create-image {
    padding-top: 4px;
  }

  .squad-entry {
    background: v-bind(cardbackground);
    border-radius: 10px;
    padding: 8px 2rem 2rem;
  }

  .squad-content {
    display: flex;
    flex-direction: row;
    padding-top: 8px;
  }

  .squad-image-container {
    background: var(--background-2);
    border-radius: 4px;
    display: grid;
    height: 128px;
    margin-right: 2rem;
    place-items: center;
    width: 128px;
  }

  .squad-image {
    max-height: 128px;
    max-width: 128px;
  }
</style>
