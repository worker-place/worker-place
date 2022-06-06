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
      <Separator color="secondary" />
      <Text sectiontitle>
        How can I join a squad?
      </Text>
      <Text>
        If you know the squad id, you can enter it on the <AutoLink href="/squads" :weight="500">squads</AutoLink> page.
        Otherwise, you can browse all squads on the same page and find the one you like the most, and click the 'Join' button to join.
      </Text>
      <Separator color="secondary" />
      <Text sectiontitle>
        How can I create a squad?
      </Text>
      <Text>
        You can create a new squad by clicking the 'Create' button on the <AutoLink href="/squads" :weight="500">squads</AutoLink> page.
      </Text>
      <Text>
        <Text bold part>Note:</Text> you can't be a member of any squad when creating a squad.
      </Text>
      <Separator color="secondary" />
      <Text sectiontitle>
        How can I delete a squad?
      </Text>
      <Text>
        If you know the squad id, you can enter it on the <AutoLink href="/squads" :weight="500">squads</AutoLink> page.
      </Text>
      <Separator color="secondary" />
      <Text sectiontitle>
        How can I transfer ownership of a squad?
      </Text>
      <Text>
        If you know the squad id, you can enter it on the <AutoLink href="/squads" :weight="500">squads</AutoLink> page.
      </Text>
      <Separator color="secondary" />
    </Container>
  </Container>
</template>
