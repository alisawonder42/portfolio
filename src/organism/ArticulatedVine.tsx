import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import type { SculptureMaterials } from './materials'
import { createLeaf, createPanel } from './panelGeometry'
import { easeOutCubic, smoothstep, stemReach, type OrganismState } from './state'
import {
  BRANCHES,
  LEAVES,
  MAIN,
  MAIN_U,
  normalisedLengths,
  toLocal,
  type Point,
} from './vineLayout'

const UP = new THREE.Vector3(0, 1, 0)
const _world = new THREE.Vector3()

function orient(from: Point, to: Point) {
  const start = new THREE.Vector3(...from)
  const end = new THREE.Vector3(...to)
  const direction = end.clone().sub(start)
  const length = direction.length()
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize())
  return { start, direction, quaternion, length }
}

/**
 * How strongly this node should react to the cursor, from its own screen
 * position. Returns 0 when the pointer is far away, rising smoothly as it nears.
 */
function proximity(
  node: THREE.Object3D,
  camera: THREE.Camera,
  state: OrganismState,
  radius: number,
): number {
  node.getWorldPosition(_world)
  _world.project(camera)
  const distance = Math.hypot(_world.x - state.cursorX, _world.y - state.cursorY)
  return smoothstep(radius, radius * 0.25, distance)
}

/**
 * A rigid member that telescopes out of its start joint. The cylinder is a unit
 * column scaled along its own axis, so the segment extends rather than fades.
 */
function RigidLink({
  from,
  to,
  radiusStart,
  radiusEnd,
  material,
  grow = 1,
}: {
  from: Point
  to: Point
  radiusStart: number
  radiusEnd: number
  material: THREE.Material
  grow?: number
}) {
  const { start, direction, quaternion, length } = orient(from, to)
  const g = THREE.MathUtils.clamp(grow, 0, 1)
  const extended = length * g
  const position = start.addScaledVector(direction, extended * 0.5)
  return (
    <mesh
      visible={g > 0.004}
      position={position}
      quaternion={quaternion}
      material={material}
      scale={[1, extended, 1]}
    >
      <cylinderGeometry args={[radiusEnd, radiusStart, 1, 14, 1, false]} />
    </mesh>
  )
}

/**
 * Rotary joint between two members. It swings into alignment as it appears, so
 * the vine reads as assembling itself rather than materialising.
 */
