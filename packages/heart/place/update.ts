import { PlaceEnvironment, SquadMeta, SquadTarget } from './types'


function targetToImageIndex(index: number, target: SquadTarget): number {
  return (target.top + Math.floor(index / target.height)) * 1024 + target.left + index % target.width
}

function draw(target: SquadTarget, meta: SquadMeta, image: Uint8Array): number {
  let pixel = meta.nextPixel
  for (let i = 0; i < meta.memberCount; i++) {
    image[targetToImageIndex(pixel, target)] = target.target[pixel]
    pixel = pixel % (1024 * 1024)
  }
  return (meta.nextPixel + meta.memberCount) % (target.width * target.height)
}

export default async function(state: DurableObjectState, env: PlaceEnvironment) {
  const squads = await state.storage.get('squads') as string[] ?? []
  // todo parallelize reads with promise.all
  const writes = []
  for (const squad of squads) {
    const target = await state.storage.get(`squad_target_${squad}`) as SquadTarget
    const meta = await state.storage.get(`squad_meta_${squad}`) as SquadMeta
    const nextPixel = draw(target, meta, env.IMAGE)
    writes.push(state.storage.put(`squad_meta_${squad}`, {...meta, nextPixel}))
  }
  await Promise.all(writes)
}
