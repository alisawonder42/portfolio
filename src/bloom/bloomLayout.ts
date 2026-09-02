import * as THREE from 'three'

import type { PetalShape } from './petalGeometry'

/** Fibonacci / golden angle in radians (137.507…°). */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/**
 * Global arrangement of the bloom. Everything varies continuously with the
 * petal's position `t ∈ [0,1]` along the spiral (0 = innermost, 1 = outermost),
 * which is how real spiral phyllotaxis works: there are no discrete rings, the
 * "whorls" the eye sees emerge from the golden-angle spacing.
 */
export interface BloomLayout {
  petalCount: number
  /** Angular step between consecutive petals (radians). Golden angle by default. */
  divergence: number
  /** Radial distance of the petal base from the axis at t=0 and t=1. */
  radiusInner: number
  radiusOuter: number
  /** Petal base height at t=0 and t=1 (outer petals attach lower on the receptacle). */
  heightInner: number
  heightOuter: number
  /** Petal scale at t=0 and t=1. */
  scaleInner: number
  scaleOuter: number
  /** Tilt from the axis (radians) when fully closed, for inner and outer petals. */
  closedTiltInner: number
  closedTiltOuter: number
  /** Tilt from the axis (radians) when fully open, for inner and outer petals. */
  openTiltInner: number
  openTiltOuter: number
  /** How strongly opening is staggered from outside to inside (0 all at once, 1 fully sequential). */
  stagger: number
  /** Extra yaw wobble per petal (radians) so the spiral is not machine-perfect. */
  jitter: number
  /** Number of distinct petal geometries interpolated from inner → outer shape. */
  shapeSteps: number
}

export interface PetalPlacement {
  index: number
  /** Normalised spiral position, 0 inner → 1 outer. */
  t: number
  /** Angle around the bloom axis. */
  angle: number
  radius: number
  height: number
  scale: number
  closedTilt: number
  openTilt: number
  /** Bloom value at which this petal starts to open. */
  delay: number
  /** Which interpolated geometry (0 .. shapeSteps-1) this petal uses. */
  shapeIndex: number
}

const smoothstep = (x: number) => {
  const c = THREE.MathUtils.clamp(x, 0, 1)
  return c * c * (3 - 2 * c)
}

/** Deterministic hash → [0,1) so the jitter is stable between renders. */
function hash01(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function computePlacements(layout: BloomLayout): PetalPlacement[] {
  const n = Math.max(1, Math.round(layout.petalCount))
  const out: PetalPlacement[] = []
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1)
    // Radius grows with √i as in a Fermat spiral so packing density stays even.
    const radial = Math.sqrt(t)
    const jitter = (hash01(i) - 0.5) * 2 * layout.jitter
    out.push({
      index: i,
      t,
      angle: i * layout.divergence + jitter,
      radius: THREE.MathUtils.lerp(layout.radiusInner, layout.radiusOuter, radial),
      height: THREE.MathUtils.lerp(layout.heightInner, layout.heightOuter, radial),
      scale: THREE.MathUtils.lerp(layout.scaleInner, layout.scaleOuter, t),
      closedTilt: THREE.MathUtils.lerp(layout.closedTiltInner, layout.closedTiltOuter, t),
      openTilt: THREE.MathUtils.lerp(layout.openTiltInner, layout.openTiltOuter, t),
      delay: layout.stagger * (1 - t),
      shapeIndex: Math.round(t * (layout.shapeSteps - 1)),
    })
  }
  return out
}

/**
 * Opening progress of a single petal for a global bloom value in [0,1].
 * Outer petals lead, inner petals follow; the curve eases so nothing snaps.
 */
export function petalOpenAmount(placement: PetalPlacement, bloom: number, stagger: number): number {
  const window = Math.max(1 - stagger, 0.05)
  return smoothstep((bloom - placement.delay) / window)
}

/** Inner → outer petal shape interpolation steps used by the renderer. */
export function shapeSeries(
  inner: PetalShape,
  outer: PetalShape,
  steps: number,
  lerp: (a: PetalShape, b: PetalShape, t: number) => PetalShape,
): PetalShape[] {
  const count = Math.max(1, Math.round(steps))
  const series: PetalShape[] = []
  for (let s = 0; s < count; s++) {
    series.push(lerp(inner, outer, count === 1 ? 0 : s / (count - 1)))
  }
  return series
}
