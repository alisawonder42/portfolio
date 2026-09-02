import { useCallback, useEffect, useRef, type RefObject } from 'react'

interface HeroBloomOptions {
  /** Openness the bloom settles at after the intro, before any scrolling. */
  rest?: number
  /** Duration of the intro unfurl in seconds. */
  introDuration?: number
  /** Delay before the intro starts, in seconds. */
  introDelay?: number
  /** Amplitude of the slow idle breathing. */
  breath?: number
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

/**
 * Drives the hero bloom: an intro unfurl on load, then scroll through the hero
 * opens it the rest of the way, with a faint breathing on top so it never sits
 * perfectly still.
 */
export function useHeroBloom(
  hero: RefObject<HTMLElement | null>,
  { rest = 0.58, introDuration = 2.6, introDelay = 0.3, breath = 0.015 }: HeroBloomOptions = {},
): () => number {
  const start = useRef<number | null>(null)
  const scroll = useRef(0)
  const reduced = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.current = mq.matches
    const onMq = () => (reduced.current = mq.matches)
    mq.addEventListener('change', onMq)

    const onScroll = () => {
      const el = hero.current
      if (!el) return
      const range = Math.max(el.offsetHeight - window.innerHeight * 0.4, 1)
      scroll.current = Math.min(Math.max(window.scrollY / range, 0), 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      mq.removeEventListener('change', onMq)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [hero])

  return useCallback(() => {
    const now = performance.now() / 1000
    if (start.current === null) start.current = now
    const elapsed = now - start.current - introDelay
    const intro = reduced.current
      ? 1
      : easeOutCubic(Math.min(Math.max(elapsed / introDuration, 0), 1))
    const breathing = reduced.current ? 0 : Math.sin(now * 0.45) * breath
    const base = rest + (1 - rest) * scroll.current
    return intro * base + breathing
  }, [breath, introDelay, introDuration, rest])
}
