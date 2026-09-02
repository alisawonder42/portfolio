import { useEffect, useRef } from 'react'

import { damp, INITIAL_STATE, smoothstep, type OrganismState } from './state'

/**
 * Maps page scroll to global growth and to three independent bloom progress
 * values, and damps cursor motion. The canvas reads this ref every frame; the
 * DOM is the source of truth for section positions, so the organism's narrative
 * stays locked to the editorial page rather than to a pixel count.
 */
export function useOrganismDriver() {
  const state = useRef<OrganismState>({ ...INITIAL_STATE })
  const pointer = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const reduced = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.current = mq.matches
    const onMq = () => (reduced.current = mq.matches)
    mq.addEventListener('change', onMq)

    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      mq.removeEventListener('change', onMq)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  const tick = (dt: number) => {
    const s = state.current
    const vh = window.innerHeight || 1

    // globalGrowthProgress: the hero scroll extends the stem, then each section
    // that arrives adds another stage of the organism.
    const heroTravel = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)))
    const bloom1Target = sectionOpen('projects')
    const bloom2Target = sectionOpen('playground')
    const bloom3Target = sectionOpen('about')
    const growthTarget = Math.min(
      1,
      0.22 * heroTravel + 0.26 * bloom1Target + 0.26 * bloom2Target + 0.26 * bloom3Target,
    )

    const p = pointer.current
    const vx = (p.x - p.px) / Math.max(dt, 1 / 120)
    const vy = (p.y - p.py) / Math.max(dt, 1 / 120)
    p.px = p.x
    p.py = p.y

    if (reduced.current) {
      s.growth = growthTarget
      s.bloom1 = bloom1Target
      s.bloom2 = bloom2Target
      s.bloom3 = bloom3Target
      s.cursorX = 0
      s.cursorY = 0
      s.cursorVx = 0
      s.cursorVy = 0
      return s
    }

    s.growth = damp(s.growth, growthTarget, 3, dt)
    s.bloom1 = damp(s.bloom1, bloom1Target, 2, dt)
    s.bloom2 = damp(s.bloom2, bloom2Target, 2, dt)
    s.bloom3 = damp(s.bloom3, bloom3Target, 2, dt)
    s.cursorX = damp(s.cursorX, p.x, 3.2, dt)
    s.cursorY = damp(s.cursorY, p.y, 3.2, dt)
    s.cursorVx = damp(s.cursorVx, vx, 5.5, dt)
    s.cursorVy = damp(s.cursorVy, vy, 5.5, dt)

    if (import.meta.env.DEV) {
      ;(window as unknown as { __organism?: OrganismState }).__organism = { ...s }
    }
    return s
  }

  return { state, tick }
}

/** 0 while the section is still below the fold, 1 once it has settled in view. */
function sectionOpen(id: string, enter = 0.85, full = 0.25): number {
  const el = document.getElementById(id)
  if (!el) return 0
  const vh = window.innerHeight || 1
  return smoothstep(enter, full, el.getBoundingClientRect().top / vh)
}
