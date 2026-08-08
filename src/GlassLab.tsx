import type { ReactNode } from 'react'
import './glass-lab.css'

function SeedRing() {
  return <span className="seed-ring">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</span>
}

function GlassShell({ variant, children }: { variant: string, children: ReactNode }) {
  return (
    <div className={`glass-study-egg ${variant}`}>
      <div className="glass-study-inner">{children}</div>
      <span className="shell-glint" />
      <span className="shell-rim" />
    </div>
  )
}

function KiwiSpecimen() {
  return (
    <GlassShell variant="shell-specimen">
      <span className="specimen-flesh"><span className="specimen-center" /><SeedRing /></span>
    </GlassShell>
  )
}

function SeedHalo() {
  return (
    <GlassShell variant="shell-halo">
      <span className="halo-center" />
      <SeedRing />
    </GlassShell>
  )
}

function LiquidCore() {
  return (
    <GlassShell variant="shell-liquid">
      <span className="liquid-blob liquid-main" />
      <span className="liquid-blob liquid-drop" />
      <span className="liquid-bubble bubble-one" />
      <span className="liquid-bubble bubble-two" />
    </GlassShell>
  )
}

function KiwiEmbryo() {
  return (
    <GlassShell variant="shell-embryo">
      <svg className="embryo-bird" viewBox="0 0 180 180" aria-hidden="true">
        <path d="M37 107c0-42 27-72 68-72 36 0 58 23 58 56 0 39-29 60-68 60-34 0-58-16-58-44Z" />
        <path className="embryo-beak" d="M130 68c25 1 39 8 48 19-18 7-34 5-51-5Z" />
        <circle className="embryo-eye" cx="123" cy="61" r="5" />
      </svg>
      <span className="embryo-pulse" />
    </GlassShell>
  )
}

function FrostedKiwi() {
  return (
    <GlassShell variant="shell-frosted">
      <span className="frosted-window"><span className="frosted-core" /><SeedRing /></span>
    </GlassShell>
  )
}

function PrismSeed() {
  return (
    <GlassShell variant="shell-prism">
      <svg className="prism-core" viewBox="0 0 150 180" aria-hidden="true">
        <path className="prism-face prism-a" d="m75 9 57 48-24 103-33 11Z" />
        <path className="prism-face prism-b" d="M75 9 18 61l24 99 33 11Z" />
        <path className="prism-face prism-c" d="m18 61 57 22 57-26-57-48Z" />
        <path className="prism-face prism-d" d="m42 160 33-77 33 77-33 11Z" />
      </svg>
    </GlassShell>
  )
}

function WhiteGlass() {
  return (
    <GlassShell variant="shell-white-glass">
      <span className="white-glass-light" />
      <svg className="white-glass-crack" viewBox="0 0 238 292" aria-hidden="true">
        <path d="M41 146 79 135l18 17 20-30 20 28 19-16 41 12" />
        <path className="white-glass-split" d="M41 146c10 36 38 61 78 61 41 0 68-25 78-61" />
      </svg>
    </GlassShell>
  )
}

const studies = [
  { id: 'A', title: 'Kiwi Specimen', subtitle: 'GLASS × KIWI WITHIN', note: '추천 · 키위 단면을 유리 안에 표본처럼 띄운 가장 직접적인 조합.', className: 'study-specimen', visual: <KiwiSpecimen /> },
  { id: 'B', title: 'Seed Halo', subtitle: 'MINIMAL ORGANIC', note: '과육은 빼고 씨앗의 궤도만 남겨 더 절제된 whitekiwi 심볼.', className: 'study-halo', visual: <SeedHalo /> },
  { id: 'C', title: 'Liquid Life', subtitle: 'SOFT BODY', note: '연두색 생명체가 유리 안에서 천천히 형태를 바꾸는 방향.', className: 'study-liquid', visual: <LiquidCore /> },
  { id: 'D', title: 'Before I Hatch', subtitle: 'STORY OBJECT', note: '껍질 너머로 키위새 실루엣이 먼저 보이는 서사 중심 시안.', className: 'study-embryo', visual: <KiwiEmbryo /> },
  { id: 'E', title: 'Frosted Kiwi', subtitle: 'QUIET PREMIUM', note: '반투명 껍질 아래쪽에만 키위의 색과 씨앗이 은은하게 비치는 버전.', className: 'study-frosted', visual: <FrostedKiwi /> },
  { id: 'F', title: 'Prism Seed', subtitle: 'DIGITAL GEM', note: '키위색 코어를 보석처럼 각지게 만들어 개발자 정체성을 강조.', className: 'study-prism', visual: <PrismSeed /> },
  { id: 'G', title: 'Milk Glass', subtitle: 'OPAQUE GLASS · NEW', note: '추천 · 내부는 완전히 숨기고, 깨지는 순간에만 키위색 빛이 새어 나오는 흰색 유리 알.', className: 'study-white', visual: <WhiteGlass /> },
]

export default function GlassLab() {
  return (
    <main className="glass-lab-page">
      <header className="glass-lab-header">
        <a href="/" className="glass-wordmark">whitekiwi®</a>
        <span>GLASS LIFE · MATERIAL STUDY</span>
        <a href="/?view=eggs">BACK TO ALL EGGS ↗</a>
      </header>

      <section className="glass-lab-intro">
        <p>SELECTED DIRECTION / 04</p>
        <h1>Glass outside.<br /><em>Kiwi inside.</em></h1>
        <p className="glass-intro-copy">유리의 차갑고 세련된 인상 안에 키위의 생명력을 얼마나 드러낼지 비교하고, 마지막에는 내부를 완전히 감춘 흰색 유리로 확장했습니다.</p>
      </section>

      <section className="glass-study-grid">
        {studies.map((study) => (
          <article className={`glass-study-card ${study.className}`} key={study.id}>
            <div className="glass-study-meta"><span>{study.id}</span><span>{study.subtitle}</span></div>
            <div className="glass-study-visual">{study.visual}</div>
            <div className="glass-study-copy"><h2>{study.title}</h2><p>{study.note}</p></div>
          </article>
        ))}
      </section>

      <footer className="glass-lab-footer">
        <span>NEXT STEP</span>
        <p>하나를 고르면 균열 → 내부 빛 → 키위새 등장까지 같은 재질 언어로 연결합니다.</p>
      </footer>
    </main>
  )
}
