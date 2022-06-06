<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <Container article center max>
    <Container max padded>
      <Text center title>
        How does worker.place work
      </Text>
      <Text sectiontitle>
        How can I sign up?
      </Text>
      <Text>
        You can use a GitHub account to log in, simply click the button on the top right to authorize your account.
      </Text>
      <Separator color="background" />
      <Text sectiontitle>
        How can I join a squad?
      </Text>
      <Text>
        If you know the squad id, you can enter it on the <AutoLink href="/squads" :weight="500">squads</AutoLink> page.
        Otherwise, you can browse all squads on the same page and find the one you like the most, and click the 'Join' button to join.
      </Text>
      <Separator color="background" />
      <Text sectiontitle>
        How can I create a squad?
      </Text>
      <Text>
        You can create a new squad by clicking the 'Create' button on the <AutoLink href="/squads" :weight="500">squads</AutoLink> page.
      </Text>
      <Highlight info>
        <Text bold part>Note:</Text> you can't be a member of any squad when creating a new one.
      </Highlight>
      <Separator color="background" />
      <Text sectiontitle>
        How can I delete a squad?
      </Text>
      <Text>
        The owner of a squad can delete a squad.
      </Text>
      <Highlight
        icon-color="orange"
        icon-name="warning"
        icon-variant="bold"
        warning
      >
        This is an irreversible action. You may wish transfer ownership to another member instead.
      </Highlight>
      <Separator color="background" />
      <Text sectiontitle>
        How can I transfer ownership of a squad?
      </Text>
      <Text>
        The owner of a squad can transfer ownership to another member. The previous owner will remain a member of the squad, however only the new owner can transfer ownership back.
      </Text>
      <Highlight
        icon-color="orange"
        icon-name="warning"
        icon-variant="bold"
        warning
      >
        This is an irreversible action.
      </Highlight>
      <Separator color="background" />
      <Text sectiontitle>
        Can I change the target image of a squad?
      </Text>
      <Text>
        Currently we do not allow squad target images to be changed so all members can be certain what image they are contributing to, even when they are offline.
      </Text>
      <Separator color="background" />
      <Text sectiontitle>What is worker.place all about?</Text>
      <Text>We built this site for <AutoLink href="https://blog.cloudflare.com/announcing-our-spring-developer-challenge/" :weight="500">Cloudflare's 2022 Spring Developer Challenge</AutoLink>. You can read more about this on our <AutoLink href="/about" :weight="500">about</AutoLink> page.</Text>
    </Container>
  </Container>
</template>
