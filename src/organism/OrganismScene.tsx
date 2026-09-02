import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

import { ArticulatedVine } from './ArticulatedVine'
import { useSculptureMaterials } from './materials'
import { smoothstep } from './state'
import { useOrganismDriver } from './useOrganismDriver'

/**
 * A soft gallery box: one broad overhead source, a tall side strip for the
 * specular highlight down the members, and a dark floor card so polished edges
 * have something to fall off into. No HDR, no chrome.
 */
function QuietStudio() {
  return (
    <Environment resolution={128} frames={1} background={false} environmentIntensity={0.95}>
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#fffaf2"
        position={[0, 5, 1.5]}
        rotation={[-Math.PI / 2.1, 0, 0]}
        scale={[9, 9, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.6}
        color="#ffffff"
        position={[-3.4, 1.8, 3.4]}
        rotation={[0, Math.PI / 3, Math.PI / 2.1]}
        scale={[0.3, 9, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.5}
        color="#e6ecf3"
        position={[4.4, 1.2, 2.6]}
        rotation={[0, -Math.PI / 3.4, 0]}
        scale={[2, 7, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.5}
        color="#2f3238"
        position={[0, -4, 1]}
        rotation={[Math.PI / 2.1, 0, 0]}
        scale={[12, 9, 1]}
      />
    </Environment>
  )
}

function OrganismRig() {
  const materials = useSculptureMaterials()
  const { state, tick } = useOrganismDriver()
  const vine = useRef<THREE.Group>(null)
  const [pose, setPose] = useState({ growth: 0, bloom1: 0, bloom2: 0, bloom3: 0 })

  useFrame((frame, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const s = tick(dt)
    const node = vine.current
    if (node) {
      // Pull back in step with the stem so the growing tip stays in frame.
      const framing = smoothstep(0, 0.78, s.growth)
      // A portrait viewport is far narrower in world units than a landscape one,
      // so the offset that seats the vine beside desktop copy pushes it off a
      // phone screen entirely. Draw it in and shrink it as the frame narrows.
      const aspect = frame.size.width / Math.max(frame.size.height, 1)
      const narrow = THREE.MathUtils.clamp((1.1 - aspect) / 0.5, 0, 1)

      node.position.x = THREE.MathUtils.lerp(THREE.MathUtils.lerp(1.24, 1.14, framing), 0.1, narrow)
      node.position.y = THREE.MathUtils.lerp(2.02, 0.02, framing) + 0.45 * narrow
      node.scale.setScalar(
        THREE.MathUtils.lerp(0.86, 0.42, framing) * THREE.MathUtils.lerp(1, 0.62, narrow),
      )
    }

    setPose((prev) => {
      if (
        Math.abs(prev.growth - s.growth) < 0.004 &&
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
    <group ref={vine} position={[1.24, 2.02, 0]} scale={0.86}>
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
      dpr={[1, 1.75]}
      camera={{ position: [0.1, 0, 8.2], fov: 28, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.98,
      }}
      style={{ background: 'transparent' }}
    >
      <QuietStudio />
      <hemisphereLight args={['#fffaf1', '#9a958c', 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-4, 5.5, 6]} intensity={1.9} color="#fff7ec" />
      <directionalLight position={[5, 1.4, 3]} intensity={0.7} color="#e8eef5" />
      <directionalLight position={[1, 6, -3]} intensity={0.5} color="#f2ede5" />
      <OrganismRig />
    </Canvas>
  )
}
