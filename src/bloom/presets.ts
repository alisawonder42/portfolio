import { GOLDEN_ANGLE, type BloomLayout } from './bloomLayout'
import type { PetalShape } from './petalGeometry'

export type MetalFinish = 'chrome' | 'brass' | 'titanium' | 'gunmetal' | 'rose-gold'

export interface MetalMaterialParams {
  color: string
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
  /** Thin-film interference; 0 disables. Gives the anodised-titanium look. */
  iridescence: number
  iridescenceIOR: number
  iridescenceThicknessRange: [number, number]
  envMapIntensity: number
  /** Directional highlight stretching (brushed metal). 0 = polished. */
  anisotropy: number
  anisotropyRotation: number
}

export const METAL_FINISHES: Record<MetalFinish, MetalMaterialParams> = {
  chrome: {
    color: '#e8e9ee',
    roughness: 0.16,
    metalness: 1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.08,
    iridescence: 0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    envMapIntensity: 1.2,
    anisotropy: 0,
    anisotropyRotation: 0,
  },
  brass: {
    color: '#d9a85a',
    roughness: 0.32,
    metalness: 1,
    clearcoat: 0.1,
    clearcoatRoughness: 0.3,
    iridescence: 0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    envMapIntensity: 1.1,
    anisotropy: 0.6,
    anisotropyRotation: Math.PI * 0.5,
  },
  titanium: {
    color: '#b8bcc6',
    roughness: 0.22,
    metalness: 1,
    clearcoat: 0.25,
    clearcoatRoughness: 0.15,
    iridescence: 0.85,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [180, 620],
    envMapIntensity: 1.15,
    anisotropy: 0.2,
    anisotropyRotation: 0,
  },
  gunmetal: {
    color: '#5c6068',
    roughness: 0.28,
    metalness: 1,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    iridescence: 0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    envMapIntensity: 1.3,
    anisotropy: 0,
    anisotropyRotation: 0,
  },
  'rose-gold': {
    color: '#e0a894',
    roughness: 0.2,
    metalness: 1,
    clearcoat: 0.3,
    clearcoatRoughness: 0.12,
    iridescence: 0.15,
    iridescenceIOR: 1.4,
    iridescenceThicknessRange: [200, 500],
    envMapIntensity: 1.15,
    anisotropy: 0,
    anisotropyRotation: 0,
  },
}

export type CoreStyle = 'beads' | 'dome' | 'none'

export interface CoreParams {
  style: CoreStyle
  /** Radius of the receptacle the petals attach to. */
  radius: number
  /** Number of stamen beads (beads style). */
  beadCount: number
  beadRadius: number
  /** Height of the stamen cluster above the receptacle. */
  beadHeight: number
}

export interface BloomConfig {
  name: string
  description: string
  layout: BloomLayout
  /** Open petal shape at the innermost and outermost spiral positions. */
  petalInner: PetalShape
  petalOuter: PetalShape
  /** Furled (bud) shapes used as morph targets; derived if omitted. */
  budInner?: PetalShape
  budOuter?: PetalShape
  core: CoreParams
  finish: MetalFinish
}

/** Derives a furled bud shape from an open petal: straighter, more cupped, slimmer. */
export function deriveBudShape(open: PetalShape): PetalShape {
  return {
    ...open,
    width: open.width * 0.82,
    curl: open.curl * 0.12,
    curlBias: Math.max(open.curlBias, 1.4),
    cup: Math.min(open.cup * 1.5 + 0.12, 0.9),
    flare: 0,
    twist: open.twist * 0.25,
    edgeWave: open.edgeWave * 0.3,
  }
}

const baseLayout: BloomLayout = {
  petalCount: 44,
  divergence: GOLDEN_ANGLE,
  radiusInner: 0.06,
  radiusOuter: 0.42,
  heightInner: 0.08,
  heightOuter: -0.06,
  scaleInner: 0.55,
  scaleOuter: 1,
  closedTiltInner: 0.05,
  closedTiltOuter: 0.28,
  openTiltInner: 0.35,
  openTiltOuter: 1.35,
  stagger: 0.55,
  jitter: 0.03,
  shapeSteps: 5,
}

/**
 * Direction A — "Rose": dense spiral, softly cupped rounded petals whose outer
 * tips recurve. Reads as a classic bloom rendered in polished metal.
 */
