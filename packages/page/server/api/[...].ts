import { defineEventHandler, useMethod, useRawBody, appendHeader } from 'h3'
import { fetch } from 'ohmyfetch'


export default defineEventHandler(async event => {
  let url: string | URL = event.req.url as string
  try {
    url = new URL(url)
  } catch {
    url = new URL(url, 'http://localhost:8787')
  }
  const body = useMethod(event) === 'GET' ? {} : { body: await useRawBody(event) }
  const request = new Request(url.toString(), {
    headers: event.req.headers as Record<string, string>,
    method: useMethod(event),
    ...body
  })
  const response = await fetch(request)

  event.res.statusCode = response.status
  event.res.statusMessage = response.statusText
  for (const header of response.headers.entries()) {
    if (header[0] === 'content-encoding') {
      continue
    }
    appendHeader(event, header[0], header[1])
  }

  const t = await response.text()
  return t
})