function RotaryJoint({
  point,
  previous,
  next,
  radius,
  materials,
  appear = 1,
}: {
  point: Point
  previous: Point
  next: Point
  radius: number
  materials: SculptureMaterials
  appear?: number
}) {
  const incoming = new THREE.Vector3(...point).sub(new THREE.Vector3(...previous)).normalize()
  const outgoing = new THREE.Vector3(...next).sub(new THREE.Vector3(...point)).normalize()
  const axle = incoming.clone().cross(outgoing)
  if (axle.lengthSq() < 1e-6) axle.set(0, 0, 1)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, axle.normalize())
  const a = THREE.MathUtils.clamp(appear, 0, 1)
  const settle = THREE.MathUtils.smootherstep(a, 0, 1)
  const height = radius * 0.62

  return (
    <group visible={a > 0.02} position={point} quaternion={quaternion} scale={settle}>
      <group rotation-y={(1 - settle) * 1.15}>
        <mesh material={materials.joint}>
          <cylinderGeometry args={[radius, radius, height, 22]} />
        </mesh>
        <mesh material={materials.polished} position-y={height * 0.52}>
          <cylinderGeometry args={[radius * 0.44, radius * 0.44, height * 0.22, 16]} />
        </mesh>
        <mesh material={materials.polished} position-y={-height * 0.52}>
          <cylinderGeometry args={[radius * 0.44, radius * 0.44, height * 0.22, 16]} />
        </mesh>
        <mesh material={materials.polished} rotation-x={Math.PI / 2}>
          <torusGeometry args={[radius * 0.99, radius * 0.07, 8, 24]} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * A run of members and joints revealed by arc length, so the structure grows
 * from its first point outward.
 */
function ArticulatedPath({
  points,
  radiusStart,
  radiusEnd,
  jointScale = 1,
  materials,
  reach,
  capTip = false,
}: {
  points: Point[]
  radiusStart: number
  radiusEnd: number
  jointScale?: number
  materials: SculptureMaterials
  /** Normalised arc length currently reached, 0..1. */
  reach: number
  /** Draw a machined end cap at the growing tip. */
  capTip?: boolean
}) {
  const u = useMemo(() => normalisedLengths(points), [points])
  return (
    <group>
      {capTip ? (
        <GrowingTip
          points={points}
          u={u}
          reach={reach}
          radius={THREE.MathUtils.lerp(radiusStart, radiusEnd, reach)}
          materials={materials}
        />
      ) : null}
      {points.slice(0, -1).map((point, index) => {
        const t = index / Math.max(points.length - 2, 1)
        return (
          <RigidLink
            key={`link-${index}`}
            from={point}
            to={points[index + 1]}
            radiusStart={THREE.MathUtils.lerp(radiusStart, radiusEnd, t)}
            radiusEnd={THREE.MathUtils.lerp(
              radiusStart,
              radiusEnd,
              (index + 1) / (points.length - 1),
            )}
            material={materials.stem}
            grow={smoothstep(u[index], u[index + 1], reach)}
          />
        )
      })}
      {points.slice(1, -1).map((point, index) => {
        const t = index / Math.max(points.length - 3, 1)
        const at = u[index + 1]
        return (
          <RotaryJoint
            key={`joint-${index}`}
            point={point}
            previous={points[index]}
            next={points[index + 2]}
            radius={THREE.MathUtils.lerp(radiusStart * 1.62, radiusEnd * 1.72, t) * jointScale}
            materials={materials}
            appear={smoothstep(at, Math.min(1, at + 0.05), reach)}
          />
        )
      })}
    </group>
  )
}

/** The machined end of the stem, riding the point the organism has reached. */
function GrowingTip({
  points,
  u,
  reach,
  radius,
  materials,
}: {
  points: Point[]
  u: number[]
  reach: number
  radius: number
  materials: SculptureMaterials
}) {
  let segment = 0
  while (segment < points.length - 2 && u[segment + 1] < reach) segment++
  const span = Math.max(u[segment + 1] - u[segment], 1e-6)
  const t = THREE.MathUtils.clamp((reach - u[segment]) / span, 0, 1)
  const { start, direction, quaternion, length } = orient(points[segment], points[segment + 1])
  const position = start.addScaledVector(direction, length * t)

  return (
    <group position={position} quaternion={quaternion}>
      <mesh material={materials.joint}>
        <cylinderGeometry args={[radius * 1.25, radius * 1.25, radius * 0.7, 18]} />
      </mesh>
      <mesh position-y={radius * 1.1} material={materials.polished}>
        <coneGeometry args={[radius * 0.92, radius * 1.6, 12]} />
      </mesh>
    </group>
  )
}

function GeometricLeaf({
  base,
  tip,
  width,
  materials,
  appear,
  getState,
}: {
  base: Point
  tip: Point
  width: number
  materials: SculptureMaterials
  appear: number
  getState: () => OrganismState
}) {
  const { quaternion, length } = orient(base, tip)
  const geometry = useMemo(() => createLeaf(length, width), [length, width])
  const hinge = useRef<THREE.Group>(null)
  const attention = useRef(0)
  const { camera } = useThree()

  useFrame((_, delta) => {
    const node = hinge.current
    if (!node) return
    const state = getState()
    const near = proximity(node, camera, state, 0.42)
    attention.current += (near - attention.current) * (1 - Math.exp(-delta * 3))
    node.rotation.z = attention.current * 0.16
    node.rotation.x = attention.current * -0.1
  })

  const a = THREE.MathUtils.clamp(appear, 0, 1)
  const settle = THREE.MathUtils.smootherstep(a, 0, 1)

  return (
    <group visible={a > 0.02} position={base} quaternion={quaternion}>
      <group ref={hinge} scale={settle} rotation-x={(1 - settle) * -0.9}>
        <mesh geometry={geometry} material={materials.leaf} />
        <mesh position-y={length * 0.5} material={materials.graphite}>
          <cylinderGeometry args={[0.005, 0.008, length, 6]} />
        </mesh>
      </group>
    </group>
  )
}

/** A closed mechanical bud: a sheathed cone on a short hinged stalk. */
function MechanicalBud({
  base,
  tip,
  materials,
  appear,
  getState,
  scale = 1,
}: {
  base: Point
  tip: Point
  materials: SculptureMaterials
  appear: number
  getState: () => OrganismState
  scale?: number
}) {
  const { quaternion, length } = orient(base, tip)
  const hinge = useRef<THREE.Group>(null)
  const attention = useRef(0)
  const { camera } = useThree()

  useFrame((_, delta) => {
    const node = hinge.current
    if (!node) return
    const state = getState()
    const near = proximity(node, camera, state, 0.4)
    attention.current += (near - attention.current) * (1 - Math.exp(-delta * 3))
    node.rotation.x = attention.current * 0.14
    node.rotation.z = attention.current * 0.08
  })

  const a = THREE.MathUtils.clamp(appear, 0, 1)
  const settle = THREE.MathUtils.smootherstep(a, 0, 1)
  const stalk = length * 0.4

  return (
    <group visible={a > 0.02} position={base} quaternion={quaternion} scale={scale}>
      <group ref={hinge} scale={settle}>
        <mesh position-y={stalk * 0.5} material={materials.stem}>
          <cylinderGeometry args={[0.012, 0.015, stalk, 10]} />
        </mesh>
        <mesh position-y={stalk} material={materials.joint}>
          <cylinderGeometry args={[0.026, 0.026, 0.02, 14]} />
        </mesh>
        <mesh position-y={stalk + length * 0.2} material={materials.satin}>
          <cylinderGeometry args={[0.014, 0.036, length * 0.34, 6]} />
        </mesh>
        <mesh position-y={stalk + length * 0.42} material={materials.polished}>
          <coneGeometry args={[0.016, length * 0.18, 6]} />
        </mesh>
      </group>
    </group>
  )
}

export type BloomVariant = 'classic' | 'strange' | 'full'

interface BloomProfile {
  panels: number
  length: number
  innerWidth: number
  outerWidth: number
  cup: number
  taper: number
  /** Hinge radius when shut and when fully open. */
  closedRadius: number
  openRadius: number
  closedFlare: number
  openFlare: number
  /** Secondary roll applied to alternating panels late in the opening. */
  twist: number
}

const BLOOM_PROFILE: Record<BloomVariant, BloomProfile> = {
  classic: {
    panels: 6,
    length: 0.72,
    innerWidth: 0.026,
    outerWidth: 0.155,
    cup: 0.082,
    taper: 0.66,
    closedRadius: 0.028,
    openRadius: 0.088,
    closedFlare: -0.035,
    openFlare: 0.84,
    twist: 0.07,
  },
  strange: {
    panels: 5,
    length: 0.8,
    innerWidth: 0.024,
    outerWidth: 0.185,
    cup: 0.105,
    taper: 0.52,
    closedRadius: 0.03,
    openRadius: 0.098,
    closedFlare: -0.028,
    openFlare: 1.06,
    twist: 0.26,
  },
  full: {
    panels: 7,
    length: 0.84,
    innerWidth: 0.026,
    outerWidth: 0.165,
    cup: 0.088,
    taper: 0.6,
    closedRadius: 0.031,
    openRadius: 0.1,
    closedFlare: -0.032,
    openFlare: 0.96,
    twist: 0.11,
  },
}

/**
 * A trumpet bloom built from articulated panels. Opening is mechanical: the
 * throat extends, the cap withdraws, then each panel swings out about its own
 * hinge and drifts outward. Panels are never scaled.
 */
function MechanicalTrumpet({
  base,
  direction,
  materials,
  open,
  appear,
  getState,
  variant,
  scale = 1,
  roll = 0,
}: {
  base: Point
  direction: Point
  materials: SculptureMaterials
  open: number
  appear: number
  getState: () => OrganismState
  variant: BloomVariant
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
    () =>
      createPanel({
        length: profile.length,
        innerWidth: profile.innerWidth,
        outerWidth: profile.outerWidth,
        cup: profile.cup,
        taper: profile.taper,
        thickness: 0.011,
      }),
    [profile.cup, profile.innerWidth, profile.length, profile.outerWidth, profile.taper],
  )
  const panelMaterials = useMemo(
    () => [materials.satin, materials.interior, materials.polished],
    [materials],
  )

  const head = useRef<THREE.Group>(null)
  const throat = useRef<THREE.Mesh>(null)
  const cap = useRef<THREE.Group>(null)
  const mounts = useRef<Array<THREE.Group | null>>([])
  const hinges = useRef<Array<THREE.Group | null>>([])
  const attention = useRef(0)
  const { camera } = useThree()

  const THROAT_TOP = 0.16

  useFrame((_, delta) => {
    const node = head.current
    if (!node) return
    const state = getState()
    const near = proximity(node, camera, state, 0.55)
    attention.current += (near - attention.current) * (1 - Math.exp(-delta * 2.8))
    const notice = attention.current

    node.rotation.y = roll + (state.cursorX - _world.x) * 0.1 * notice
    node.rotation.x = (state.cursorY - _world.y) * 0.07 * notice

    // Stage the opening: throat first, then the panels swing, then they separate.
    const amount = THREE.MathUtils.clamp(open + notice * 0.05, 0, 1)
    const throatStage = easeOutCubic(smoothstep(0, 0.32, amount))
    const swingStage = easeOutCubic(smoothstep(0.12, 0.86, amount))
    const partStage = easeOutCubic(smoothstep(0.35, 1, amount))
    const twistStage = smoothstep(0.62, 1, amount)

    if (throat.current) {
      throat.current.scale.y = THREE.MathUtils.lerp(0.72, 1.18, throatStage)
      throat.current.position.y = THREE.MathUtils.lerp(0.05, 0.09, throatStage)
    }
    if (cap.current) {
      // The nose cone shuts the bud, then withdraws into the throat as a stamen.
      cap.current.position.y = THREE.MathUtils.lerp(
        THROAT_TOP + profile.length * 0.94,
        THROAT_TOP + 0.14,
        easeOutCubic(amount),
      )
      const shrink = THREE.MathUtils.lerp(1, 0.32, easeOutCubic(amount))
      cap.current.scale.set(shrink, THREE.MathUtils.lerp(1, 0.55, easeOutCubic(amount)), shrink)
    }

    for (let index = 0; index < profile.panels; index++) {
      const mount = mounts.current[index]
      const hinge = hinges.current[index]
      const alternate = index % 2 === 0
      // A tiny per-panel stagger keeps the shut bud a nested spiral, not a clash.
      const nestled = profile.closedRadius + index * 0.0022
      const radius = THREE.MathUtils.lerp(nestled, profile.openRadius, partStage)
      if (mount) {
        mount.position.z = radius
        mount.position.y = THREE.MathUtils.lerp(THROAT_TOP - 0.01, THROAT_TOP + 0.05, throatStage)
      }
      if (hinge) {
        const lean = alternate ? 1 : 0.93
        hinge.rotation.x =
          THREE.MathUtils.lerp(profile.closedFlare, profile.openFlare * lean, swingStage) +
          notice * 0.035
        hinge.rotation.y = twistStage * profile.twist * (alternate ? 1 : -0.6)
      }
    }
  })

  const a = THREE.MathUtils.clamp(appear, 0, 1)
  const settle = THREE.MathUtils.smootherstep(a, 0, 1)

  return (
    <group visible={a > 0.02} position={base} quaternion={quaternion} scale={scale * settle}>
      <group ref={head}>
        <mesh position-y={-0.06} material={materials.graphite}>
          <cylinderGeometry args={[0.042, 0.052, 0.12, 16]} />
        </mesh>
        <mesh position-y={0.02} material={materials.joint}>
          <sphereGeometry args={[0.05, 18, 12]} />
        </mesh>
        <mesh ref={throat} position-y={0.05} material={materials.satin}>
          <cylinderGeometry args={[0.058, 0.036, 0.14, 18, 1, true]} />
        </mesh>
        <mesh position-y={THROAT_TOP - 0.01} material={materials.polished} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.05, 0.008, 8, 26]} />
        </mesh>

        <group ref={cap}>
          <mesh material={materials.polished}>
            <coneGeometry args={[0.03, 0.19, profile.panels]} />
          </mesh>
          <mesh position-y={-0.12} material={materials.interior}>
            <cylinderGeometry args={[0.011, 0.019, 0.14, 8]} />
          </mesh>
        </group>

        {Array.from({ length: profile.panels }, (_, index) => {
          const angle = (index / profile.panels) * Math.PI * 2
          return (
            <group key={index} rotation-y={angle}>
              <group
                ref={(el) => {
                  mounts.current[index] = el
                }}
                position={[0, THROAT_TOP, profile.closedRadius]}
              >
                <mesh material={materials.joint} rotation-z={Math.PI / 2}>
                  <cylinderGeometry args={[0.009, 0.009, profile.innerWidth * 2.4, 10]} />
                </mesh>
                <group
                  ref={(el) => {
                    hinges.current[index] = el
                  }}
                >
                  <mesh geometry={panel} material={panelMaterials} />
                  <mesh
                    position={[0, profile.length * 0.46, -profile.cup * 0.62]}
                    material={materials.graphite}
                  >
                    <cylinderGeometry args={[0.0035, 0.006, profile.length * 0.9, 6]} />
                  </mesh>
                </group>
              </group>
            </group>
          )
        })}
      </group>
    </group>
  )
}

