import { PlaceEnvironment, Squad } from './types'


function targetToImageIndex(index: number, squad: Squad): number {
  const { top, left, height, width } = squad.target
  return (top + Math.floor(index / height)) * 1024 + left + index % width
}

function draw(squad: Squad, image: Uint8Array): number {
  let pixel = squad.nextPixel
  for (let i = 0; i < squad.memberCount; i++) {
    if (squad.target.target[pixel] === 4 && squad.target.target[pixel + 1] === 4 && squad.target.target[pixel + 2] === 4) {
      pixel = (pixel + 3) % (1024 * 1024)
      continue
    }
    image[targetToImageIndex(pixel, squad)] = squad.target.target[pixel]
    pixel = pixel % (1024 * 1024)
    image[targetToImageIndex(pixel, squad)] = squad.target.target[pixel]
    pixel = pixel % (1024 * 1024)
    image[targetToImageIndex(pixel, squad)] = squad.target.target[pixel]
    pixel = pixel % (1024 * 1024)
  }
  return (squad.nextPixel + squad.memberCount) % (squad.target.width * squad.target.height)
}

export default async function(state: DurableObjectState, env: PlaceEnvironment) {
  const writes = []
  const squads = await state.storage.list<Squad>({ prefix: 'squad_' })
  for (const squad of squads.values()) {
    const nextPixel = draw(squad, env.IMAGE)
    writes.push(state.storage.put<Squad>(`squad_${squad.id}`, { ...squad, nextPixel }))
  }
  await Promise.all(writes)
}
