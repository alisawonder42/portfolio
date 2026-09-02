import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

import { ArticulatedVine } from './ArticulatedVine'
import { useSculptureMaterials } from './materials'
import { useOrganismDriver } from './useOrganismDriver'

function QuietStudio() {
  return (
    <Environment resolution={64} frames={1} background={false} environmentIntensity={0.38}>
      <Lightformer
        form="rect"
        intensity={0.85}
        color="#f3efe6"
        position={[0, 4.6, 1]}
        rotation={[-Math.PI / 2.2, 0, 0]}
        scale={[8, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#ffffff"
        position={[-3.8, 2.4, 3.2]}
        rotation={[0, Math.PI / 3.2, Math.PI / 2.2]}
        scale={[0.22, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.55}
        color="#d8dee6"
        position={[4.6, 1.4, 2]}
        scale={[2.4, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.22}
        color="#3a3c40"
        position={[0, -3.6, 0]}
        rotation={[Math.PI / 2.2, 0, 0]}
        scale={[10, 8, 1]}
      />
    </Environment>
  )
}

function OrganismRig() {
  const materials = useSculptureMaterials()
  const { state, tick } = useOrganismDriver()
  const vine = useRef<THREE.Group>(null)
  const [pose, setPose] = useState({ growth: 0.16, bloom1: 0, bloom2: 0, bloom3: 0 })

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const s = tick(dt)
    const g = s.growth
    const node = vine.current
    if (node) {
      node.position.x = 1.18
      node.position.y = THREE.MathUtils.lerp(2.22, 0.1, g)
      node.position.z = 0
      node.scale.setScalar(THREE.MathUtils.lerp(1.08, 0.56, g))
    }

    setPose((prev) => {
      if (
        Math.abs(prev.growth - s.growth) < 0.007 &&
        Math.abs(prev.bloom1 - s.bloom1) < 0.01 &&
        Math.abs(prev.bloom2 - s.bloom2) < 0.01 &&
        Math.abs(prev.bloom3 - s.bloom3) < 0.01
      ) {
        return prev
      }
      return { growth: s.growth, bloom1: s.bloom1, bloom2: s.bloom2, bloom3: s.bloom3 }
    })
  })

  return (
    <group ref={vine} position={[1.18, 2.22, 0]} scale={1.08}>
      <ArticulatedVine
        materials={materials}
        getState={() => state.current}
        growth={pose.growth}
        bloom1={pose.bloom1}
        bloom2={pose.bloom2}
        bloom3={pose.bloom3}
      />
    </group>
  )
}

/**
 * Page-length organism: satin metals, quiet studio light, no chrome and no
 * post-processing. The vine stays fixed while the document scrolls.
 */
export function OrganismScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0.18, 0.02, 8.2], fov: 28, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.04,
      }}
      style={{ background: 'transparent' }}
    >
      <QuietStudio />
      <hemisphereLight args={['#f4f0e8', '#8d8880', 0.7]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[-4.2, 5.5, 6.5]} intensity={2.15} color="#fff6ea" />
      <directionalLight position={[5.2, 1.6, 3.4]} intensity={0.48} color="#e4ebf2" />
      <directionalLight position={[1.2, 7, -2]} intensity={0.22} color="#f0ebe3" />
      <OrganismRig />
    </Canvas>
  )
}
