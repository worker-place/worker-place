<template>
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
</template>

<script lang="ts" setup>
  import { Squad } from '../../types'


  type SquadsResponseSchema = { squads: Squad[] }

  const squads = ref<Array<Squad>>([])
  const user = useUser()
  const cardbackground = useThemeColor('background')

  const resp = await fetch('http://localhost:8787/api/squad')
  if (resp.status === 200) {
    const data = await resp.json() as SquadsResponseSchema
    squads.value = data.squads
  }

  function mayJoin(squad: Squad) {
    return user.value?.squadId !== squad.id
  }

  function join(squad: Squad) {
    console.log(`Joining ${squad}`)
    // send request
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
