import { useEffect, useState } from 'react'
import './fall-intro.css'

function FallingEgg({ onLanded }: { onLanded: () => void }) {
  return (
    <div
      className="egg-scroll-rig"
      role="img"
      aria-label="유리 하늘에서 숲의 나뭇잎으로 떨어지는 흰색 유리 알"
      onAnimationEnd={(event) => {
        if (event.animationName === 'egg-camera-arrival') onLanded()
      }}
    >
      <div className="falling-egg-rig">
        <div className="egg-wake" aria-hidden="true"><i /><i /><i /></div>
        <div className="falling-egg">
          <span className="falling-shell" />
          <span className="falling-shell-glint" />
          <span className="falling-shell-rim" />
        </div>
        <span className="air-ring air-ring-one" />
        <span className="air-ring air-ring-two" />
      </div>
    </div>
  )
}

function ForestArrival() {
  return (
    <div className="forest-arrival" aria-hidden="true">
      <div className="forest-sky-wash" />
      <div className="distant-canopy canopy-back"><i /><i /><i /><i /><i /></div>
      <div className="distant-canopy canopy-front"><i /><i /><i /><i /><i /><i /></div>

      <div className="leaf-stream">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </div>

      <svg className="catch-perch" viewBox="0 0 800 420" preserveAspectRatio="none">
        <path className="perch-branch-shadow" d="M825 335C713 321 642 296 565 255c-55-30-102-42-158-43" />
        <path className="perch-branch" d="M825 322C711 309 646 287 567 247c-58-30-105-40-163-37" />
        <path className="branch-twig" d="M650 281c-13-41-5-76 24-111M735 310c18-29 42-47 75-53" />
        <g className="catch-leaf">
          <path className="catch-leaf-shadow" d="M405 205c55-74 132-89 220-49-34 83-103 121-207 76Z" />
          <path className="catch-leaf-body" d="M402 195c58-70 134-82 219-40-39 76-108 108-211 67Z" />
          <path className="catch-leaf-vein" d="M418 214c58-28 111-45 181-54M487 195l-9-28M532 180l12-25M566 170l21 14" />
        </g>
        <path className="side-leaf leaf-one" d="M646 274c-25-43-20-80 18-111 31 48 25 85-18 111Z" />
        <path className="side-leaf leaf-two" d="M733 306c22-38 52-54 92-46-15 43-46 59-92 46Z" />
      </svg>

      <div className="foreground-canopy canopy-left"><i /><i /><i /><i /></div>
      <div className="foreground-canopy canopy-right"><i /><i /><i /><i /><i /></div>
    </div>
  )
}

const clouds = [
  ['cloud-a', 'cloud-near'], ['cloud-b', 'cloud-far'], ['cloud-c', 'cloud-mid'],
  ['cloud-d', 'cloud-near'], ['cloud-e', 'cloud-far'], ['cloud-f', 'cloud-mid'],
]

export default function FallIntro() {
  const [phase, setPhase] = useState<'idle' | 'descending' | 'landed'>('idle')

  useEffect(() => {
    if (phase !== 'idle') return

    let touchY = 0
    const beginDescent = () => setPhase((current) => current === 'idle' ? 'descending' : current)
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 4) beginDescent()
    }
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchY
      if (touchY - currentY > 8) beginDescent()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(event.key)) beginDescent()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [phase])

  return (
    <main className={`fall-intro-scroll ${phase !== 'idle' ? 'has-descended' : ''} ${phase === 'landed' ? 'is-landed' : ''}`}>
      <section className="fall-intro">
        <div className="sky-depth sky-depth-back" aria-hidden="true" />
        <div className="sky-depth sky-depth-front" aria-hidden="true" />
        <div className="sky-sun" aria-hidden="true" />
        <div className="sky-caustic caustic-one" aria-hidden="true" />
        <div className="sky-caustic caustic-two" aria-hidden="true" />

        <div className="fall-streaks streaks-far" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
        <div className="fall-streaks streaks-near" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </div>
        <div className="fall-particles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
        <div className="foreground-rush" aria-hidden="true">
          <span className="rush-one" /><span className="rush-two" /><span className="rush-three" />
        </div>

        <div className="glass-cloud-field" aria-hidden="true">
          {clouds.map(([name, depth]) => (
            <div className={`glass-cloud ${name} ${depth}`} key={name}>
              <span /><i /><b />
            </div>
          ))}
        </div>

        <ForestArrival />
        <FallingEgg onLanded={() => setPhase('landed')} />
        <div className="fall-vignette" aria-hidden="true" />
      </section>
    </main>
  )
}
