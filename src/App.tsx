import { lazy, Suspense } from 'react'

const FallIntro = lazy(() => import('./FallIntro'))
const PortfolioGuidelines = lazy(() => import('./PortfolioGuidelines'))

// 개발 환경에서만 존재한다. 프로덕션 빌드에서는 조건이 false로 접히면서 실험 번들이 산출물에서 빠진다.
const LabRouter = import.meta.env.DEV ? lazy(() => import('./labs/LabRouter')) : null

function normalize(pathname: string) {
  return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function App() {
  const path = normalize(window.location.pathname)

  if (LabRouter && (path === '/labs' || path.startsWith('/labs/'))) {
    return (
      <Suspense fallback={<main />}>
        <LabRouter slug={path.slice('/labs/'.length)} />
      </Suspense>
    )
  }

  if (path === '/guidelines') {
    return <Suspense fallback={<main className="guidelines-loading" />}><PortfolioGuidelines /></Suspense>
  }

  return <Suspense fallback={<main className="fall-intro" />}><FallIntro /></Suspense>
}

export default App