export const ROSE: BloomConfig = {
  name: 'Rose',
  description: 'Dense spiral, rounded cupped petals, outer tips recurve backwards.',
  layout: { ...baseLayout, petalCount: 44 },
  petalInner: {
    length: 0.72,
    width: 0.5,
    widthPeak: 0.62,
    baseWidth: 0.3,
    tipSharpness: 0.75,
    curl: 0.35,
    curlBias: 2.2,
    cup: 0.55,
    flare: 0.6,
    twist: 0.05,
    edgeWave: 0.05,
    edgeWaveFreq: 3,
    thickness: 0.012,
  },
  petalOuter: {
    length: 1,
    width: 0.86,
    widthPeak: 0.55,
    baseWidth: 0.28,
    tipSharpness: 0.7,
    curl: 1.35,
    curlBias: 2.6,
    cup: 0.3,
    flare: 1.6,
    twist: 0.12,
    edgeWave: 0.12,
    edgeWaveFreq: 4,
    thickness: 0.014,
  },
  core: { style: 'dome', radius: 0.11, beadCount: 60, beadRadius: 0.02, beadHeight: 0.08 },
  finish: 'chrome',
}

/**
 * Direction B — "Lotus": fewer, larger, spear-tipped petals with a shallow cup
 * and very little recurve. Architectural, calm, more negative space.
 */
export const LOTUS: BloomConfig = {
  name: 'Lotus',
  description: 'Fewer pointed petals, shallow cup, wide calm opening with clean edges.',
  layout: {
    ...baseLayout,
    petalCount: 26,
    radiusInner: 0.08,
    radiusOuter: 0.36,
    scaleInner: 0.6,
    closedTiltInner: 0.04,
    closedTiltOuter: 0.2,
    openTiltInner: 0.45,
    openTiltOuter: 1.15,
    stagger: 0.45,
    jitter: 0.015,
  },
  petalInner: {
    length: 0.8,
    width: 0.42,
    widthPeak: 0.42,
    baseWidth: 0.32,
    tipSharpness: 2.2,
    curl: 0.25,
    curlBias: 1.6,
    cup: 0.35,
    flare: 0.4,
    twist: 0,
    edgeWave: 0,
    edgeWaveFreq: 2,
    thickness: 0.014,
  },
  petalOuter: {
    length: 1.05,
    width: 0.6,
    widthPeak: 0.4,
    baseWidth: 0.3,
    tipSharpness: 2.4,
    curl: 0.55,
    curlBias: 1.8,
    cup: 0.22,
    flare: 0.8,
    twist: 0.05,
    edgeWave: 0,
    edgeWaveFreq: 2,
    thickness: 0.016,
  },
  core: { style: 'beads', radius: 0.14, beadCount: 90, beadRadius: 0.018, beadHeight: 0.1 },
  finish: 'brass',
}

/**
 * Direction C — "Dahlia": many narrow, deeply cupped, almost tubular petals
 * with sharp tips. Reads as engineered and intricate, with lots of small
 * reflections.
 */
export const DAHLIA: BloomConfig = {
  name: 'Dahlia',
  description: 'Many narrow, deeply cupped, sharp petals; intricate and engineered.',
  layout: {
    ...baseLayout,
    petalCount: 72,
    radiusInner: 0.04,
    radiusOuter: 0.4,
    heightOuter: -0.1,
    scaleInner: 0.45,
    closedTiltInner: 0.03,
    closedTiltOuter: 0.35,
    openTiltInner: 0.3,
    openTiltOuter: 1.45,
    stagger: 0.65,
    jitter: 0.02,
    shapeSteps: 6,
  },
  petalInner: {
    length: 0.7,
    width: 0.26,
    widthPeak: 0.55,
    baseWidth: 0.4,
    tipSharpness: 1.8,
    curl: 0.3,
    curlBias: 2,
    cup: 0.7,
    flare: 0.2,
    twist: 0.1,
    edgeWave: 0,
    edgeWaveFreq: 2,
    thickness: 0.01,
  },
  petalOuter: {
    length: 1.05,
    width: 0.34,
    widthPeak: 0.5,
    baseWidth: 0.4,
    tipSharpness: 1.6,
    curl: 1.1,
    curlBias: 2.2,
    cup: 0.6,
    flare: 0.5,
    twist: 0.25,
    edgeWave: 0,
    edgeWaveFreq: 2,
    thickness: 0.011,
  },
  core: { style: 'beads', radius: 0.08, beadCount: 120, beadRadius: 0.014, beadHeight: 0.06 },
  finish: 'titanium',
}

export const DIRECTIONS = { rose: ROSE, lotus: LOTUS, dahlia: DAHLIA } as const
export type DirectionKey = keyof typeof DIRECTIONS

/** The direction the site currently ships with. Swap once a direction is chosen. */
export const DEFAULT_DIRECTION: DirectionKey = 'rose'
