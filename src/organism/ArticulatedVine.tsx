import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import type { SculptureMaterials } from './materials'
import { easeOutCubic, type OrganismState } from './state'

export type Point = [number, number, number]

const UP = new THREE.Vector3(0, 1, 0)
const _world = new THREE.Vector3()

function orient(from: Point, to: Point) {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const direction = end.clone().sub(start)
  const length = direction.length()
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize())
  return { midpoint: start.add(end).multiplyScalar(0.5), quaternion, length }
}

function appearAmount(growth: number, start: number, span = 0.14): number {
  return THREE.MathUtils.smoothstep(start, start + span, growth)
}

function RigidLink({
  from,
  to,
  radius = 0.04,
  material,
  appear = 1,
}: {
  from: Point
  to: Point
  radius?: number
  material: THREE.Material
  appear?: number
}) {
  if (appear < 0.02) return null
  const { midpoint, quaternion, length } = orient(from, to)
  const s = THREE.MathUtils.smootherstep(appear, 0, 1)
  return (
    <mesh position={midpoint} quaternion={quaternion} material={material} scale={[s, s, s]}>
      <cylinderGeometry args={[radius * 0.78, radius, length, 12, 1, false]} />
    </mesh>
  )
}

function RotaryJoint({
  point,
  previous,
  next,
  radius = 0.07,
  materials,
  appear = 1,
}: {
  point: Point
  previous: Point
  next: Point
  radius?: number
  materials: SculptureMaterials
  appear?: number
}) {
  if (appear < 0.08) return null
  const incoming = new THREE.Vector3(...point).sub(new THREE.Vector3(...previous)).normalize()
  const outgoing = new THREE.Vector3(...next).sub(new THREE.Vector3(...point)).normalize()
  const axle = incoming.clone().cross(outgoing)
  if (axle.lengthSq() < 1e-6) axle.set(0, 0, 1)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, axle.normalize())
  const s = THREE.MathUtils.smootherstep(appear, 0, 1)

  return (
    <group position={point} quaternion={quaternion} scale={s}>
      <mesh material={materials.joint}>
        <cylinderGeometry args={[radius, radius, radius * 0.42, 20]} />
      </mesh>
      <mesh material={materials.silver} position-y={radius * 0.22}>
        <cylinderGeometry args={[radius * 0.32, radius * 0.32, radius * 0.12, 16]} />
      </mesh>
      <mesh material={materials.graphite} rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius * 0.78, radius * 0.055, 8, 20]} />
      </mesh>
    </group>
  )
}

function ArticulatedPath({
  points,
  radiusStart = 0.048,
  radiusEnd = 0.022,
  jointScale = 1,
  materials,
  growth,
  growthStart = 0,
  growthEnd = 1,
}: {
  points: Point[]
  radiusStart?: number
  radiusEnd?: number
  jointScale?: number
  materials: SculptureMaterials
  growth: number
  growthStart?: number
  growthEnd?: number
}) {
  const local = THREE.MathUtils.smoothstep(growthStart, growthEnd, growth)
  return (
    <group>
      {points.slice(0, -1).map((point, index) => {
        const t = index / Math.max(points.length - 2, 1)
        return (
          <RigidLink
            key={`link-${index}`}
            from={point}
            to={points[index + 1]}
            radius={THREE.MathUtils.lerp(radiusStart, radiusEnd, t)}
            material={materials.stem}
            appear={appearAmount(local, t * 0.82)}
          />
        )
      })}
      {points.slice(1, -1).map((point, index) => {
        const t = index / Math.max(points.length - 3, 1)
        return (
          <RotaryJoint
            key={`joint-${index}`}
            point={point}
            previous={points[index]}
            next={points[index + 2]}
            radius={THREE.MathUtils.lerp(radiusStart * 1.55, radiusEnd * 1.55, t) * jointScale}
            materials={materials}
            appear={appearAmount(local, t * 0.82 + 0.04)}
          />
        )
      })}
    </group>
  )
}

function GeometricLeaf({
  base,
  tip,
  width = 0.16,
  materials,
  appear = 1,
}: {
  base: Point
  tip: Point
  width?: number
  materials: SculptureMaterials
  appear?: number
}) {
  const { quaternion, length } = orient(base, tip)
  const s = THREE.MathUtils.smootherstep(appear, 0, 1)
  const geometry = useMemo(() => {
    const positions = new Float32Array([
      0,
      0,
      0,
      -width * 0.7,
      length * 0.42,
      0.012,
      width * 0.7,
      length * 0.42,
      0.012,
      0,
      length,
      0,
    ])
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setIndex([0, 1, 3, 0, 3, 2])
    geo.computeVertexNormals()
    return geo
  }, [length, width])

  if (appear < 0.05) return null

  return (
    <group position={base} quaternion={quaternion} scale={s}>
      <mesh geometry={geometry} material={materials.leaf} />
      <RigidLink
        from={[0, 0, 0]}
        to={[0, length, 0]}
        radius={0.012}
        material={materials.graphite}
      />
    </group>
  )
}

