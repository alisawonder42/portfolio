import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import type { SculptureMaterials } from './materials'
import { easeOutCubic, smoothstep, type OrganismState } from './state'

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

/** GLSL-style smoothstep: maps `progress` from [start, start+span] onto 0..1. */
function appearAmount(progress: number, start: number, span = 0.16): number {
  return smoothstep(start, start + span, progress)
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
      <cylinderGeometry args={[radius * 0.72, radius, length, 14, 1, false]} />
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
  const disc = radius * 0.9
  const height = radius * 0.26

  return (
    <group position={point} quaternion={quaternion} scale={s}>
      <mesh material={materials.joint}>
        <cylinderGeometry args={[disc, disc, height, 24]} />
      </mesh>
      <mesh material={materials.silver} position-y={height * 0.55}>
        <cylinderGeometry args={[disc * 0.34, disc * 0.34, height * 0.28, 16]} />
      </mesh>
      <mesh material={materials.silver} position-y={-height * 0.55}>
        <cylinderGeometry args={[disc * 0.34, disc * 0.34, height * 0.28, 16]} />
      </mesh>
      <mesh material={materials.graphite} rotation-x={Math.PI / 2}>
        <torusGeometry args={[disc * 0.78, radius * 0.038, 8, 24]} />
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
  const local = smoothstep(growthStart, growthEnd, growth)
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
            appear={appearAmount(local, t * 0.74, 0.2)}
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
            radius={THREE.MathUtils.lerp(radiusStart * 1.28, radiusEnd * 1.32, t) * jointScale}
            materials={materials}
            appear={appearAmount(local, t * 0.74 + 0.05, 0.2)}
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
      -width * 0.58,
      length * 0.4,
      0.01,
      width * 0.58,
      length * 0.4,
      0.01,
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
        radius={0.009}
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
        to={[0, length * 0.46, 0]}
        radius={0.012}
        material={materials.stem}
      />
      <RotaryJoint
        point={[0, length * 0.46, 0]}
        previous={[0, 0, 0]}
        next={[0, length, 0]}
        radius={0.028}
        materials={materials}
      />
      <mesh position-y={length * 0.72} material={materials.silver}>
        <coneGeometry args={[0.048, length * 0.38, 6, 1, false]} />
      </mesh>
    </group>
  )
}

