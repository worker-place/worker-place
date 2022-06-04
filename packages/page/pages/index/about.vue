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
        The idea is simple: every 20 seconds, your squad gets to paint one pixel for each member (Sounds familia <AutoLink href="https://reddit.com/r/place">
          r/place
        </AutoLink>?)
      </Text>
      <Text subtitle>
        The challenge
      </Text>
      <Text>
        Cloudflare challenged their community to develop a collaborative tool/game/anything using at least two of Workers, Pages, KV, Durable Objects (and later confirmed R2 is also in the list). Our goal is to use <Text bold part>
          all
        </Text> of them.
      </Text>
      <Text subtitle>
        How we built worker.place
      </Text>
      <Text subtitle>
        Meet the team
      </Text>
      <Text subtitle>
        Acknowledgements
      </Text>
      <Text>
        Routing library: <AutoLink href="https://github.com/Neoaren/comet">
          comet by NeoAren
        </AutoLink>
      </Text>
      <Text>
        UI library: <AutoLink href="https://paintbrush.danifoldi.com">
          Paintbrush by DaniFoldi
        </AutoLink>
      </Text>
      <Text>
        Framework: <AutoLink href="https://v3.nuxtjs.org">
          Nuxt 3
        </AutoLink>
      </Text>
      <Text>Still todo</Text>
    </Container>
  </Container>
</template>
