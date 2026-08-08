import { useEffect, useState } from 'react'

type JourneyStage = 'egg' | 'cracked' | 'hatched' | 'riding' | 'whiteblock'

function KiwiBird() {
  return (
    <svg className="kiwi-bird" viewBox="0 0 300 260" role="img" aria-label="귀여운 키위새">
      <ellipse className="bird-shadow" cx="137" cy="237" rx="87" ry="11" />
      <path className="bird-body" d="M42 174c0-67 39-117 98-117 54 0 91 36 91 91 0 57-40 91-99 91-52 0-90-22-90-65Z" />
      <path className="bird-belly" d="M80 181c10 34 39 51 78 49 29-2 49-13 61-34-14 9-30 13-51 13-37 0-66-12-88-28Z" />
      <path className="bird-tuft" d="M116 61c-4-20 6-35 22-47-1 15 7 24 19 31-2-15 5-25 18-33 2 20-2 38-16 53Z" />
      <path className="bird-wing" d="M69 138c16-31 47-46 78-37-20 19-30 47-25 78-26 0-45-14-53-41Z" />
      <circle className="bird-eye" cx="178" cy="91" r="12" />
      <circle className="bird-eye-glint" cx="182" cy="87" r="4" />
      <path className="bird-beak" d="M199 103c42-1 70 10 86 28-29 14-58 11-88-3l-17-10Z" />
      <circle className="bird-cheek" cx="204" cy="126" r="9" />
      <path className="bird-leg" d="M119 230v20m46-20v20" />
      <path className="bird-foot" d="m105 250 17 0m25 0 17 0" />
    </svg>
  )
}

function Bike() {
  return (
    <svg className="bike" viewBox="0 0 340 170" aria-hidden="true">
      <circle className="wheel" cx="65" cy="127" r="34" />
      <circle className="wheel" cx="274" cy="127" r="34" />
      <path className="bike-frame" d="M65 127 121 77l48 50m-48-50 42 0 41 50m-41-50 26-25m-26 25 19 50m22-50h44l26 50m-26-50 19-23" />
      <path className="bike-handle" d="m215 51 16-8 15 8m-15-8 2-17" />
      <path className="bike-seat" d="M105 76h31" />
      <rect className="delivery-box" x="174" y="31" width="62" height="45" rx="7" />
      <path className="box-mark" d="M191 46h28m-28 13h20" />
    </svg>
  )
}

type EggVariant = 'soft' | 'kiwi' | 'paper'

function Egg({ variant }: { variant: EggVariant }) {
  return (
    <svg className={`egg egg-${variant}`} viewBox="0 0 260 330" aria-hidden="true">
      <defs>
        <linearGradient id="egg-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff8e9" />
          <stop offset="0.65" stopColor="#f6e6c7" />
          <stop offset="1" stopColor="#e7c895" />
        </linearGradient>
      </defs>
      <path className="egg-shell" d={variant === 'paper' ? 'M130 14C67 11 31 83 29 163c-2 90 41 151 100 154 60 2 104-63 101-152-2-79-38-148-100-151Z' : 'M130 12C61 12 28 86 28 166c0 87 44 151 102 151s102-64 102-151C232 86 199 12 130 12Z'} />
      <path className="egg-crack egg-crack-top" d="M34 158l47-17 18 24 28-35 22 31 28-18 43 16" />
      <path className="egg-crack egg-crack-bottom" d="M34 158c12 34 40 63 96 63 52 0 84-23 98-62" />
      <path className="egg-highlight" d="M83 57c-22 27-31 59-32 89" />
      <circle className="egg-dot" cx="183" cy="91" r="5" />
      {variant === 'kiwi' && <><circle className="egg-speck" cx="77" cy="126" r="4" /><circle className="egg-speck" cx="176" cy="70" r="3" /><circle className="egg-speck" cx="188" cy="180" r="5" /><circle className="egg-speck" cx="91" cy="231" r="3" /><path className="egg-leaf" d="M202 239c18 9 22 24 19 38-15-4-23-16-19-38Z" /></>}
    </svg>
  )
}

function App() {
  const [stage, setStage] = useState<JourneyStage>('egg')
  const queryVariant = new URLSearchParams(window.location.search).get('egg')
  const eggVariant: EggVariant = queryVariant === 'kiwi' || queryVariant === 'paper' ? queryVariant : 'soft'

  useEffect(() => {
    const onScroll = () => {
      const progress = window.scrollY / Math.max(window.innerHeight, 1)
      if (progress > 2.65) setStage('whiteblock')
      else if (progress > 1.65) setStage('riding')
      else if (progress > 0.7) setStage('hatched')
      else if (progress > 0.16) setStage('cracked')
      else setStage('egg')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const stageIndex = { egg: 1, cracked: 1, hatched: 1, riding: 2, whiteblock: 2 }[stage]

  return (
    <main className={`portfolio stage-${stage}`}>
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="whitekiwi home">whitekiwi<span>®</span></a>
        <p>NODE.JS DEVELOPER</p>
        <p className="chapter">{String(stageIndex).padStart(2, '0')} / 06</p>
      </header>

      <section className="journey" aria-label="whitekiwi 포트폴리오 여정">
        <div className="grain" />
        <div className="sun" />
        <div className="copy copy-left">
          <p className="eyebrow">A PORTFOLIO JOURNEY</p>
          <h1>{stage === 'whiteblock' ? <>FIRST<br /><em>DELIVERY.</em></> : <>Born to<br /><em>build.</em></>}</h1>
        </div>

        <div className="world">
          <div className="cloud cloud-one" />
          <div className="cloud cloud-two" />
          <div className="mountain mountain-one" />
          <div className="mountain mountain-two" />
          <div className="road" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <Egg variant={eggVariant} />
          <KiwiBird />
          <div className="ride-wrap"><Bike /></div>
          <span className="spark spark-one">✳</span>
          <span className="spark spark-two">✦</span>
        </div>

        <div className="copy copy-right">
          {stage === 'egg' && <p>아직 아무 일도<br />일어나지 않은 아침.</p>}
          {stage === 'cracked' && <p>조금 기다려주세요.<br />곧 새로운 여정이 시작됩니다.</p>}
          {stage === 'hatched' && <p>안녕하세요.<br /><strong>whitekiwi</strong>가<br />태어났습니다.</p>}
          {stage === 'riding' && <p>첫 번째 목적지는<br /><strong>화이트블록</strong>입니다.</p>}
          {stage === 'whiteblock' && <p>첫 번째 여정<br /><strong>화이트블록</strong></p>}
          <span className="scroll-note">SCROLL TO TRAVEL <b>↓</b></span>
        </div>

        <div className="progress-rail" aria-hidden="true"><span /></div>
      </section>

      <section className="whiteblock-story">
        <div className="story-copy">
          <p className="eyebrow">01 / WHITEBLOCK · 2020</p>
          <h2>작은 배달에서<br /><em>시작했습니다.</em></h2>
          <p className="intro">테이크아웃 주문 앱 테이킷에 배달 기능을 런칭했습니다. 키위새의 첫 번째 일은, 누군가의 주문을 안전하게 목적지까지 전달하는 일이었습니다.</p>
          <div className="story-tags"><span>BACKEND DEVELOPER</span><span>DELIVERY</span><span>TAKEIT</span></div>
        </div>
        <div className="story-card"><span>WHITEBLOCK</span><strong>TAKEIT</strong><small>DELIVERY FEATURE LAUNCH</small><div className="card-route"><i />— — — — — <b>●</b></div></div>
        <div className="next-marker">NEXT / FETCHING</div>
      </section>
    </main>
  )
}

export default App
