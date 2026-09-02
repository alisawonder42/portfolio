import * as THREE from 'three'

/**
 * Shape parameters for a single petal.
 *
 * The petal lives in its own local frame: the base sits at the origin, the
 * petal grows along +Y, its local +Z points away from the centre of the flower
 * (the "outside" of the petal) and the cupped inner face looks toward −Z.
 * All lengths are in scene units; the whole bloom is later scaled as a unit.
 */
export interface PetalShape {
  /** Length of the petal centreline. */
  length: number
  /** Maximum full width of the petal. */
  width: number
  /** Where along the length (0..1) the petal is widest. */
  widthPeak: number
  /** Width at the base as a fraction (0..1) of the maximum width. */
  baseWidth: number
  /** Exponent shaping the tip: <1 blunt, 1 round, >1 pointed, >2 spear-like. */
  tipSharpness: number
  /** Total backward bend (radians) of the centreline from base to tip. */
  curl: number
  /** How the bend is distributed: 1 uniform, >1 concentrated at the tip (recurved). */
  curlBias: number
  /** Cross-section cupping depth relative to local half-width (0 flat, ~0.6 deep). */
  cup: number
  /** Cupping change toward the tip: 0 constant, 1 flat tip, >1 tip flares outward. */
  flare: number
  /** Rotation of the cross-section around the centreline, base→tip (radians). */
  twist: number
  /** Amplitude of the rim ripple relative to local half-width. */
  edgeWave: number
  /** Number of ripple half-waves along the rim. */
  edgeWaveFreq: number
  /** Shell thickness of the metal sheet. */
  thickness: number
}

export interface PetalTessellation {
  segmentsU: number
  segmentsV: number
}

export const DEFAULT_TESSELLATION: PetalTessellation = { segmentsU: 48, segmentsV: 18 }

/** Half-width profile along the petal, in [0, 1]. C¹ continuous at the peak. */
export function widthProfile(u: number, shape: PetalShape): number {
  const peak = THREE.MathUtils.clamp(shape.widthPeak, 0.05, 0.95)
  if (u <= peak) {
    const t = u / peak
    return shape.baseWidth + (1 - shape.baseWidth) * Math.sin(t * Math.PI * 0.5)
  }
  const t = (u - peak) / (1 - peak)
  return Math.pow(Math.cos(t * Math.PI * 0.5), shape.tipSharpness)
}

interface SurfaceGrid {
  positions: Float32Array
  uvs: Float32Array
  rows: number
  cols: number
}

/**
 * Evaluates the petal mid-surface on a (segmentsU+1) × (segmentsV+1) grid.
 *
 * The centreline is integrated numerically so that `curl` is an honest bend
 * angle rather than a displacement, and the local frame is twisted about the
 * tangent before the cross-section (cup + rim ripple) is applied.
 */
export function samplePetalSurface(
  shape: PetalShape,
  segmentsU: number,
  segmentsV: number,
): SurfaceGrid {
  const rows = segmentsU + 1
  const cols = segmentsV + 1
  const positions = new Float32Array(rows * cols * 3)
  const uvs = new Float32Array(rows * cols * 2)

  const step = shape.length / segmentsU
  const halfW = shape.width * 0.5
  const minHalf = shape.width * 0.004 // keep the tip from collapsing to zero-area triangles

  let cy = 0
  let cz = 0
  for (let i = 0; i < rows; i++) {
    const u = i / segmentsU
    const phi = shape.curl * Math.pow(u, shape.curlBias)
    // Tangent T in the YZ plane; untwisted binormal B0 = +X; normal N0 = T × B0.
    const ty = Math.cos(phi)
    const tz = Math.sin(phi)
    const n0y = -tz
    const n0z = ty

    const tau = shape.twist * u
    const cosT = Math.cos(tau)
    const sinT = Math.sin(tau)
    // Rotate (B0, N0) about T by tau.
    const Bx = cosT
    const By = n0y * sinT
    const Bz = n0z * sinT
    const Nx = -sinT
    const Ny = n0y * cosT
    const Nz = n0z * cosT

    const w = Math.max(halfW * widthProfile(u, shape), minHalf)
    const cupCoef = shape.cup * (1 - u * shape.flare)
    const ripple = shape.edgeWave * Math.sin(shape.edgeWaveFreq * Math.PI * u)

    for (let j = 0; j < cols; j++) {
      const v = (j / segmentsV) * 2 - 1
      const lateral = v * w
      // Parabolic cup toward the flower centre (−N); ripple confined to the rim.
      const normalOffset = -cupCoef * w * v * v + ripple * w * Math.pow(Math.abs(v), 3)
      const k = (i * cols + j) * 3
      positions[k] = Bx * lateral + Nx * normalOffset
      positions[k + 1] = cy + By * lateral + Ny * normalOffset
      positions[k + 2] = cz + Bz * lateral + Nz * normalOffset
      const uk = (i * cols + j) * 2
      uvs[uk] = u
      uvs[uk + 1] = (v + 1) * 0.5
    }

    if (i < rows - 1) {
      const uMid = (i + 0.5) / segmentsU
      const phiMid = shape.curl * Math.pow(uMid, shape.curlBias)
      cy += Math.cos(phiMid) * step
      cz += Math.sin(phiMid) * step
    }
  }

  return { positions, uvs, rows, cols }
}

