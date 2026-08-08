import { useEffect, useState } from 'react'

function KiwiBird() {
  return (
    <svg className="kiwi-bird" viewBox="0 0 280 240" role="img" aria-label="알에서 깨어난 키위새">
      <ellipse className="bird-shadow" cx="135" cy="218" rx="82" ry="10" />
      <path className="bird-body" d="M56 164c-1-63 38-108 91-108 46 0 77 31 77 77 0 55-38 87-89 87-45 0-78-18-79-56Z" />
      <path className="bird-wing" d="M87 130c12-31 42-49 71-40-16 20-25 48-20 79-27 0-46-14-51-39Z" />
      <circle className="bird-eye" cx="169" cy="82" r="8" />
      <path className="bird-beak" d="M191 91c36 0 61 10 72 27-24 9-47 7-71-4l-17-8Z" />
      <path className="bird-leg" d="M128 210v19m38-19v19" />
      <path className="bird-foot" d="m116 229 14 0m24 0 14 0" />
    </svg>
  )
}

function Egg() {
  return (
    <svg className="egg" viewBox="0 0 260 330" aria-hidden="true">
      <defs>
        <linearGradient id="egg-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f7f1df" />
          <stop offset="0.6" stopColor="#e9ddc4" />
          <stop offset="1" stopColor="#cbbd9f" />
        </linearGradient>
      </defs>
      <path className="egg-shell" d="M130 12C61 12 28 86 28 166c0 87 44 151 102 151s102-64 102-151C232 86 199 12 130 12Z" />
      <path className="egg-crack" d="M34 158l47-17 18 24 28-35 22 31 28-18 43 16" />
      <path className="egg-highlight" d="M83 57c-22 27-31 59-32 89" />
    </svg>
  )
}

function App() {
  const [hatched, setHatched] = useState(false)

  useEffect(() => {
    const onScroll = () => setHatched(window.scrollY > 28)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className={`portfolio ${hatched ? 'is-hatched' : ''}`}>
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="whitekiwi home">whitekiwi<span>®</span></a>
        <p>NODE.JS DEVELOPER</p>
        <p className="chapter">01 / 06</p>
      </header>

      <section className="hatch-scene" aria-label="whitekiwi 포트폴리오 시작">
        <div className="grain" />
        <div className="copy copy-left">
          <p className="eyebrow">A PORTFOLIO JOURNEY</p>
          <h1>Born to<br /><em>build.</em></h1>
        </div>

        <div className="egg-stage">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <Egg />
          <KiwiBird />
          <span className="spark spark-one">✳</span>
          <span className="spark spark-two">·</span>
        </div>

        <div className="copy copy-right">
          <p>알에서 시작해<br />문제를 만나고,<br />세계를 만들어갑니다.</p>
          <span className="scroll-note">SCROLL TO HATCH <b>↓</b></span>
        </div>
      </section>

      <section className="after-hatch" aria-hidden={!hatched}>
        <p className="eyebrow">THE JOURNEY BEGINS</p>
        <h2>안녕하세요,<br /><em>whitekiwi</em>입니다.</h2>
        <p className="intro">복잡한 문제를 단순하게 만들고<br />서비스가 오래 달릴 수 있는 기반을 만듭니다.</p>
        <div className="next-marker">NEXT / FETCHING</div>
      </section>
    </main>
  )
}

export default App
