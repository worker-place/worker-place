<template>
  <SidebarContainer :wrap-content="false">
    <template #sidebar-top>
      <Container center>
        <Image alt="Paintbrush UI Logo" max-width="50%" source="/assets/icon.svg" />
      </Container>
    </template>
    <template #sidebar-middle>
      <Container center gap="4px" grid="1fr">
        <Text v-if="currentUser">
          <Text bold part>
            {{ currentUser.username }}
          </Text> ({{ currentUser.id }})
        </Text>
        <Text v-if="currentSquad" center>
          {{ currentSquad.name }}
        </Text>
        <Text v-if="currentSquad">
          Member count: {{ currentSquad.memberCount }}
        </Text>
      </Container>
    </template>
    <template #sidebar-bottom>
      <Container center gap="4px" grid="1fr">
        <ThemeToggle border="primary" thumb-color="background2" />
        <SidebarLink
          href="https://github.com/worker-place/worker-place"
          icon="github-logo"
          icon-color="primary"
        >
          Source
        </SidebarLink>
        <PoweredBy />
      </Container>
    </template>
    <template #content>
      <MenubarContainer ref="scrollAnchor" menu-element-spacing="8px" :wrap-content="false">
        <template #menubar-middle>
          <MenubarLink href="/">
            worker.place
          </MenubarLink>
          <MenubarLink href="/squads">
            squads
          </MenubarLink>
          <MenubarLink href="/about">
            about
          </MenubarLink>
          <MenubarLink href="/faq">
            faq
          </MenubarLink>
        </template>
        <template #menubar-right>
          <MenubarLink
            v-if="displayLogin"
            active-background="primary"
            active-color="white"
            background="primary"
            click-background="primary"
            click-color="white"
            color="white"
            :href="loginUrl()"
            icon="github-logo"
            icon-color="white"
            icon-variant="bold"
          >
            login
          </MenubarLink>
          <MenubarLink
            v-else
            active-background="primary"
            active-color="white"
            background="primary"
            click-background="primary"
            click-color="white"
            color="white"
            href="#"
            icon="sign-out"
            icon-color="white"
            icon-variant="bold"
            @click="logout"
          >
            logout
          </MenubarLink>
        </template>
        <template #content>
          <NuxtChild />
        </template>
      </MenubarContainer>
    </template>
  </SidebarContainer>
</template>

<script lang="ts" setup>
  import { loginUrl } from '../util/login'


  const currentUser = useUser()
  const currentSquad = useSquad()
  const displayLogin = ref<boolean>(true)

  onMounted(async () => {
    const response = await fetch('/api/user/current', { method: 'GET' })
    const body = response.headers.get('content-type') === 'application/json' ? await response.json() : {}
    console.log('fetch user data', response.status, body)
    if (response.status === 200) {
      currentUser.value = body.user
      currentSquad.value = body.squad
      displayLogin.value = false
    }
  })

  async function logout() {
    const userId = currentUser.value?.id
    if (!userId) {
      throw new Error('User ID is not defined')
    }

    useAlert({
      text: 'Hello There',
      closed: () => console.log('Alert was closed')
    })
    const response = await fetch('/api/user/logout', { method: 'POST', body: JSON.stringify({ userId: userId }) })
    if (response.status !== 200) {
      console.log('Failed to logout')
    } else {
      displayLogin.value = true
      currentUser.value = undefined
    }
  }
</script>
