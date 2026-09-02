export interface OrganismState {
  /** How much of the organism has grown, 0..1. */
  growth: number
  bloom1: number
  bloom2: number
  bloom3: number
  cursorX: number
  cursorY: number
  cursorVx: number
  cursorVy: number
}

export const INITIAL_STATE: OrganismState = {
  growth: 0.16,
  bloom1: 0,
  bloom2: 0,
  bloom3: 0,
  cursorX: 0,
  cursorY: 0,
  cursorVx: 0,
  cursorVy: 0,
}

/** GLSL-style smoothstep(edge0, edge1, x). */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-Math.max(dt, 0) * lambda))
}

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return 1 - Math.pow(1 - x, 3)
}
