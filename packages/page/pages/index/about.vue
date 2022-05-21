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
        Cloudflare is much more than a reverse proxy protecting your origins from DDoS attacks.
        They have a wide range of products for developers, including Workers, Pages, KV, Durable Objects, R2 and more
        (we'll discuss each one used later).
      </Text>
      <Text>
        The challenge this year is to build something with at least two of these products,
        with a team of up to 10 people, in just one week.
        After some discussion, the three of us started to gather ideas for the project we would be building.
      </Text>
      <Text sectiontitle>
        Deciding what to build
      </Text>
      <Text>
        The theme is "real-time, collaborative applications", so first we started thinking about co-op games.
        The first idea to form was a game with programmable robots that could communicate with each other.
        Unfortunately creating a block-based language to be used for programming, an interpreter for the language
        and interesting problems to be solved using said robots would require more time.
      </Text>
      <Text>
        We shifted our idea slightly from games to images.
        Following the idea of collaborative "robots"
        (now <Text italic part>
          agents
        </Text>) we agreed to create a platform where
        <Text italic part>
          squads
        </Text>
        can all be part of a painting, like <AutoLink href="https://www.reddit.com/r/place/" :weight="500">
          r/place
        </AutoLink>.
      </Text>
      <Text subtitle>
        Let's get building
      </Text>
      <Text sectiontitle>
        17 May, Tuesday
      </Text>
      <Text>
        We've spent the little time we had on Tuesday discussing ideas,
        discussing how they would work and how we could pull it off in one week.
        Eventually we landed on worker.place, a collaborative image composing system.
      </Text>
      <Text sectiontitle>
        18 May, Wednesday
      </Text>
      <Text>
        Wednesday was planning day. We started with a basic diagram of possible interactions.
        Then we created some sketches of the UI, and decided that we would use
        <AutoLink href="https://paintbrush.danifoldi.com" :weight="500">
          Paintbrush
        </AutoLink> as our UI library, and <AutoLink href="https://github.com/NeoAren/comet" :weight="500">
          comet
        </AutoLink> as our routing framework.
      </Text>
      <Text>
        As a first step, we created the <AutoLink href="https://github.com/worker-place/worker-place" :weight="500">
          GitHub repository
        </AutoLink>, came up with a color scheme, logo and name.
      </Text>
      <Text>Then, we started building a basic PoC, </Text>
      <Text sectiontitle>
        19 May, Thursday
      </Text>
      <Text sectiontitle>
        20 May, Friday
      </Text>
      <Text sectiontitle>
        21 May, Saturday
      </Text>
      <Text sectiontitle>
        22 May, Sunday
      </Text>
      <Text sectiontitle>
        23 May, Monday
      </Text>
      <Text sectiontitle>
        24 May, Tuesday
      </Text>
      <Text subtitle>
        Thank you for reading, we hope you enjoy worker.place
      </Text>
      <Text sectiontitle>
        Meet the Team
      </Text>
      <Text>todo</Text>
    </Container>
  </Container>
</template>
