export type Point = [number, number, number]

export type BranchKind = 'bloom' | 'bud'

export interface BranchSpec {
  /** Index into MAIN where this branch is hinged. */
  attachIndex: number
  /** Absolute points, starting at the attachment. */
  points: Point[]
  radiusStart: number
  radiusEnd: number
  kind: BranchKind
}

/**
 * The climbing silhouette. Points are deliberately irregular so the vine reads
 * as botanical from a distance while every segment stays a rigid member.
 */
export const MAIN: Point[] = [
  [-0.1, -4.15, 0],
  [0.06, -3.6, 0.03],
  [-0.1, -3.05, 0.02],
  [-0.02, -2.5, -0.03],
  [0.14, -1.96, 0],
  [0.05, -1.42, 0.05],
  [-0.1, -0.87, 0.02],
  [0.05, -0.3, -0.04],
  [0.17, 0.29, 0],
  [0.08, 0.88, 0.05],
  [-0.08, 1.47, 0.02],
  [-0.15, 2.06, -0.04],
  [0.04, 2.64, 0],
  [0.02, 3.22, 0.03],
  [-0.15, 3.84, 0],
]

export const BRANCHES: BranchSpec[] = [
  {
    attachIndex: 2,
    points: [MAIN[2], [-0.44, -2.86, 0.05], [-0.82, -2.62, 0.11], [-1.16, -2.34, 0.13]],
    radiusStart: 0.03,
    radiusEnd: 0.017,
    kind: 'bloom',
  },
  {
    attachIndex: 4,
    points: [MAIN[4], [0.4, -1.74, 0.05], [0.71, -1.48, 0.1], [0.99, -1.2, 0.09]],
    radiusStart: 0.023,
    radiusEnd: 0.013,
    kind: 'bud',
  },
  {
    attachIndex: 6,
    points: [MAIN[6], [-0.42, -0.59, 0.04], [-0.75, -0.25, 0.11], [-1.06, 0.0, 0.14]],
    radiusStart: 0.023,
    radiusEnd: 0.013,
    kind: 'bud',
  },
  {
    attachIndex: 7,
    points: [MAIN[7], [0.42, -0.02, 0.05], [0.79, 0.26, 0.12], [1.16, 0.5, 0.14]],
    radiusStart: 0.03,
    radiusEnd: 0.017,
    kind: 'bloom',
  },
  {
    attachIndex: 9,
    points: [MAIN[9], [0.44, 1.1, 0.04], [0.78, 1.4, 0.1], [1.06, 1.69, 0.13]],
    radiusStart: 0.021,
    radiusEnd: 0.012,
    kind: 'bud',
  },
  {
    attachIndex: 11,
    points: [MAIN[11], [-0.46, 2.26, 0.05], [-0.79, 2.62, 0.11], [-1.0, 3.02, 0.13]],
    radiusStart: 0.028,
    radiusEnd: 0.016,
    kind: 'bloom',
  },
  {
    attachIndex: 13,
    points: [MAIN[13], [0.33, 3.4, 0.04], [0.56, 3.76, 0.09], [0.66, 4.13, 0.11]],
    radiusStart: 0.019,
    radiusEnd: 0.011,
    kind: 'bud',
  },
]

export interface LeafSpec {
  attachIndex: number
  base: Point
  tip: Point
  width: number
}

export const LEAVES: LeafSpec[] = [
  { attachIndex: 1, base: [0.0, -3.5, 0.03], tip: [-0.42, -3.24, 0.07], width: 0.13 },
  { attachIndex: 5, base: [0.02, -1.3, 0.04], tip: [0.44, -1.02, 0.08], width: 0.12 },
  { attachIndex: 8, base: [0.14, 0.4, 0.03], tip: [-0.26, 0.72, 0.08], width: 0.13 },
  { attachIndex: 10, base: [-0.07, 1.58, 0.03], tip: [0.32, 1.86, 0.08], width: 0.12 },
  { attachIndex: 12, base: [0.04, 2.75, 0.03], tip: [-0.34, 3.0, 0.07], width: 0.11 },
]

function distance(a: Point, b: Point): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

/** Arc-length position of every MAIN point, normalised to 0..1. */
export function normalisedLengths(points: Point[]): number[] {
  const cumulative = [0]
  for (let i = 1; i < points.length; i++) {
    cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]))
  }
  const total = cumulative[cumulative.length - 1] || 1
  return cumulative.map((value) => value / total)
}

export const MAIN_U = normalisedLengths(MAIN)

export function toLocal(point: Point, origin: Point): Point {
  return [point[0] - origin[0], point[1] - origin[1], point[2] - origin[2]]
}
