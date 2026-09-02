import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

import { ArticulatedVine } from './ArticulatedVine'
import { useSculptureMaterials } from './materials'
import { useOrganismDriver } from './useOrganismDriver'

function QuietStudio() {
  return (
    <Environment resolution={256} frames={1} background={false} environmentIntensity={0.58}>
      <Lightformer
        form="rect"
        intensity={1.15}
        color="#f4f1ea"
        position={[0, 4.5, 1]}
        rotation={[-Math.PI / 2.2, 0, 0]}
        scale={[7, 7, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#ffffff"
        position={[-3.6, 2.2, 3]}
        rotation={[0, Math.PI / 3.2, Math.PI / 2.2]}
        scale={[0.35, 7, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.55}
        color="#e4eaf0"
        position={[4, 0.4, 2]}
        scale={[3.5, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.28}
        color="#d8d2c6"
        position={[0, -3.2, 1]}
        rotation={[Math.PI / 2.4, 0, 0]}
        scale={[8, 4, 1]}
      />
    </Environment>
  )
}

function OrganismRig() {
  const materials = useSculptureMaterials()
  const { state, tick } = useOrganismDriver()
  const vine = useRef<THREE.Group>(null)
  const [pose, setPose] = useState({ growth: 0.27, bloom1: 0, bloom2: 0, bloom3: 0 })

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const s = tick(dt)
    const g = s.growth
    const node = vine.current
    if (node) {
      node.position.y = THREE.MathUtils.lerp(2.55, 0.08, g)
      node.position.x = 0.55
      node.scale.setScalar(THREE.MathUtils.lerp(1.08, 0.8, g))
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
    <group ref={vine} position={[0.55, 2.55, 0]} scale={1.08}>
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
      camera={{ position: [2.05, -0.15, 6.2], fov: 30, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.02,
      }}
      style={{ background: 'transparent' }}
    >
      <QuietStudio />
      <ambientLight intensity={0.42} />
      <directionalLight position={[-3, 5, 6]} intensity={1.15} color="#fff7ee" />
      <directionalLight position={[4, 1, 3]} intensity={0.35} color="#e8eef4" />
      <OrganismRig />
    </Canvas>
  )
}
