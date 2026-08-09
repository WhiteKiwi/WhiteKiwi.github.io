import { lazy, Suspense } from 'react'

const labs = {
  eggs: { Component: lazy(() => import('./EggLab')), fallback: 'egg-lab' },
  glass: { Component: lazy(() => import('./GlassLab')), fallback: 'glass-lab-page' },
  birds: { Component: lazy(() => import('./BirdLab')), fallback: 'bird-lab-page' },
  pointer: { Component: lazy(() => import('./PointerLab')), fallback: 'pointer-lab' },
} as const

function LabIndex() {
  return (
    <main style={{ padding: '80px 8vw', font: '400 .95rem/2 "DM Mono", monospace' }}>
      <p style={{ opacity: .55 }}>개발 환경 전용 실험 페이지</p>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {Object.keys(labs).map((slug) => (
          <li key={slug}><a href={`/labs/${slug}`}>/labs/{slug} ↗</a></li>
        ))}
      </ul>
      <a href="/" style={{ opacity: .55 }}>← 메인 여정</a>
    </main>
  )
}

function LabRouter({ slug }: { slug: string }) {
  const lab = labs[slug as keyof typeof labs]
  if (!lab) return <LabIndex />

  const { Component, fallback } = lab
  return (
    <Suspense fallback={<main className={fallback} />}>
      <Component />
    </Suspense>
  )
}

export default LabRouter
