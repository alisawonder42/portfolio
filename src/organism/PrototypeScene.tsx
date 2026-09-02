import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

import { ArticulatedVine } from './ArticulatedVine'

/** Restrained model-viewer motion only; the articulation itself remains static for morphology review. */
function PrototypeStage() {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    const ease = 1 - Math.exp(-Math.min(delta, 0.05) / 0.45)
    node.rotation.y += (pointer.current.x * 0.12 - node.rotation.y) * ease
    node.rotation.x += (-pointer.current.y * 0.035 - node.rotation.x) * ease
  })

  return (
    <group ref={group} position={[0.15, -0.18, 0]} rotation={[0, -0.08, -0.015]}>
      <ArticulatedVine />
    </group>
  )
}

/**
 * Unpolished morphology-review scene: basic rough grey materials, simple direct
 * lights, no environment map, custom shader, chrome, or post-processing.
 */
export function PrototypeScene() {
  return (
    <Canvas
      orthographic
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12], zoom: 90, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      flat
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-4, 6, 8]} intensity={2.2} />
      <directionalLight position={[5, 1, 4]} intensity={0.85} />
      <PrototypeStage />
    </Canvas>
  )
}
