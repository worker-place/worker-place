<template>
  <SidebarContainer :wrap-content="false">
    <template #sidebar-top>
      <Container center>
        <Image alt="Paintbrush UI Logo" max-width="50%" source="/paintbrush.svg" />
      </Container>
    </template>
    <template #sidebar-middle>
      <SidebarLink href="/" icon="rocket-launch">
        Welcome
      </SidebarLink>
      <SidebarLink href="/getting-started" icon="code" icon-color="green">
        Basic Use
      </SidebarLink>
      <SidebarLink href="/docs" icon="flask" icon-color="orange">
        Docs
      </SidebarLink>
      <SidebarLink
        href="https://github.com/DaniFoldi/Paintbrush"
        icon="github-logo"
        icon-color="purple"
      >
        Source
      </SidebarLink>
      <SidebarLink
        href="/test"
        icon="gear"
        icon-color="lightergray"
      >
        Test
      </SidebarLink>
    </template>
    <template #sidebar-bottom>
      <PoweredBy />
    </template>
    <template #content>
      <NuxtPage />
    </template>
  </SidebarContainer>
</template>
