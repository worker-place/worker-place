import { PlaceEnvironment, Squad } from './types'


function targetToImageIndex(index: number, squad: Squad): number {
  const { top, left, height, width } = squad.target
  const x = (left * 3) + index % (width * 3)
  const y = top + Math.floor(index / height)
  return y * (1024 * 3) + x
}

function draw(squad: Squad, image: Uint8Array): number {
  console.log('draw', squad.id, squad.nextPixel, squad.memberCount, squad.target.top, squad.target.left, squad.target.height, squad.target.width)
  let pixel = squad.nextPixel
  for (let i = 0; i < squad.memberCount; i++) {
    if (squad.target.target[pixel] === 4 && squad.target.target[pixel + 1] === 4 && squad.target.target[pixel + 2] === 4) {
      pixel = (pixel + 3) % (1024 * 1024 * 3)
      continue
    }
    image[targetToImageIndex(pixel, squad)] = squad.target.target[pixel]
    pixel = (pixel + 1) % (1024 * 1024 * 3)
    image[targetToImageIndex(pixel, squad)] = squad.target.target[pixel]
    pixel = (pixel + 1) % (1024 * 1024 * 3)
    image[targetToImageIndex(pixel, squad)] = squad.target.target[pixel]
    pixel = (pixel + 1) % (1024 * 1024 * 3)
  }
  return (squad.nextPixel + squad.memberCount * 3) % (squad.target.width * squad.target.height * 3)
}

export default async function(state: DurableObjectState, env: PlaceEnvironment) {
  console.log('[Place DO] (update): begin')
  const writes = []
  const squads = await state.storage.list<Squad>({ prefix: 'squad_' })
  for (const squad of squads.values()) {
    const nextPixel = draw(squad, env.IMAGE)
    writes.push(state.storage.put<Squad>(`squad_${squad.id}`, { ...squad, nextPixel }))
  }
  await Promise.all(writes)
  console.log('[Place DO] (update): end')
}
