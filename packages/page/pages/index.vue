<template>
  <SidebarContainer :wrap-content="false">
    <template #sidebar-top>
      <Container center>
        <Image alt="Paintbrush UI Logo" max-width="50%" source="/assets/icon.svg" />
      </Container>
    </template>
    <template #sidebar-middle />
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
          <MenubarLink href="/about">
            about
          </MenubarLink>
          <MenubarLink href="/faq">
            faq
          </MenubarLink>
        </template>
        <template #menubar-right>
          <IconButton
            v-if="displayLogin"
            color="white"
            icon="github-logo"
            @click="loginWithGitHub"
          >
            Login
          </IconButton>
        </template>
        <template #content>
          <NuxtChild />
        </template>
      </MenubarContainer>
    </template>
  </SidebarContainer>
</template>

<script lang="ts" setup>
  function loginWithGitHub() {
    const clientId = useRuntimeConfig().public.GITHUB_OAUTH_CLIENT_ID
    location.replace(`https://github.com/login/oauth/authorize?client_id=${clientId}`)
  }

  const user = useUser()
  const squad = useSquad()
  const displayLogin = ref<boolean>(true)

  onMounted(async () => {
    const response = await fetch('/api/user/current', { method: 'GET' })
    const body = response.headers.get('content-type') === 'application/json' ? await response.json() : {}
    console.log('fetch user data', response.status, body)
    if (response.status === 200) {
      user.value = body.user
      squad.value = body.squad
      displayLogin.value = false
    }
  })
</script>
