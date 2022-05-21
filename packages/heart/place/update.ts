import { PlaceEnvironment, SquadMeta, SquadTarget } from './types'


function draw(target: SquadTarget, meta: SquadMeta, image: Uint8Array): number {
  // todo update pixels
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
