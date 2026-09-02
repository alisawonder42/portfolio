import { Environment, Lightformer } from '@react-three/drei'

/**
 * A procedural studio light rig baked into an environment map. Metal only
 * reads as metal through what it reflects, so the rig is built from long,
 * soft strips (for elongated highlights along the petals) plus a large cool
 * overhead card and a warm low fill, with no network HDR dependency.
 */
export function StudioEnvironment({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1} background={false} environmentIntensity={intensity}>
      <color attach="background" args={['#05060a']} />
      {/* Overhead softbox */}
      <Lightformer
        form="rect"
        intensity={3}
        color="#dfe6ff"
        position={[0, 5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[6, 6, 1]}
      />
      {/* Long key strip, upper left */}
      <Lightformer
        form="rect"
        intensity={6}
        color="#ffffff"
        position={[-4, 3, 2]}
        rotation={[0, Math.PI / 3, Math.PI / 2.4]}
        scale={[0.9, 9, 1]}
      />
      {/* Long rim strip, upper right */}
      <Lightformer
        form="rect"
        intensity={4}
        color="#e9f0ff"
        position={[4.5, 2.5, -1]}
        rotation={[0, -Math.PI / 2.6, -Math.PI / 2.6]}
        scale={[0.7, 8, 1]}
      />
      {/* Warm low fill from the front */}
      <Lightformer
        form="ring"
        intensity={1.4}
        color="#ffd7b0"
        position={[0, -3, 5]}
        rotation={[Math.PI / 3, 0, 0]}
        scale={[5, 5, 1]}
      />
      {/* Faint back card so the far side of petals is not pure black */}
      <Lightformer
        form="rect"
        intensity={0.8}
        color="#8ea0c8"
        position={[0, 0.5, -6]}
        rotation={[0, Math.PI, 0]}
        scale={[8, 4, 1]}
      />
    </Environment>
  )
}