/** Finite-difference normals n = ∂S/∂v × ∂S/∂u, which points to the petal's outer face. */
function gridNormals(positions: Float32Array, rows: number, cols: number): Float32Array {
  const normals = new Float32Array(positions.length)
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const du = new THREE.Vector3()
  const dv = new THREE.Vector3()
  const n = new THREE.Vector3()
  const read = (i: number, j: number, out: THREE.Vector3) =>
    out.fromArray(positions, (i * cols + j) * 3)

  for (let i = 0; i < rows; i++) {
    const i0 = Math.max(i - 1, 0)
    const i1 = Math.min(i + 1, rows - 1)
    for (let j = 0; j < cols; j++) {
      const j0 = Math.max(j - 1, 0)
      const j1 = Math.min(j + 1, cols - 1)
      du.subVectors(read(i1, j, a), read(i0, j, b))
      dv.subVectors(read(i, j1, a), read(i, j0, b))
      n.crossVectors(dv, du)
      if (n.lengthSq() < 1e-14) {
        // The tip row collapses to a point; borrow the lateral direction from the row below.
        dv.subVectors(read(i0, j1, a), read(i0, j0, b))
        n.crossVectors(dv, du)
      }
      n.normalize().toArray(normals, (i * cols + j) * 3)
    }
  }
  return normals
}

interface ShellBuffers {
  position: Float32Array
  normal: Float32Array
  uv: Float32Array
  index: Uint32Array
}

/** Outline of the grid as a closed loop, counter-clockwise when viewed from the outer face. */
function outlineLoop(rows: number, cols: number): Array<[number, number]> {
  const loop: Array<[number, number]> = []
  for (let i = 0; i < rows; i++) loop.push([i, 0]) // left edge, base → tip
  for (let i = rows - 1; i >= 0; i--) loop.push([i, cols - 1]) // right edge, tip → base
  for (let j = cols - 2; j >= 1; j--) loop.push([0, j]) // base, right → left
  return loop
}

/**
 * Turns a mid-surface grid into a closed metal shell: an offset outer face, an
 * offset inner face with reversed winding, and a rim band around the outline.
 * Rim vertices are not shared with the faces so the edge reads as a crisp,
 * machined edge under a metallic material rather than a smoothed blob.
 */
