import { useEffect, useRef } from 'react'

import { damp, INITIAL_STATE, smoothstep, type OrganismState } from './state'

/**
 * Maps page scroll to growth / sequential bloom progress, and damps cursor
 * motion. The canvas reads this ref every frame; the DOM is the source of truth
 * for section positions so the 3D narrative stays locked to the editorial page.
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
    const heroTravel = Math.min(1, Math.max(0, window.scrollY / (vh * 0.85)))
    const bloom1 = sectionOpen('projects', 0.9, 0.3)
    const bloom2 = sectionOpen('playground', 0.9, 0.3)
    const bloom3 = sectionOpen('about', 0.9, 0.3)

    const growthTarget = Math.min(
      1,
      0.16 + 0.18 * heroTravel + 0.22 * bloom1 + 0.22 * bloom2 + 0.22 * bloom3,
    )

    const p = pointer.current
    const vx = (p.x - p.px) / Math.max(dt, 1 / 120)
    const vy = (p.y - p.py) / Math.max(dt, 1 / 120)
    p.px = p.x
    p.py = p.y

    if (reduced.current) {
      s.growth = growthTarget
      s.bloom1 = bloom1
      s.bloom2 = bloom2
      s.bloom3 = bloom3
      s.cursorX = 0
      s.cursorY = 0
      s.cursorVx = 0
      s.cursorVy = 0
      return s
    }

    s.growth = damp(s.growth, growthTarget, 3.1, dt)
    s.bloom1 = damp(s.bloom1, bloom1, 2.05, dt)
    s.bloom2 = damp(s.bloom2, bloom2, 2.05, dt)
    s.bloom3 = damp(s.bloom3, bloom3, 2.05, dt)
    s.cursorX = damp(s.cursorX, p.x, 3.6, dt)
    s.cursorY = damp(s.cursorY, p.y, 3.6, dt)
    s.cursorVx = damp(s.cursorVx, vx, 6.2, dt)
    s.cursorVy = damp(s.cursorVy, vy, 6.2, dt)
    return s
  }

  return { state, tick }
}

function sectionOpen(id: string, enter = 0.9, full = 0.3): number {
  const el = document.getElementById(id)
  if (!el) return 0
  const vh = window.innerHeight || 1
  return smoothstep(enter, full, el.getBoundingClientRect().top / vh)
}
