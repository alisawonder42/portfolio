import * as THREE from 'three'

export interface PanelSpec {
  /** Length from hinge to mouth. */
  length: number
  /** Half-width at the hinge end. */
  innerWidth: number
  /** Half-width at the mouth. */
  outerWidth: number
  /** Depth of the cross-section curve, so closed panels nest instead of clashing. */
  cup: number
  /** How sharply the panel flares along its length. */
  taper: number
  /** Sheet thickness. */
  thickness: number
}

/** Material slots on a panel: outer face, inner face, machined edge. */
export const PANEL_GROUPS = { outer: 0, inner: 1, edge: 2 } as const

/**
 * One articulated bloom panel: a fabricated sheet with real thickness, built
 * along +Y and hinged at the origin. The cross-section curves away from the
 * axis so a shut bloom nests into a spindle instead of a clash of flat blades.
 *
 * The geometry carries three material groups so a single mesh can show a satin
 * outer face, a pale inner face and a polished edge.
 */
export function createPanel(spec: PanelSpec, rows = 16, cols = 8): THREE.BufferGeometry {
  const half = spec.thickness * 0.5
  const positions: number[] = []
  const uvs: number[] = []

  const surfacePoint = (i: number, j: number, side: 1 | -1) => {
    const u = i / rows
    const v = j / cols
    const across = v * 2 - 1
    const shoulder = Math.pow(u, spec.taper)
    let width = THREE.MathUtils.lerp(spec.innerWidth, spec.outerWidth, shoulder)
    // Ease the very tip so the mouth does not end in a blunt rectangle.
    if (u > 0.88) width *= 1 - Math.pow((u - 0.88) / 0.12, 2) * 0.22
    const x = width * across
    const y = u * spec.length
    const z = -spec.cup * (1 - across * across) * (0.12 + 0.88 * Math.pow(u, 1.25)) + side * half
    return [x, y, z] as const
  }

  const push = (p: readonly [number, number, number], u: number, v: number) => {
    positions.push(p[0], p[1], p[2])
    uvs.push(u, v)
    return positions.length / 3 - 1
  }

  const stride = cols + 1
  // Outer shell faces away from the bloom axis, inner shell faces into the throat.
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) push(surfacePoint(i, j, 1), i / rows, j / cols)
  }
  const innerStart = positions.length / 3
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) push(surfacePoint(i, j, -1), i / rows, j / cols)
  }

  const outerIndices: number[] = []
  const innerIndices: number[] = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const a = i * stride + j
      const b = a + 1
      const c = a + stride
      const d = c + 1
      outerIndices.push(a, c, b, b, c, d)
      const e = innerStart + a
      const f = innerStart + b
      const g = innerStart + c
      const h = innerStart + d
      innerIndices.push(e, f, g, f, h, g)
    }
  }

  // Edges get their own vertices so the machined rim shades crisply.
  const edgeIndices: number[] = []
  const quad = (
    p0: readonly [number, number, number],
    p1: readonly [number, number, number],
    p2: readonly [number, number, number],
    p3: readonly [number, number, number],
  ) => {
    const a = push(p0, 0, 0)
    const b = push(p1, 1, 0)
    const c = push(p2, 1, 1)
    const d = push(p3, 0, 1)
    edgeIndices.push(a, b, c, a, c, d)
  }

  for (let i = 0; i < rows; i++) {
    // long edges
    quad(
      surfacePoint(i, 0, 1),
      surfacePoint(i, 0, -1),
      surfacePoint(i + 1, 0, -1),
      surfacePoint(i + 1, 0, 1),
    )
    quad(
      surfacePoint(i, cols, -1),
      surfacePoint(i, cols, 1),
      surfacePoint(i + 1, cols, 1),
      surfacePoint(i + 1, cols, -1),
    )
  }
  for (let j = 0; j < cols; j++) {
    // mouth and hinge ends
    quad(
      surfacePoint(rows, j, 1),
      surfacePoint(rows, j + 1, 1),
      surfacePoint(rows, j + 1, -1),
      surfacePoint(rows, j, -1),
    )
    quad(
      surfacePoint(0, j, -1),
      surfacePoint(0, j + 1, -1),
      surfacePoint(0, j + 1, 1),
      surfacePoint(0, j, 1),
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex([...outerIndices, ...innerIndices, ...edgeIndices])
  geometry.addGroup(0, outerIndices.length, PANEL_GROUPS.outer)
  geometry.addGroup(outerIndices.length, innerIndices.length, PANEL_GROUPS.inner)
  geometry.addGroup(
    outerIndices.length + innerIndices.length,
    edgeIndices.length,
    PANEL_GROUPS.edge,
  )
  geometry.computeVertexNormals()
  return geometry
}

/** A flat blade used for the geometric leaves. */
export function createLeaf(length: number, width: number): THREE.BufferGeometry {
  const positions = new Float32Array([
    0,
    0,
    0,
    -width * 0.5,
    length * 0.36,
    0.012,
    width * 0.5,
    length * 0.36,
    0.012,
    0,
    length,
    0,
  ])
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex([0, 1, 3, 0, 3, 2])
  geometry.computeVertexNormals()
  return geometry
}