function buildShell(grid: SurfaceGrid, thickness: number): ShellBuffers {
  const { positions, uvs, rows, cols } = grid
  const normals = gridNormals(positions, rows, cols)
  const half = thickness * 0.5
  const faceVerts = rows * cols
  const loop = outlineLoop(rows, cols)
  const rimVerts = loop.length * 2

  const totalVerts = faceVerts * 2 + rimVerts
  const position = new Float32Array(totalVerts * 3)
  const normal = new Float32Array(totalVerts * 3)
  const uv = new Float32Array(totalVerts * 2)

  for (let k = 0; k < faceVerts; k++) {
    const p = k * 3
    const nx = normals[p]
    const ny = normals[p + 1]
    const nz = normals[p + 2]
    const outer = p
    const inner = (faceVerts + k) * 3
    position[outer] = positions[p] + nx * half
    position[outer + 1] = positions[p + 1] + ny * half
    position[outer + 2] = positions[p + 2] + nz * half
    normal[outer] = nx
    normal[outer + 1] = ny
    normal[outer + 2] = nz
    position[inner] = positions[p] - nx * half
    position[inner + 1] = positions[p + 1] - ny * half
    position[inner + 2] = positions[p + 2] - nz * half
    normal[inner] = -nx
    normal[inner + 1] = -ny
    normal[inner + 2] = -nz
    uv[k * 2] = uvs[k * 2]
    uv[k * 2 + 1] = uvs[k * 2 + 1]
    uv[(faceVerts + k) * 2] = uvs[k * 2]
    uv[(faceVerts + k) * 2 + 1] = uvs[k * 2 + 1]
  }

  const rimBase = faceVerts * 2
  const edgeTan = new THREE.Vector3()
  const surfN = new THREE.Vector3()
  const outward = new THREE.Vector3()
  for (let o = 0; o < loop.length; o++) {
    const [i, j] = loop[o]
    const [i2, j2] = loop[(o + 1) % loop.length]
    const k = (i * cols + j) * 3
    const k2 = (i2 * cols + j2) * 3
    edgeTan.set(
      positions[k2] - positions[k],
      positions[k2 + 1] - positions[k + 1],
      positions[k2 + 2] - positions[k + 2],
    )
    surfN.fromArray(normals, k)
    outward.crossVectors(surfN, edgeTan)
    if (outward.lengthSq() < 1e-14) outward.set(0, -1, 0)
    outward.normalize()

    const top = rimBase + o * 2
    const bottom = top + 1
    for (const [vi, sign] of [
      [top, 1],
      [bottom, -1],
    ] as const) {
      position[vi * 3] = positions[k] + surfN.x * half * sign
      position[vi * 3 + 1] = positions[k + 1] + surfN.y * half * sign
      position[vi * 3 + 2] = positions[k + 2] + surfN.z * half * sign
      outward.toArray(normal, vi * 3)
      uv[vi * 2] = uvs[(i * cols + j) * 2]
      uv[vi * 2 + 1] = uvs[(i * cols + j) * 2 + 1]
    }
  }

  const quadCount = (rows - 1) * (cols - 1)
  const index = new Uint32Array((quadCount * 4 + loop.length * 2) * 3)
  let w = 0
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const a = i * cols + j
      const b = a + 1 // +v
      const c = a + cols // +u
      const d = c + 1
      // Outer face: (b−a) × (c−a) = dv × du = +n.
      index[w++] = a
      index[w++] = b
      index[w++] = c
      index[w++] = b
      index[w++] = d
      index[w++] = c
      // Inner face, reversed.
      index[w++] = faceVerts + a
      index[w++] = faceVerts + c
      index[w++] = faceVerts + b
      index[w++] = faceVerts + b
      index[w++] = faceVerts + c
      index[w++] = faceVerts + d
    }
  }
  for (let o = 0; o < loop.length; o++) {
    const t0 = rimBase + o * 2
    const b0 = t0 + 1
    const t1 = rimBase + ((o + 1) % loop.length) * 2
    const b1 = t1 + 1
    // (t1−t0) × (b0−t0) = edgeTan × (−surfN) = surfN × edgeTan = outward.
    index[w++] = t0
    index[w++] = t1
    index[w++] = b0
    index[w++] = t1
    index[w++] = b1
    index[w++] = b0
  }

  return { position, normal, uv, index }
}

/**
 * Builds a closed, thick petal shell geometry. When `closedShape` is supplied,
 * a morph target with identical topology is attached so a single mesh can blend
 * between the open petal (influence 0) and a furled bud petal (influence 1).
 */
export function createPetalGeometry(
  shape: PetalShape,
  closedShape?: PetalShape,
  tessellation: PetalTessellation = DEFAULT_TESSELLATION,
): THREE.BufferGeometry {
  const { segmentsU, segmentsV } = tessellation
  const shell = buildShell(samplePetalSurface(shape, segmentsU, segmentsV), shape.thickness)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(shell.position, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(shell.normal, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(shell.uv, 2))
  geometry.setIndex(new THREE.BufferAttribute(shell.index, 1))

  if (closedShape) {
    const closed = buildShell(
      samplePetalSurface(closedShape, segmentsU, segmentsV),
      closedShape.thickness,
    )
    geometry.morphAttributes.position = [new THREE.BufferAttribute(closed.position, 3)]
    geometry.morphAttributes.normal = [new THREE.BufferAttribute(closed.normal, 3)]
    geometry.morphTargetsRelative = false
  }

  geometry.computeBoundingSphere()
  return geometry
}

export function lerpPetalShape(a: PetalShape, b: PetalShape, t: number): PetalShape {
  const out = {} as Record<keyof PetalShape, number>
  for (const key of Object.keys(a) as Array<keyof PetalShape>) {
    out[key] = a[key] + (b[key] - a[key]) * t
  }
  return out as PetalShape
}
