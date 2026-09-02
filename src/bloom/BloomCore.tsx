import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { GOLDEN_ANGLE } from './bloomLayout'
import type { CoreParams } from './presets'

interface BloomCoreProps {
  core: CoreParams
  material: THREE.Material
}

/**
 * The centre of the flower: a receptacle the petals grow from, and optionally
 * a cluster of stamen beads packed in a Fermat spiral over a spherical cap.
 */
export function BloomCore({ core, material }: BloomCoreProps) {
  const beads = useRef<THREE.InstancedMesh>(null)
  const beadCount = Math.max(1, Math.round(core.beadCount))

  const beadTransforms = useMemo(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3()
    const p = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    const list: THREE.Matrix4[] = []
    const capRadius = core.radius * 0.92
    for (let i = 0; i < beadCount; i++) {
      const t = (i + 0.5) / beadCount
      // Spherical cap: polar angle grows with √t so beads are evenly spaced.
      const polar = Math.sqrt(t) * (Math.PI * 0.42)
      const az = i * GOLDEN_ANGLE
      const r = Math.sin(polar) * capRadius
      dir.set(Math.cos(az) * Math.sin(polar), Math.cos(polar), Math.sin(az) * Math.sin(polar))
      p.set(Math.cos(az) * r, Math.cos(polar) * capRadius + core.beadHeight, Math.sin(az) * r)
      q.setFromUnitVectors(up, dir)
      const scale = core.beadRadius * (1 - t * 0.35)
      s.set(scale, scale * 1.35, scale)
      list.push(m.clone().compose(p, q, s))
    }
    return list
  }, [beadCount, core.beadHeight, core.beadRadius, core.radius])

  useLayoutEffect(() => {
    const mesh = beads.current
    if (!mesh) return
    beadTransforms.forEach((m, i) => mesh.setMatrixAt(i, m))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [beadTransforms])

  if (core.style === 'none') return null

  return (
    <group>
      {/* Receptacle: a squashed sphere the petal bases sit on. */}
      <mesh
        material={material}
        scale={[core.radius, core.radius * 0.7, core.radius]}
        position={[0, 0.02, 0]}
      >
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>
      {core.style === 'dome' && (
        <mesh material={material} scale={core.radius * 0.7} position={[0, core.beadHeight, 0]}>
          <sphereGeometry args={[1, 48, 32]} />
        </mesh>
      )}
      {core.style === 'beads' && (
        <instancedMesh
          key={beadCount}
          ref={beads}
          args={[undefined, material, beadCount]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, 16, 12]} />
        </instancedMesh>
      )}
    </group>
  )
}
