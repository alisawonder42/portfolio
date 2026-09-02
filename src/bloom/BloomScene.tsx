import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'

import { MetalBloom, type MetalBloomProps } from './MetalBloom'
import { StudioEnvironment } from './StudioEnvironment'

interface StageProps {
  /** Base pitch of the bloom toward the camera (radians). */
  pitch: number
  /** Strength of pointer-driven parallax (radians at the viewport edge). */
  parallax: number
  children: ReactNode
}

/** Holds the bloom, pitched toward the viewer and gently following the pointer. */
function Stage({ pitch, parallax, children }: StageProps) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (parallax === 0) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onLeave = () => {
      pointer.current.x = 0
      pointer.current.y = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [parallax])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const k = 1 - Math.exp(-Math.min(delta, 0.05) / 0.4)
    const targetX = pitch + pointer.current.y * parallax * 0.6
    const targetZ = -pointer.current.x * parallax
    g.rotation.x += (targetX - g.rotation.x) * k
    g.rotation.z += (targetZ - g.rotation.z) * k
  })

  return (
    <group ref={group} rotation-x={pitch}>
      {children}
    </group>
  )
}

export interface BloomSceneProps extends MetalBloomProps {
  className?: string
  /** Camera distance from the bloom centre. */
  distance?: number
  pitch?: number
  parallax?: number
  /** Vertical offset of the bloom in scene units (positive moves it up). */
  offsetY?: number
  environmentIntensity?: number
  /** Extra scene content (lab helpers, etc.). */
  children?: ReactNode
}

/**
 * Canvas wrapper for the Metal Bloom with the studio lighting rig, colour
 * management and the pointer-reactive stage already wired up.
 */
export function BloomScene({
  className,
  distance = 2.9,
  pitch = 0.95,
  parallax = 0.12,
  offsetY = 0,
  environmentIntensity = 1,
  children,
  ...bloom
}: BloomSceneProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.15, distance], fov: 32, near: 0.1, far: 20 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ background: 'transparent' }}
    >
      <StudioEnvironment intensity={environmentIntensity} />
      <group position-y={offsetY}>
        <Stage pitch={pitch} parallax={parallax}>
          <MetalBloom {...bloom} />
        </Stage>
      </group>
      {children}
    </Canvas>
  )
}
