import { useEffect, useState } from 'react'

export type Route = 'home' | 'lab'

function parse(hash: string): Route {
  return hash.replace(/^#\/?/, '').split(/[/?]/)[0] === 'lab' ? 'lab' : 'home'
}

/**
 * Minimal hash routing. The site is a single page; the only secondary route is
 * the design lab, and hash routing keeps static hosting trivial.
 */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
