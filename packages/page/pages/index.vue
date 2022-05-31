<template>
  <SidebarContainer :wrap-content="false">
    <template #sidebar-top>
      <Container center>
        <Image alt="Paintbrush UI Logo" max-width="50%" source="/assets/icon.svg" />
      </Container>
    </template>
    <template #sidebar-middle />
    <template #sidebar-bottom>
      <Container center gap="">
        <ThemeToggle />
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
          <Button>Login</Button>
        </template>
        <template #content>
          <NuxtChild />
        </template>
      </MenubarContainer>
    </template>
  </SidebarContainer>
</template>

<script lang="ts" setup>
  onMounted(() => {
    const socket = new WebSocket('wss://worker.place/connect')

    socket.addEventListener('open', () => {
      console.log('connected')
    })

    socket.addEventListener('meessage', event => {
      console.log(event)
    })
  })
</script>
