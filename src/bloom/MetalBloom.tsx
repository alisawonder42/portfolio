import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { BloomCore } from './BloomCore'
import { computePlacements, petalOpenAmount, shapeSeries } from './bloomLayout'
import { useMetalMaterial } from './MetalMaterial'
import {
  createPetalGeometry,
  DEFAULT_TESSELLATION,
  lerpPetalShape,
  type PetalTessellation,
} from './petalGeometry'
import {
  deriveBudShape,
  type BloomConfig,
  type MetalFinish,
  type MetalMaterialParams,
} from './presets'

export interface MetalBloomProps {
  config: BloomConfig
  /** Sampled every frame; the target openness in [0,1]. */
  getBloom: () => number
  /** Time constant (seconds) of the easing toward the target openness. */
  responsiveness?: number
  finish?: MetalFinish
  materialParams?: Partial<MetalMaterialParams>
  tessellation?: PetalTessellation
  /** Slow idle rotation about the bloom axis, radians per second. */
  idleSpin?: number
}

/**
 * The Metal Bloom. Petals are individually placed on a golden-angle spiral,
 * each one a thick procedural shell that both rotates open and morphs from a
 * furled bud shape to its open shape as the global `bloom` value rises.
 */
export function MetalBloom({
  config,
  getBloom,
  responsiveness = 0.35,
  finish,
  materialParams,
  tessellation = DEFAULT_TESSELLATION,
  idleSpin = 0.06,
}: MetalBloomProps) {
  const { layout, core } = config
  const material = useMetalMaterial(finish ?? config.finish, materialParams)

  const placements = useMemo(() => computePlacements(layout), [layout])

  const geometries = useMemo(() => {
    const open = shapeSeries(
      config.petalInner,
      config.petalOuter,
      layout.shapeSteps,
      lerpPetalShape,
    )
    const budInner = config.budInner ?? deriveBudShape(config.petalInner)
    const budOuter = config.budOuter ?? deriveBudShape(config.petalOuter)
    const bud = shapeSeries(budInner, budOuter, layout.shapeSteps, lerpPetalShape)
    return open.map((shape, i) => createPetalGeometry(shape, bud[i], tessellation))
  }, [
    config.petalInner,
    config.petalOuter,
    config.budInner,
    config.budOuter,
    layout.shapeSteps,
    tessellation,
  ])

  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries])

  const root = useRef<THREE.Group>(null)
  const tilts = useRef<Array<THREE.Group | null>>([])
  const meshes = useRef<Array<THREE.Mesh | null>>([])
  const anim = useRef({ bloom: 0, spin: 0 })

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const state = anim.current
    const target = THREE.MathUtils.clamp(getBloom(), 0, 1)
    // Frame-rate independent exponential easing.
    state.bloom += (target - state.bloom) * (1 - Math.exp(-dt / Math.max(responsiveness, 1e-3)))

    state.spin += idleSpin * dt
    if (root.current) root.current.rotation.y = state.spin

    for (let i = 0; i < placements.length; i++) {
      const p = placements[i]
      const open = petalOpenAmount(p, state.bloom, layout.stagger)
      const tilt = tilts.current[i]
      if (tilt) tilt.rotation.x = THREE.MathUtils.lerp(p.closedTilt, p.openTilt, open)
      const mesh = meshes.current[i]
      if (mesh?.morphTargetInfluences) mesh.morphTargetInfluences[0] = 1 - open
    }
  })

  // Geometry identity is part of the key so React remounts meshes (and their
  // morph-target bookkeeping) when the shape set is regenerated.
  const geometryKey = geometries[0]?.uuid ?? 'none'

  return (
    <group ref={root}>
      {placements.map((p) => (
        <group key={`${p.index}-${geometryKey}`} rotation-y={p.angle}>
          <group
            ref={(el) => {
              tilts.current[p.index] = el
            }}
            position={[0, p.height, p.radius]}
            rotation-x={p.closedTilt}
          >
            <mesh
              ref={(el) => {
                meshes.current[p.index] = el
                if (el) {
                  el.updateMorphTargets()
                  if (el.morphTargetInfluences) el.morphTargetInfluences[0] = 1
                }
              }}
              geometry={geometries[Math.min(p.shapeIndex, geometries.length - 1)]}
              material={material}
              scale={p.scale}
            />
          </group>
        </group>
      ))}
      <BloomCore core={core} material={material} />
    </group>
  )
}
