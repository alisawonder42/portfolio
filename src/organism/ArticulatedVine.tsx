import { useMemo } from 'react'
import * as THREE from 'three'

type Point = [number, number, number]

interface PathProps {
  points: Point[]
  radiusStart?: number
  radiusEnd?: number
  jointScale?: number
}

const UP = new THREE.Vector3(0, 1, 0)

const BODY = new THREE.MeshStandardMaterial({
  color: '#8b8e92',
  roughness: 0.88,
  metalness: 0,
  flatShading: true,
})

const BODY_DARK = new THREE.MeshStandardMaterial({
  color: '#62656a',
  roughness: 0.9,
  metalness: 0,
  flatShading: true,
})

const JOINT = new THREE.MeshStandardMaterial({
  color: '#3f4247',
  roughness: 0.82,
  metalness: 0,
  flatShading: true,
})

const PANEL = new THREE.MeshStandardMaterial({
  color: '#777a7e',
  roughness: 0.94,
  metalness: 0,
  flatShading: true,
  side: THREE.DoubleSide,
})

function orientation(from: Point, to: Point) {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const direction = end.clone().sub(start)
  const length = direction.length()
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize())
  return { midpoint: start.add(end).multiplyScalar(0.5), quaternion, length }
}

function RigidLink({
  from,
  to,
  radius = 0.055,
  material = BODY,
}: {
  from: Point
  to: Point
  radius?: number
  material?: THREE.Material
}) {
  const transform = useMemo(() => orientation(from, to), [from, to])
  return (
    <mesh
      position={transform.midpoint}
      quaternion={transform.quaternion}
      material={material}
      castShadow
    >
      <cylinderGeometry args={[radius * 0.84, radius, transform.length, 8, 1, false]} />
    </mesh>
  )
}

function RotaryJoint({
  point,
  previous,
  next,
  radius = 0.11,
}: {
  point: Point
  previous: Point
  next: Point
  radius?: number
}) {
  const quaternion = useMemo(() => {
    const incoming = new THREE.Vector3(...point).sub(new THREE.Vector3(...previous)).normalize()
    const outgoing = new THREE.Vector3(...next).sub(new THREE.Vector3(...point)).normalize()
    const axle = incoming.cross(outgoing)
    if (axle.lengthSq() < 0.001) axle.set(0, 0, 1)
    return new THREE.Quaternion().setFromUnitVectors(UP, axle.normalize())
  }, [next, point, previous])

  return (
    <group position={point} quaternion={quaternion}>
      <mesh material={JOINT}>
        <cylinderGeometry args={[radius, radius, radius * 0.72, 12]} />
      </mesh>
      <mesh material={BODY_DARK} rotation-x={Math.PI / 2}>
        <torusGeometry args={[radius * 0.76, radius * 0.12, 6, 12]} />
      </mesh>
      <mesh material={BODY} position-y={radius * 0.42}>
        <cylinderGeometry args={[radius * 0.34, radius * 0.34, radius * 0.16, 10]} />
      </mesh>
    </group>
  )
}

/** A botanical path rendered exclusively as rigid tapered links and rotary joints. */
function ArticulatedPath({
  points,
  radiusStart = 0.075,
  radiusEnd = 0.038,
  jointScale = 1,
}: PathProps) {
  return (
    <group>
      {points.slice(0, -1).map((point, index) => {
        const t = index / Math.max(points.length - 2, 1)
        const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t)
        return (
          <RigidLink key={`link-${index}`} from={point} to={points[index + 1]} radius={radius} />
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
            radius={THREE.MathUtils.lerp(radiusStart * 1.9, radiusEnd * 1.9, t) * jointScale}
          />
        )
      })}
    </group>
  )
}

