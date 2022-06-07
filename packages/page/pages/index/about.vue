<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <Container article max>
    <Container padded>
      <Text center title>
        This is the origin story of worker.place
      </Text>
      <Text italic>
        worker.place was made in (update, more than) one week for
        <AutoLink href="https://blog.cloudflare.com/announcing-our-spring-developer-challenge/" :weight="500">
          Cloudflare 2022 Spring Developer Challenge
        </AutoLink>
      </Text>
      <Text subtitle>
        Introduction
      </Text>
      <Text>
        Originally, the challenge had a very short deadline of just one week. We set out to create a place where squads can compete to draw their desired image in our <Text italic part>
          place
        </Text>.
      </Text>
      <Text>
        The idea is simple: every 20 seconds, your squad gets to paint one pixel for each member - automatically (may sound somewhat familia <AutoLink href="https://reddit.com/r/place" :weight="500">r/place</AutoLink>)
      </Text>
      <Text subtitle>
        The challenge
      </Text>
      <Text>
        Cloudflare challenged their community to develop a real-time app using at least two of Workers, Pages, KV, Durable Objects (and later confirmed R2 is also in the list). Our goal is to use <Text bold part>
          all
        </Text> of them.
      </Text>
      <Text subtitle>
        How worker.place uses Workers (and other cool tech)
      </Text>
      <Text>
        We use one Worker (page) to server-side render the page. It is also the one responsible for proxying R2 requests to the R2 bucket storing all squad target images.
      </Text>
      <Text>
        We use Pages to serve static assets very quickly (unfortunately Functions doesn't yet support all features we needed). <AutoLink href="https://walshy.rocks" :weight="200">walshy.rocks</AutoLink>?
      </Text>
      <Text>
        We use KV to store session tokens (don't worry, hashed) and temporarily the snapshots of worker.place.
      </Text>
      <Text>
        We heavily rely on our 'Place' Durable Object, it's singleton manages squads with their target images, and the place itself.<br></br>
        It contains the alarm responsible for updating the place, and then pushing the update to all connected users (and the snapshots).
      </Text>
      <Text>
        As mentioned above, we use R2 to store all past snapshots of the place, as well as all target images of squads.
      </Text>
      <Text important italic>5 > 2</Text>
      <Text>
        For mode details, feel free to check our <AutoLink href="https://github.com/worker-place/worker-place" :weight="500">GitHub repo</AutoLink>.
      </Text>
      <Text subtitle>
        Meet the team
      </Text>
      <Text>
        We are a team of 4 university students, and we agreed not to put long paragraphs of text here, instead just have some links:
      </Text>
      <Container gap="8px" grid="repeat(4, 1fr)">
        <Card center>
          <Image alt="photo of Andris" rounded source="/assets/andris.jpg" />
          <Text>András Ádám</Text>
          <Container grid="repeat(2, 1fr)">
            <IconLink href="https://linkedin.com/in/andras-adam/" icon="linkedin-logo" icon-size="24px" />
            <IconLink href="https://github.com/NeoAren" icon="github-logo" icon-size="24px" />
          </Container>
        </Card>
        <Card center>
          <Image alt="photo of Csongor" rounded source="/assets/csongor.jpeg" />
          <Text>Csongor Beke</Text>
          <Container grid="">
            <IconLink href="https://linkedin.com/in/csongorbeke/" icon="linkedin-logo" icon-size="24px" />
          </Container>
        </Card>
        <Card center>
          <Image alt="photo of Dani" source="/assets/dani.jpg" />
          <Text>Dániel Földi</Text>
          <Container grid="repeat(2, 1fr)">
            <IconLink href="https://linkedin.com/in/daniel-foldi/" icon="linkedin-logo" icon-size="24px" />
            <IconLink href="https://github.com/DaniFoldi" icon="github-logo" icon-size="24px" />
          </Container>
        </Card>
        <Card center>
          <Image alt="photo of Tomi" rounded source="/assets/tomi.jpeg" />
          <Text>Tamás Ádám</Text>
          <Container grid="repeat(2, 1fr)">
            <IconLink href="https://linkedin.com/in/tomushimano/" icon="linkedin-logo" icon-size="24px" />
            <IconLink href="https://github.com/HgeX" icon="github-logo" icon-size="24px" />
          </Container>
        </Card>
      </Container>
      <Text subtitle>
        Acknowledgements
      </Text>
      <Text>
        Routing library: <AutoLink href="https://github.com/Neoaren/comet" :weight="500">comet by NeoAren</AutoLink>
      </Text>
      <Text>
        UI library: <AutoLink href="https://paintbrush.danifoldi.com" :weight="500">Paintbrush by DaniFoldi</AutoLink>
      </Text>
      <Text>
        Framework: <AutoLink href="https://v3.nuxtjs.org" :weight="500">Nuxt 3</AutoLink>
      </Text>
      <Text>
        Platform: <AutoLink href="https://workers.cloudflare.com" :weight="500">Cloudflare Workers</AutoLink> and <AutoLink href="https://pages.cloudflare.com" :weight="500">Cloudflare Pages</AutoLink> and in general <AutoLink href="https://cloudflare.com" :weight="500">Cloudflare</AutoLink>
      </Text>
      <Text>
        Special thanks to <AutoLink href="https://twitter.com/_mrbbot" :weight="500">@_mrbbot</AutoLink> for the feedback (and <AutoLink href="https://miniflare.dev" :weight="500"><Icon color="orange" name="flame" variant="fill" />Miniflare</AutoLink>).
      </Text>
    </Container>
  </Container>
</template>
