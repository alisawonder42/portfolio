import { lazy, Suspense } from 'react'

import { Home } from '@/pages/Home'

import { useHashRoute } from './useHashRoute'

const BloomLab = lazy(() => import('@/lab/BloomLab').then((m) => ({ default: m.BloomLab })))

export function App() {
  const route = useHashRoute()
  if (route === 'lab') {
    return (
      <Suspense fallback={null}>
        <BloomLab />
      </Suspense>
    )
  }
  return <Home />
}