function makeLeafPanel(side: -1 | 1, length: number, width: number) {
  const positions = new Float32Array([
    0,
    0,
    0,
    side * width * 0.72,
    length * 0.38,
    0.025,
    0,
    length * 0.55,
    0,
    side * width,
    length * 0.62,
    -0.01,
    0,
    length,
    0,
  ])
  const indices = [0, 1, 2, 2, 1, 3, 2, 3, 4]
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

/** Sparse folded leaf: two planar plates, a rigid midrib, and four structural veins. */
function GeometricLeaf({ base, tip, width = 0.22 }: { base: Point; tip: Point; width?: number }) {
  const { quaternion, length } = useMemo(() => orientation(base, tip), [base, tip])
  const panels = useMemo(
    () => [makeLeafPanel(-1, length, width), makeLeafPanel(1, length, width)],
    [length, width],
  )

  return (
    <group position={base} quaternion={quaternion}>
      <mesh geometry={panels[0]} material={PANEL} />
      <mesh geometry={panels[1]} material={PANEL} />
      <RigidLink from={[0, 0, 0]} to={[0, length, 0]} radius={0.023} material={BODY_DARK} />
      {[0.34, 0.55, 0.74].map((t, index) => {
        const spread = width * (1 - Math.abs(t - 0.56) * 1.8)
        return (
          <group key={t}>
            <RigidLink
              from={[0, length * t, 0.02]}
              to={[-spread, length * (t + 0.08), 0]}
              radius={0.009}
              material={BODY_DARK}
            />
            <RigidLink
              from={[0, length * t, 0.02]}
              to={[spread, length * (t + 0.08), 0]}
              radius={0.009}
              material={BODY_DARK}
            />
            {index === 0 && (
              <RotaryJoint
                point={[0, 0, 0]}
                previous={[0, -0.1, 0]}
                next={[0, length, 0]}
                radius={0.045}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}

function MechanicalBud({ base, tip, scale = 1 }: { base: Point; tip: Point; scale?: number }) {
  const { quaternion, length } = useMemo(() => orientation(base, tip), [base, tip])
  return (
    <group position={base} quaternion={quaternion} scale={scale}>
      <RigidLink from={[0, 0, 0]} to={[0, length * 0.45, 0]} radius={0.025} />
      <RotaryJoint
        point={[0, length * 0.45, 0]}
        previous={[0, 0, 0]}
        next={[0, length, 0]}
        radius={0.055}
      />
      <mesh position-y={length * 0.76} material={PANEL}>
        <coneGeometry args={[0.12, length * 0.5, 5, 1, false]} />
      </mesh>
      <mesh position-y={length * 0.58} material={JOINT}>
        <torusGeometry args={[0.09, 0.018, 6, 10]} />
      </mesh>
    </group>
  )
}

function makeTrumpetPanel(index: number, count: number, scale: number) {
  const a0 = ((index - 0.48) / count) * Math.PI * 2
  const a1 = ((index + 0.48) / count) * Math.PI * 2
  const ac = ((index + 0.5) / count) * Math.PI * 2
  const inner = 0.11 * scale
  const middle = 0.38 * scale
  const outer = (index % 2 === 0 ? 0.72 : 0.64) * scale
  const yOuter = (index % 2 === 0 ? 0.82 : 0.9) * scale
  const positions = new Float32Array([
    Math.cos(a0) * inner,
    0,
    Math.sin(a0) * inner,
    Math.cos(ac) * middle,
    0.46 * scale,
    Math.sin(ac) * middle,
    Math.cos(a1) * inner,
    0,
    Math.sin(a1) * inner,
    Math.cos(a0) * outer,
    yOuter,
    Math.sin(a0) * outer,
    Math.cos(ac) * outer * 1.12,
    yOuter - 0.08 * scale,
    Math.sin(ac) * outer * 1.12,
    Math.cos(a1) * outer,
    yOuter,
    Math.sin(a1) * outer,
  ])
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex([0, 1, 2, 0, 3, 1, 1, 3, 4, 1, 4, 5, 1, 5, 2])
  geometry.computeVertexNormals()
  return geometry
}

/**
 * A mechanical trumpet made from eight articulated ribs and eight folded plates.
 * It reads as a bloom in silhouette, but every edge is an engineered member.
 */
function MechanicalTrumpet({
  base,
  direction,
  scale = 1,
  roll = 0,
}: {
  base: Point
  direction: Point
  scale?: number
  roll?: number
}) {
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(UP, new THREE.Vector3(...direction).normalize()),
    [direction],
  )
  const count = 8
  const panels = useMemo(
    () => Array.from({ length: count }, (_, index) => makeTrumpetPanel(index, count, scale)),
    [scale],
  )
  const outerPoints = useMemo(
    () =>
      Array.from({ length: count }, (_, index): Point => {
        const angle = ((index + 0.5) / count) * Math.PI * 2
        const radius = (index % 2 === 0 ? 0.72 : 0.64) * scale
        const y = (index % 2 === 0 ? 0.82 : 0.9) * scale
        return [Math.cos(angle) * radius, y, Math.sin(angle) * radius]
      }),
    [scale],
  )

  return (
    <group position={base} quaternion={quaternion} rotation-y={roll}>
      <mesh position-y={-0.05 * scale} material={BODY_DARK}>
        <cylinderGeometry args={[0.12 * scale, 0.17 * scale, 0.32 * scale, count]} />
      </mesh>
      <mesh position-y={0.08 * scale} material={JOINT} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.15 * scale, 0.026 * scale, 6, count]} />
      </mesh>
      {panels.map((geometry, index) => {
        const angle = ((index + 0.5) / count) * Math.PI * 2
        const middle: Point = [
          Math.cos(angle) * 0.38 * scale,
          0.46 * scale,
          Math.sin(angle) * 0.38 * scale,
        ]
        return (
          <group key={index}>
            <mesh geometry={geometry} material={index % 2 === 0 ? PANEL : BODY} />
            <RigidLink
              from={[Math.cos(angle) * 0.11 * scale, 0, Math.sin(angle) * 0.11 * scale]}
              to={middle}
              radius={0.018 * scale}
              material={BODY_DARK}
            />
            <RigidLink
              from={middle}
              to={outerPoints[index]}
              radius={0.015 * scale}
              material={BODY_DARK}
            />
            <RotaryJoint
              point={middle}
              previous={[0, 0, 0]}
              next={outerPoints[index]}
              radius={0.035 * scale}
            />
            <RigidLink
              from={outerPoints[index]}
              to={outerPoints[(index + 1) % count]}
              radius={0.014 * scale}
              material={BODY_DARK}
            />
          </group>
        )
      })}
    </group>
  )
}

const MAIN: Point[] = [
  [-0.15, -4.1, 0],
  [0.0, -3.55, 0.05],
  [-0.18, -3.0, 0.02],
  [-0.1, -2.45, -0.05],
  [0.16, -1.9, 0],
  [0.08, -1.32, 0.08],
  [-0.12, -0.75, 0.02],
  [0.02, -0.17, -0.06],
  [0.24, 0.4, 0],
  [0.16, 0.96, 0.08],
  [-0.08, 1.53, 0.02],
  [-0.14, 2.1, -0.06],
  [0.08, 2.65, 0],
  [0.04, 3.22, 0.05],
  [-0.2, 3.8, 0],
]

const BRANCHES: Point[][] = [
  [MAIN[2], [-0.55, -2.78, 0.06], [-1.0, -2.54, 0.14], [-1.42, -2.25, 0.16]],
  [MAIN[4], [0.48, -1.66, 0.08], [0.86, -1.4, 0.15], [1.2, -1.12, 0.12]],
  [MAIN[6], [-0.5, -0.5, 0.05], [-0.9, -0.16, 0.14], [-1.34, 0.04, 0.18]],
  [MAIN[7], [0.48, 0.02, 0.08], [0.92, 0.27, 0.16], [1.38, 0.48, 0.18]],
  [MAIN[9], [0.54, 1.16, 0.04], [0.96, 1.45, 0.14], [1.35, 1.72, 0.2]],
  [MAIN[11], [-0.52, 2.32, 0.06], [-0.88, 2.65, 0.13], [-1.1, 3.02, 0.16]],
  [MAIN[13], [0.42, 3.42, 0.05], [0.72, 3.76, 0.12], [0.83, 4.12, 0.14]],
]

export function ArticulatedVine() {
  return (
    <group>
      <ArticulatedPath points={MAIN} radiusStart={0.09} radiusEnd={0.045} />
      {BRANCHES.map((points, index) => (
        <ArticulatedPath
          key={index}
          points={points}
          radiusStart={0.055}
          radiusEnd={0.027}
          jointScale={0.86}
        />
      ))}

      {/* Three major asymmetric mechanical trumpet blooms. */}
      <MechanicalTrumpet
        base={BRANCHES[0][3]}
        direction={[-0.82, 0.28, 0.45]}
        scale={0.95}
        roll={0.22}
      />
      <MechanicalTrumpet
        base={BRANCHES[3][3]}
        direction={[0.92, 0.22, 0.34]}
        scale={1.08}
        roll={-0.18}
      />
      <MechanicalTrumpet
        base={BRANCHES[4][3]}
        direction={[0.86, 0.3, 0.42]}
        scale={0.9}
        roll={0.38}
      />

      {/* Sparse folded leaves, placed between rather than around every joint. */}
      <GeometricLeaf base={[-0.04, -3.44, 0.05]} tip={[-0.62, -3.18, 0.1]} width={0.2} />
      <GeometricLeaf base={[0.51, -1.64, 0.08]} tip={[0.42, -1.12, 0.12]} width={0.2} />
      <GeometricLeaf base={[-0.52, -0.49, 0.05]} tip={[-0.68, 0.02, 0.12]} width={0.24} />
      <GeometricLeaf base={[0.6, 0.1, 0.1]} tip={[0.72, 0.67, 0.17]} width={0.21} />
      <GeometricLeaf base={[-0.1, 1.9, 0]} tip={[-0.62, 2.2, 0.12]} width={0.23} />
      <GeometricLeaf base={[-0.54, 2.34, 0.06]} tip={[-0.96, 2.18, 0.12]} width={0.2} />
      <GeometricLeaf base={[0.43, 3.42, 0.05]} tip={[0.74, 3.17, 0.12]} width={0.18} />

      {/* Unopened growth points retain the reference's vertical rhythm. */}
      <MechanicalBud base={BRANCHES[1][3]} tip={[1.32, -0.67, 0.16]} scale={0.9} />
      <MechanicalBud base={BRANCHES[2][3]} tip={[-1.45, 0.48, 0.2]} scale={0.82} />
      <MechanicalBud base={BRANCHES[5][3]} tip={[-1.12, 3.5, 0.18]} scale={0.84} />
      <MechanicalBud base={BRANCHES[6][3]} tip={[0.78, 4.58, 0.16]} scale={0.94} />
      <MechanicalBud base={MAIN[14]} tip={[-0.32, 4.3, 0.04]} scale={0.8} />
    </group>
  )
}