/** One branch, hinged at the stem and unfolding away from it as it grows. */
function Branch({
  attach,
  points,
  radiusStart,
  radiusEnd,
  materials,
  progress,
  children,
}: {
  attach: Point
  points: Point[]
  radiusStart: number
  radiusEnd: number
  materials: SculptureMaterials
  progress: number
  children?: React.ReactNode
}) {
  const local = useMemo(() => points.map((point) => toLocal(point, attach)), [attach, points])
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  const tip = local[local.length - 1]
  // Fold the branch back against the stem before it deploys.
  const fold = (1 - THREE.MathUtils.smootherstep(p, 0, 1)) * 0.95 * (tip[0] >= 0 ? -1 : 1)

  return (
    <group visible={p > 0.01} position={attach} rotation-z={fold}>
      <ArticulatedPath
        points={local}
        radiusStart={radiusStart}
        radiusEnd={radiusEnd}
        jointScale={0.86}
        materials={materials}
        reach={p}
      />
      {children}
    </group>
  )
}

interface VineProps {
  materials: SculptureMaterials
  getState: () => OrganismState
  growth: number
  bloom1: number
  bloom2: number
  bloom3: number
}

/**
 * The articulated vine. A single arc-length reach drives the stem, branches and
 * buds bottom-to-top, while each bloom opens from its own progress value.
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
  const reach = stemReach(growth)
  const bloomOpen = [bloom1, bloom2, bloom3]
  const bloomVariant: BloomVariant[] = ['classic', 'strange', 'full']
  const bloomDirection: Point[] = [
    [-0.52, 0.64, 0.36],
    [0.6, 0.58, 0.32],
    [-0.4, 0.74, 0.34],
  ]
  const bloomScale = [0.74, 0.78, 0.82]
  const bloomRoll = [0.16, -0.12, 0.26]
  let bloomIndex = 0
  let budIndex = 0

  useFrame((_, delta) => {
    const node = root.current
    if (!node) return
    const state = getState()
    // Roughly four degrees of yaw and two of pitch, always trailing the cursor.
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, state.cursorX * 0.078, 2.6, delta)
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, state.cursorY * 0.046, 2.6, delta)
    node.rotation.z = THREE.MathUtils.damp(
      node.rotation.z,
      -state.cursorX * 0.014 + THREE.MathUtils.clamp(state.cursorVx, -3, 3) * 0.0035,
      2.2,
      delta,
    )

    if (import.meta.env.DEV) {
      ;(window as unknown as { __vineRot?: unknown }).__vineRot = {
        x: +node.rotation.x.toFixed(4),
        y: +node.rotation.y.toFixed(4),
        z: +node.rotation.z.toFixed(4),
      }
    }
  })

  return (
    <group ref={root}>
      <mesh position={MAIN[0]} material={materials.graphite}>
        <cylinderGeometry args={[0.075, 0.095, 0.035, 22]} />
      </mesh>

      <ArticulatedPath
        points={MAIN}
        radiusStart={0.04}
        radiusEnd={0.014}
        materials={materials}
        reach={reach}
        capTip
      />

      {BRANCHES.map((branch, index) => {
        const attachU = MAIN_U[branch.attachIndex]
        const progress = smoothstep(attachU + 0.01, Math.min(1, attachU + 0.18), reach)
        const tip = toLocal(branch.points[branch.points.length - 1], branch.points[0])
        const structural = smoothstep(0.4, 0.95, progress)
        const slot = branch.kind === 'bloom' ? bloomIndex++ : budIndex++

        return (
          <Branch
            key={`branch-${index}`}
            attach={branch.points[0]}
            points={branch.points}
            radiusStart={branch.radiusStart}
            radiusEnd={branch.radiusEnd}
            materials={materials}
            progress={progress}
          >
            {branch.kind === 'bloom' ? (
              <MechanicalTrumpet
                base={tip}
                direction={bloomDirection[slot]}
                materials={materials}
                getState={getState}
                variant={bloomVariant[slot]}
                open={bloomOpen[slot]}
                appear={structural}
                scale={bloomScale[slot]}
                roll={bloomRoll[slot]}
              />
            ) : (
              <MechanicalBud
                base={tip}
                tip={[tip[0] + (tip[0] >= 0 ? 0.1 : -0.1), tip[1] + 0.34, tip[2] + 0.03]}
                materials={materials}
                getState={getState}
                appear={structural}
                scale={0.92}
              />
            )}
          </Branch>
        )
      })}

      {LEAVES.map((leaf, index) => {
        const attachU = MAIN_U[leaf.attachIndex]
        return (
          <GeometricLeaf
            key={`leaf-${index}`}
            base={leaf.base}
            tip={leaf.tip}
            width={leaf.width}
            materials={materials}
            getState={getState}
            appear={smoothstep(attachU + 0.02, Math.min(1, attachU + 0.14), reach)}
          />
        )
      })}
    </group>
  )
}
