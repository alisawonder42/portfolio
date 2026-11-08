import { lazy, Suspense } from 'react'

import { useLanguage } from '@/content/Language'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { ProjectPage } from '@/pages/ProjectPage'

import { useRoute } from './routing'

const BloomLab = lazy(() => import('@/lab/BloomLab').then((m) => ({ default: m.BloomLab })))

export function App() {
  const route = useRoute()
  const { projects } = useLanguage()

  if (route.name === 'lab') {
    return (
      <Suspense fallback={null}>
        <BloomLab />
      </Suspense>
    )
  }

  if (route.name === 'project') {
    const project = projects.find((item) => item.slug === route.slug)
    return project ? <ProjectPage project={project} /> : <NotFound />
  }

  if (route.name === 'notFound') return <NotFound />

  return <Home />
}