function MechanicalBud({
  base,
  tip,
  materials,
  appear = 1,
  scale = 1,
}: {
  base: Point
  tip: Point
  materials: SculptureMaterials
  appear?: number
  scale?: number
}) {
  if (appear < 0.08) return null
  const { quaternion, length } = orient(base, tip)
  const s = THREE.MathUtils.smootherstep(appear, 0, 1) * scale
  return (
    <group position={base} quaternion={quaternion} scale={s}>
      <RigidLink
        from={[0, 0, 0]}
        to={[0, length * 0.42, 0]}
        radius={0.016}
        material={materials.stem}
      />
      <RotaryJoint
        point={[0, length * 0.42, 0]}
        previous={[0, 0, 0]}
        next={[0, length, 0]}
        radius={0.038}
        materials={materials}
      />
      <mesh position-y={length * 0.72} material={materials.silver}>
        <coneGeometry args={[0.07, length * 0.42, 6, 1, false]} />
      </mesh>
    </group>
  )
}

function createPetalPanel(length: number, innerW: number, outerW: number, cup: number) {
  const rows = 7
  const cols = 4
  const positions: number[] = []
  const uvs: number[] = []
  for (let i = 0; i <= rows; i++) {
    const u = i / rows
    const half = THREE.MathUtils.lerp(innerW, outerW, Math.pow(u, 0.82)) * 0.5
    const y = u * length
    for (let j = 0; j <= cols; j++) {
      const v = j / cols
      const x = THREE.MathUtils.lerp(-half, half, v)
      const z = -cup * (1 - (v * 2 - 1) ** 2) * (0.18 + 0.82 * u)
      positions.push(x, y, z)
      uvs.push(u, v)
    }
  }
  const indices: number[] = []
  const stride = cols + 1
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * stride + j
      const b = a + 1
      const c = a + stride
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export type BloomVariant = 'classic' | 'strange' | 'full'

const BLOOM_PROFILE: Record<
  BloomVariant,
  { count: number; flare: number; length: number; outer: number; twist: number; cup: number }
> = {
  classic: { count: 10, flare: 0.92, length: 0.78, outer: 0.34, twist: 0.04, cup: 0.055 },
  strange: { count: 7, flare: 1.08, length: 0.86, outer: 0.4, twist: 0.18, cup: 0.08 },
  full: { count: 12, flare: 1.02, length: 0.92, outer: 0.38, twist: 0.06, cup: 0.05 },
}

function MechanicalTrumpet({
  base,
  direction,
  materials,
  open,
  appear,
  variant = 'classic',
  scale = 1,
  roll = 0,
}: {
  base: Point
  direction: Point
  materials: SculptureMaterials
  open: number
  appear: number
  variant?: BloomVariant
  scale?: number
  roll?: number
}) {
  const profile = BLOOM_PROFILE[variant]
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(...direction).normalize()),
    [direction],
  )
  const panel = useMemo(
    () => createPetalPanel(profile.length, 0.045, profile.outer, profile.cup),
    [profile.cup, profile.length, profile.outer],
  )
  const group = useRef<THREE.Group>(null)
  const petals = useRef<Array<THREE.Group | null>>([])
  const pistil = useRef<THREE.Mesh>(null)
  const local = useRef(0)
  const { camera } = useThree()

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return
    node.getWorldPosition(_world)
    _world.project(camera)
    const d = Math.hypot(_world.x - state.pointer.x, _world.y - state.pointer.y)
    const near = Math.max(0, 1 - d / 0.58)
    local.current += (near - local.current) * (1 - Math.exp(-delta * 3.6))
    node.rotation.y = roll + (state.pointer.x - _world.x) * 0.14 * local.current
    node.rotation.x = (_world.y - state.pointer.y) * 0.1 * local.current

    const amount = easeOutCubic(THREE.MathUtils.clamp(open + local.current * 0.07, 0, 1))
    const flare = THREE.MathUtils.lerp(0.1, profile.flare, amount)
    const stretch = THREE.MathUtils.lerp(0.62, 1, amount)
    for (let index = 0; index < profile.count; index++) {
      const petal = petals.current[index]
      if (!petal) continue
      const odd = variant === 'strange' && index % 2 === 0
      petal.rotation.x = flare * (odd ? 1.08 : 1)
      petal.scale.set(1, stretch * (odd ? 1.12 : 1), 1)
    }
    if (pistil.current) {
      pistil.current.position.y = THREE.MathUtils.lerp(0.12, 0.28, amount)
      pistil.current.scale.setScalar(THREE.MathUtils.lerp(0.6, 1, amount))
    }
  })

  const s = THREE.MathUtils.smootherstep(appear, 0, 1) * scale
  if (appear < 0.06) return null

  return (
    <group position={base} quaternion={quaternion} scale={s}>
      <group ref={group}>
        <mesh position-y={-0.04} material={materials.graphite}>
          <cylinderGeometry args={[0.075, 0.11, 0.22, 16]} />
        </mesh>
        <mesh position-y={0.07} material={materials.joint} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.09, 0.014, 8, profile.count]} />
        </mesh>
        <mesh ref={pistil} position-y={0.12} material={materials.interior}>
          <cylinderGeometry args={[0.012, 0.018, 0.18, 8]} />
        </mesh>
        {Array.from({ length: profile.count }, (_, index) => {
          const angle = (index / profile.count) * Math.PI * 2
          return (
            <group
              key={index}
              ref={(el) => {
                petals.current[index] = el
              }}
              rotation-y={angle + profile.twist * (index % 3)}
              rotation-x={0.1}
            >
              <mesh geometry={panel} material={materials.silver} />
              <mesh
                geometry={panel}
                material={materials.interior}
                position-z={-0.006}
                scale={[0.92, 0.98, 1]}
              />
              <mesh position-y={profile.length * 0.48} material={materials.graphite}>
                <cylinderGeometry args={[0.007, 0.01, profile.length * 0.96, 6]} />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

const MAIN: Point[] = [
  [-0.12, -4.15, 0],
  [0.02, -3.58, 0.04],
  [-0.14, -3.02, 0.02],
  [-0.06, -2.46, -0.04],
  [0.14, -1.9, 0],
  [0.06, -1.34, 0.06],
  [-0.1, -0.78, 0.02],
  [0.04, -0.2, -0.05],
  [0.2, 0.38, 0],
  [0.12, 0.96, 0.06],
  [-0.08, 1.54, 0.02],
  [-0.16, 2.12, -0.05],
  [0.06, 2.7, 0],
  [0.02, 3.28, 0.04],
  [-0.18, 3.88, 0],
]

const BRANCHES: Point[][] = [
  [MAIN[2], [-0.48, -2.82, 0.05], [-0.88, -2.58, 0.12], [-1.28, -2.28, 0.14]],
  [MAIN[4], [0.42, -1.68, 0.06], [0.76, -1.42, 0.12], [1.08, -1.14, 0.1]],
  [MAIN[6], [-0.44, -0.52, 0.04], [-0.8, -0.18, 0.12], [-1.18, 0.06, 0.16]],
  [MAIN[7], [0.44, 0.04, 0.06], [0.84, 0.3, 0.14], [1.26, 0.52, 0.16]],
  [MAIN[9], [0.48, 1.18, 0.04], [0.86, 1.48, 0.12], [1.18, 1.76, 0.16]],
  [MAIN[11], [-0.48, 2.34, 0.05], [-0.82, 2.7, 0.12], [-1.04, 3.1, 0.14]],
  [MAIN[13], [0.36, 3.46, 0.04], [0.62, 3.82, 0.1], [0.72, 4.2, 0.12]],
]

interface VineProps {
  materials: SculptureMaterials
  getState: () => OrganismState
  growth: number
  bloom1: number
  bloom2: number
  bloom3: number
}

/**
 * Slender articulated vine. A hidden growth parameter reveals stem, branches and
 * buds from the base upward; three trumpet blooms open from their own progress.
 */
export function ArticulatedVine({
  materials,
  getState,
  growth,
  bloom1,
  bloom2,
  bloom3,
}: VineProps) {
  const root = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    const s = getState()
    const node = root.current
    if (!node) return
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, s.cursorX * 0.13, 3.2, delta)
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, -s.cursorY * 0.055, 3.2, delta)
    node.rotation.z = THREE.MathUtils.damp(node.rotation.z, -s.cursorX * 0.02, 3.2, delta)
  })

  return (
    <group ref={root}>
      <ArticulatedPath
        points={MAIN}
        radiusStart={0.05}
        radiusEnd={0.02}
        materials={materials}
        growth={growth}
        growthStart={0}
        growthEnd={1}
      />

      <ArticulatedPath
        points={BRANCHES[0]}
        radiusStart={0.028}
        radiusEnd={0.014}
        jointScale={0.82}
        materials={materials}
        growth={growth}
        growthStart={0.2}
        growthEnd={0.42}
      />
      <ArticulatedPath
        points={BRANCHES[1]}
        radiusStart={0.024}
        radiusEnd={0.012}
        jointScale={0.8}
        materials={materials}
        growth={growth}
        growthStart={0.36}
        growthEnd={0.55}
      />
      <ArticulatedPath
        points={BRANCHES[2]}
        radiusStart={0.024}
        radiusEnd={0.012}
        jointScale={0.8}
        materials={materials}
        growth={growth}
        growthStart={0.32}
        growthEnd={0.5}
      />
      <ArticulatedPath
        points={BRANCHES[3]}
        radiusStart={0.028}
        radiusEnd={0.014}
        jointScale={0.82}
        materials={materials}
        growth={growth}
        growthStart={0.48}
        growthEnd={0.7}
      />
      <ArticulatedPath
        points={BRANCHES[4]}
        radiusStart={0.022}
        radiusEnd={0.012}
        jointScale={0.78}
        materials={materials}
        growth={growth}
        growthStart={0.64}
        growthEnd={0.82}
      />
      <ArticulatedPath
        points={BRANCHES[5]}
        radiusStart={0.026}
        radiusEnd={0.013}
        jointScale={0.8}
        materials={materials}
        growth={growth}
        growthStart={0.72}
        growthEnd={0.92}
      />
      <ArticulatedPath
        points={BRANCHES[6]}
        radiusStart={0.02}
        radiusEnd={0.01}
        jointScale={0.76}
        materials={materials}
        growth={growth}
        growthStart={0.84}
        growthEnd={1}
      />

      <MechanicalTrumpet
        base={BRANCHES[0][3]}
        direction={[-0.78, 0.22, 0.42]}
        materials={materials}
        variant="classic"
        open={bloom1}
        appear={appearAmount(growth, 0.28, 0.12)}
        scale={0.98}
        roll={0.18}
      />
      <MechanicalTrumpet
        base={BRANCHES[3][3]}
        direction={[0.88, 0.18, 0.36]}
        materials={materials}
        variant="strange"
        open={bloom2}
        appear={appearAmount(growth, 0.52, 0.12)}
        scale={1.02}
        roll={-0.12}
      />
      <MechanicalTrumpet
        base={BRANCHES[5][3]}
        direction={[-0.62, 0.42, 0.38]}
        materials={materials}
        variant="full"
        open={bloom3}
        appear={appearAmount(growth, 0.74, 0.12)}
        scale={1.06}
        roll={0.28}
      />

      <GeometricLeaf
        base={[-0.02, -3.5, 0.04]}
        tip={[-0.5, -3.22, 0.08]}
        width={0.15}
        materials={materials}
        appear={appearAmount(growth, 0.18)}
      />
      <GeometricLeaf
        base={[-0.46, -0.5, 0.04]}
        tip={[-0.58, 0.02, 0.1]}
        width={0.16}
        materials={materials}
        appear={appearAmount(growth, 0.38)}
      />
      <GeometricLeaf
        base={[0.5, 1.2, 0.04]}
        tip={[0.62, 1.72, 0.1]}
        width={0.14}
        materials={materials}
        appear={appearAmount(growth, 0.66)}
      />
      <GeometricLeaf
        base={[-0.5, 2.36, 0.05]}
        tip={[-0.88, 2.2, 0.1]}
        width={0.15}
        materials={materials}
        appear={appearAmount(growth, 0.78)}
      />

      <MechanicalBud
        base={BRANCHES[1][3]}
        tip={[1.18, -0.72, 0.12]}
        materials={materials}
        appear={appearAmount(growth, 0.4)}
        scale={0.9}
      />
      <MechanicalBud
        base={BRANCHES[2][3]}
        tip={[-1.28, 0.48, 0.16]}
        materials={materials}
        appear={appearAmount(growth, 0.36)}
        scale={0.86}
      />
      <MechanicalBud
        base={BRANCHES[4][3]}
        tip={[1.22, 2.18, 0.14]}
        materials={materials}
        appear={appearAmount(growth, 0.68)}
        scale={0.88}
      />
      <MechanicalBud
        base={BRANCHES[6][3]}
        tip={[0.68, 4.62, 0.12]}
        materials={materials}
        appear={appearAmount(growth, 0.88)}
        scale={0.92}
      />
    </group>
  )
}