function createPetalPanel(length: number, innerW: number, outerW: number, cup: number) {
  const rows = 10
  const cols = 5
  const positions: number[] = []
  const uvs: number[] = []
  for (let i = 0; i <= rows; i++) {
    const u = i / rows
    const flare = Math.pow(Math.min(1, Math.max(0, (u - 0.12) / 0.88)), 0.82)
    const half = THREE.MathUtils.lerp(innerW, outerW, flare) * 0.5
    const y = u * length
    for (let j = 0; j <= cols; j++) {
      const v = j / cols
      const x = THREE.MathUtils.lerp(-half, half, v)
      const rim = 0.06 + 0.94 * Math.pow(u, 1.35)
      const z = -cup * (1 - (v * 2 - 1) ** 2) * rim
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
  {
    count: number
    flare: number
    length: number
    inner: number
    outer: number
    twist: number
    cup: number
    gap: number
  }
> = {
  classic: {
    count: 9,
    flare: 0.86,
    length: 0.82,
    inner: 0.032,
    outer: 0.3,
    twist: 0.03,
    cup: 0.048,
    gap: 0.82,
  },
  strange: {
    count: 7,
    flare: 1.04,
    length: 0.9,
    inner: 0.028,
    outer: 0.36,
    twist: 0.16,
    cup: 0.07,
    gap: 0.74,
  },
  full: {
    count: 11,
    flare: 0.96,
    length: 0.94,
    inner: 0.03,
    outer: 0.34,
    twist: 0.045,
    cup: 0.044,
    gap: 0.8,
  },
}

function MechanicalTrumpet({
  base,
  direction,
  materials,
  open,
  appear,
  getState,
  variant = 'classic',
  scale = 1,
  roll = 0,
}: {
  base: Point
  direction: Point
  materials: SculptureMaterials
  open: number
  appear: number
  getState: () => OrganismState
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
    () => createPetalPanel(profile.length, profile.inner, profile.outer, profile.cup),
    [profile.cup, profile.inner, profile.length, profile.outer],
  )
  const group = useRef<THREE.Group>(null)
  const petals = useRef<Array<THREE.Group | null>>([])
  const pistil = useRef<THREE.Mesh>(null)
  const local = useRef(0)
  const { camera } = useThree()

  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    const s = getState()
    node.getWorldPosition(_world)
    _world.project(camera)
    const d = Math.hypot(_world.x - s.cursorX, _world.y - s.cursorY)
    const near = Math.max(0, 1 - d / 0.62)
    local.current += (near - local.current) * (1 - Math.exp(-delta * 3.2))
    const notice = local.current
    node.rotation.y = roll + (s.cursorX - _world.x) * 0.07 * notice
    node.rotation.x = (s.cursorY - _world.y) * 0.05 * notice
    node.rotation.z = s.cursorVx * 0.012 * notice

    const amount = easeOutCubic(THREE.MathUtils.clamp(open + notice * 0.055, 0, 1))
    const flare = THREE.MathUtils.lerp(0.07, profile.flare, amount)
    const stretch = THREE.MathUtils.lerp(0.58, 1, amount)
    for (let index = 0; index < profile.count; index++) {
      const petal = petals.current[index]
      if (!petal) continue
      const odd = variant === 'strange' && index % 2 === 0
      petal.rotation.x = flare * (odd ? 1.1 : 1)
      petal.scale.set(profile.gap, stretch * (odd ? 1.1 : 1), 1)
    }
    if (pistil.current) {
      pistil.current.position.y = THREE.MathUtils.lerp(0.16, 0.34, amount)
      pistil.current.scale.setScalar(THREE.MathUtils.lerp(0.55, 1, amount))
    }
  })

  const s = THREE.MathUtils.smootherstep(appear, 0, 1) * scale
  if (appear < 0.06) return null

  return (
    <group position={base} quaternion={quaternion} scale={s}>
      <group ref={group}>
        <mesh position-y={-0.07} material={materials.graphite}>
          <cylinderGeometry args={[0.048, 0.072, 0.16, 16]} />
        </mesh>
        <mesh position-y={0.04} material={materials.joint}>
          <cylinderGeometry args={[0.058, 0.05, 0.09, 16]} />
        </mesh>
        <mesh position-y={0.1} material={materials.silver} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.068, 0.01, 8, profile.count]} />
        </mesh>
        <mesh position-y={0.18} material={materials.stem}>
          <cylinderGeometry args={[0.038, 0.052, 0.16, 14]} />
        </mesh>
        <mesh ref={pistil} position-y={0.16} material={materials.interior}>
          <cylinderGeometry args={[0.007, 0.014, 0.22, 8]} />
        </mesh>
        {Array.from({ length: profile.count }, (_, index) => {
          const angle = (index / profile.count) * Math.PI * 2
          return (
            <group
              key={index}
              ref={(el) => {
                petals.current[index] = el
              }}
              position-y={0.22}
              rotation-y={angle + profile.twist * (index % 3)}
              rotation-x={0.08}
            >
              <mesh position-y={0.01} material={materials.joint} rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[0.01, 0.01, profile.inner * 1.1, 8]} />
              </mesh>
              <mesh geometry={panel} material={materials.silver} />
              <mesh
                geometry={panel}
                material={materials.interior}
                position-z={-0.005}
                scale={[0.9, 0.97, 1]}
              />
              <mesh position-y={profile.length * 0.5} material={materials.graphite}>
                <cylinderGeometry args={[0.0045, 0.007, profile.length * 0.92, 6]} />
              </mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

const MAIN: Point[] = [
  [-0.1, -4.15, 0],
  [0.04, -3.62, 0.03],
  [-0.12, -3.08, 0.02],
  [-0.04, -2.54, -0.03],
  [0.12, -2.0, 0],
  [0.04, -1.46, 0.05],
  [-0.1, -0.9, 0.02],
  [0.06, -0.32, -0.04],
  [0.16, 0.28, 0],
  [0.08, 0.88, 0.05],
  [-0.08, 1.48, 0.02],
  [-0.14, 2.08, -0.04],
  [0.04, 2.66, 0],
  [0.02, 3.24, 0.03],
  [-0.16, 3.86, 0],
]

const BRANCHES: Point[][] = [
  [MAIN[2], [-0.42, -2.88, 0.04], [-0.78, -2.64, 0.1], [-1.12, -2.36, 0.12]],
  [MAIN[4], [0.38, -1.78, 0.05], [0.68, -1.52, 0.1], [0.96, -1.24, 0.08]],
  [MAIN[6], [-0.4, -0.62, 0.03], [-0.72, -0.28, 0.1], [-1.04, -0.02, 0.14]],
  [MAIN[7], [0.4, -0.04, 0.05], [0.76, 0.24, 0.12], [1.12, 0.48, 0.14]],
  [MAIN[9], [0.42, 1.1, 0.03], [0.76, 1.4, 0.1], [1.04, 1.7, 0.14]],
  [MAIN[11], [-0.44, 2.28, 0.04], [-0.76, 2.64, 0.1], [-0.96, 3.04, 0.12]],
  [MAIN[13], [0.32, 3.42, 0.03], [0.54, 3.78, 0.08], [0.64, 4.14, 0.1]],
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
 * Slender articulated vine. Global growth reveals stem, branches and buds from
 * the base upward; three trumpet blooms open from their own progress values.
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
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, s.cursorX * 0.09, 3.4, delta)
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, s.cursorY * 0.038, 3.4, delta)
    node.rotation.z = THREE.MathUtils.damp(
      node.rotation.z,
      -s.cursorX * 0.016 + s.cursorVx * 0.004,
      3.4,
      delta,
    )
  })

  return (
    <group ref={root}>
      <mesh position={MAIN[0]} material={materials.graphite}>
        <cylinderGeometry args={[0.09, 0.11, 0.028, 20]} />
      </mesh>

      <ArticulatedPath
        points={MAIN}
        radiusStart={0.044}
        radiusEnd={0.012}
        jointScale={0.92}
        materials={materials}
        growth={growth}
        growthStart={0}
        growthEnd={1}
      />

      <ArticulatedPath
        points={BRANCHES[0]}
        radiusStart={0.02}
        radiusEnd={0.01}
        jointScale={0.78}
        materials={materials}
        growth={growth}
        growthStart={0.04}
        growthEnd={0.32}
      />
      <ArticulatedPath
        points={BRANCHES[1]}
        radiusStart={0.016}
        radiusEnd={0.009}
        jointScale={0.74}
        materials={materials}
        growth={growth}
        growthStart={0.34}
        growthEnd={0.54}
      />
      <ArticulatedPath
        points={BRANCHES[2]}
        radiusStart={0.016}
        radiusEnd={0.009}
        jointScale={0.74}
        materials={materials}
        growth={growth}
        growthStart={0.3}
        growthEnd={0.5}
      />
      <ArticulatedPath
        points={BRANCHES[3]}
        radiusStart={0.02}
        radiusEnd={0.01}
        jointScale={0.78}
        materials={materials}
        growth={growth}
        growthStart={0.48}
        growthEnd={0.7}
      />
      <ArticulatedPath
        points={BRANCHES[4]}
        radiusStart={0.015}
        radiusEnd={0.008}
        jointScale={0.72}
        materials={materials}
        growth={growth}
        growthStart={0.62}
        growthEnd={0.82}
      />
      <ArticulatedPath
        points={BRANCHES[5]}
        radiusStart={0.018}
        radiusEnd={0.01}
        jointScale={0.76}
        materials={materials}
        growth={growth}
        growthStart={0.7}
        growthEnd={0.9}
      />
      <ArticulatedPath
        points={BRANCHES[6]}
        radiusStart={0.014}
        radiusEnd={0.007}
        jointScale={0.7}
        materials={materials}
        growth={growth}
        growthStart={0.84}
        growthEnd={1}
      />

      <MechanicalTrumpet
        base={BRANCHES[0][3]}
        direction={[-0.72, 0.2, 0.38]}
        materials={materials}
        getState={getState}
        variant="classic"
        open={bloom1}
        appear={appearAmount(growth, 0.08, 0.16)}
        scale={0.96}
        roll={0.16}
      />
      <MechanicalTrumpet
        base={BRANCHES[3][3]}
        direction={[0.82, 0.16, 0.32]}
        materials={materials}
        getState={getState}
        variant="strange"
        open={bloom2}
        appear={appearAmount(growth, 0.5, 0.14)}
        scale={1}
        roll={-0.1}
      />
      <MechanicalTrumpet
        base={BRANCHES[5][3]}
        direction={[-0.58, 0.4, 0.34]}
        materials={materials}
        getState={getState}
        variant="full"
        open={bloom3}
        appear={appearAmount(growth, 0.72, 0.14)}
        scale={1.04}
        roll={0.24}
      />

      <GeometricLeaf
        base={[-0.02, -3.52, 0.03]}
        tip={[-0.44, -3.26, 0.07]}
        width={0.12}
        materials={materials}
        appear={appearAmount(growth, 0.1)}
      />
      <GeometricLeaf
        base={[-0.4, -0.6, 0.03]}
        tip={[-0.52, -0.08, 0.08]}
        width={0.13}
        materials={materials}
        appear={appearAmount(growth, 0.36)}
      />
      <GeometricLeaf
        base={[0.44, 1.12, 0.03]}
        tip={[0.56, 1.62, 0.08]}
        width={0.12}
        materials={materials}
        appear={appearAmount(growth, 0.64)}
      />
      <GeometricLeaf
        base={[-0.46, 2.3, 0.04]}
        tip={[-0.8, 2.14, 0.08]}
        width={0.12}
        materials={materials}
        appear={appearAmount(growth, 0.76)}
      />

      <MechanicalBud
        base={BRANCHES[1][3]}
        tip={[1.06, -0.84, 0.1]}
        materials={materials}
        appear={appearAmount(growth, 0.38)}
        scale={0.84}
      />
      <MechanicalBud
        base={BRANCHES[2][3]}
        tip={[-1.14, 0.38, 0.14]}
        materials={materials}
        appear={appearAmount(growth, 0.34)}
        scale={0.8}
      />
      <MechanicalBud
        base={BRANCHES[4][3]}
        tip={[1.1, 2.1, 0.12]}
        materials={materials}
        appear={appearAmount(growth, 0.66)}
        scale={0.82}
      />
      <MechanicalBud
        base={BRANCHES[6][3]}
        tip={[0.6, 4.52, 0.1]}
        materials={materials}
        appear={appearAmount(growth, 0.88)}
        scale={0.86}
      />
    </group>
  )
}
