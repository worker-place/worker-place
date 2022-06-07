<template>
  <Container article max>
    <Container v-if="mayCreateSquad()" padded>
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
    <Container v-if="mayJoinSquad()" padded>
      <Form @submit="joinSquadById">
        <Text sectiontitle>
          Join a squad by its ID
        </Text>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Input v-model="id" placeholder="Squad ID" required type="text" />
        <Button type="submit">
          Join
        </Button>
      </Form>
    </Container>
    <Container>
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
                <Text class="squad-id" @click="copy">
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
                <ButtonGroup v-if="isOwnerOf(squad)">
                  <Button @click="deleteSquad(squad)">
                    Delete
                  </Button>
                  <Button @click="transferSquadInit(squad)">
                    Transfer
                  </Button>
                </ButtonGroup>
              </Container>
            </Container>
          </Container>
        </template>
      </Container>
    </Container>
    <ClientOnly>
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
      <Popup v-if="showFindError">
        <Container center class="popup">
          <Text>
            Could not find a squad with the specified ID
          </Text>
          <Button color="red" @click="showFindError = false">
            Close
          </Button>
        </Container>
      </Popup>
      <Popup v-if="showTransferPopup">
        <Container center class="popup">
          <Form @submit="transferSquad">
            <Text sectiontitle>
              Transfer this squad to another member
            </Text>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <Input v-model="newOwner" placeholder="The ID of the new owner" required type="text" />
            <ButtonGroup>
              <Button type="submit">
                Transfer
              </Button>
              <Button color="red" @click="closeTransferSquadPopup">
                Close
              </Button>
            </ButtonGroup>
          </Form>
        </Container>
      </Popup>
      <Popup v-if="showTransferError">
        <Container center class="popup">
          <Text>
            Transferring squad failed, please try again later
          </Text>
          <Button color="red" @click="showTransferError = false">
            Close
          </Button>
        </Container>
      </Popup>
    </ClientOnly>
  </Container>
</template>

<script lang="ts" setup>
  import { Squad } from '../../types'
  import { loginUrl } from '../../util/login'


  const showJoinError = ref<boolean>()
  const showLeaveError = ref<boolean>()
  const showDeleteError = ref<boolean>()
  const showCreateError = ref<boolean>()
  const showFindError = ref<boolean>()
  const showTransferError = ref<boolean>()

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
    if (!currentUser.value) return location.replace(loginUrl())
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

  async function copy(event: Event) {
    const element = event.target as HTMLInputElement
    if (element.textContent) {
      await navigator.clipboard.writeText(element.textContent?.replace('ID:', '').trim())
    }
  }

  function findSquad(id: string) {
    return squads.value.find(x => x.id === id)
  }

  const id = ref<string>()

  async function joinSquadById() {
    if (!id.value) {
      showFindError.value = true
      return
    }
    const squad = findSquad(id.value)
    if (!squad) {
      showFindError.value = true
      return
    }
    await joinSquad(squad)
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

  function isOwnerOf(squad: Squad) {
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

  // TRANSFER SQUAD

  const showTransferPopup = ref<boolean>()
  const squadToTransfer = ref<Squad>()
  const newOwner = ref<string>()

  function transferSquadInit(squad: Squad) {
    squadToTransfer.value = squad
    showTransferPopup.value = true
  }

  function closeTransferSquadPopup() {
    showTransferPopup.value = false
    squadToTransfer.value = undefined
    newOwner.value = undefined
  }

  async function transferSquad() {
    if (!currentUser.value || !squadToTransfer.value || !newOwner.value) return
    const body = JSON.stringify({ to: newOwner.value })
    const headers = { 'content-type': 'application/json' }
    const response = await fetch(`/api/squad/${squadToTransfer.value.id}/transfer`, { method: 'POST', headers, body })
    if (response.status !== 200) {
      closeTransferSquadPopup()
      showTransferError.value = true
      return
    }
    const squad = squadToTransfer.value
    squad.owner = newOwner.value
    currentSquad.value = squad
    squads.value = squads.value.map(x => x.id !== squad.id ? x : squad)
    closeTransferSquadPopup()
  }


  // CREATE SQUAD

  function mayCreateSquad() {
    return currentUser.value && currentUser.value?.squadId === undefined
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

  .squad-create-image input {
    padding-top: 4px;
  }

  .squad-entry {
    background: v-bind(cardbackground);
    border-radius: 10px;
    padding: 8px 2rem 2rem;
  }

  .squad-id {
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  .popup {
    background: var(--background-2);
    padding: 8px 2rem 2rem;
  }
</style>
