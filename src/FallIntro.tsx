import { useEffect, useState } from 'react'
import './fall-intro.css'

function FallingEgg({ onLanded }: { onLanded: () => void }) {
  return (
    <div
      className="egg-scroll-rig"
      role="img"
      aria-label="유리 하늘에서 숲의 이끼밭으로 떨어지는 흰색 유리 알"
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

function MossLanding() {
  return (
    <svg className="moss-landing" viewBox="0 0 1200 360" preserveAspectRatio="none">
      <path className="moss-haze" d="M0 139c91-48 180-52 269-13 95-65 191-66 289-4 83-63 174-71 273-23 111-51 234-41 369 31v230H0Z" />
      <path className="moss-bank" d="M0 157c74-38 140-38 201 0 62-57 136-60 221-9 55-36 113-39 174-8 74-52 153-51 237 5 77-45 155-38 235 21 40-28 84-29 132-4v198H0Z" />
      <path className="moss-bank-light" d="M0 197c83-32 156-26 218 20 55-42 119-44 194-5 66-47 134-49 205-6 72-41 143-35 213 16 63-41 132-36 207 15 51-28 106-25 163 12v111H0Z" />

      <ellipse className="moss-impact-shadow" cx="600" cy="115" rx="88" ry="18" />
      <g className="moss-cushion">
        <path d="M447 139c24-49 63-66 114-51 33-38 76-39 111-3 49-12 86 7 105 55-97 39-207 38-330-1Z" />
        <path className="moss-cushion-light" d="M486 127c29-27 61-31 96-13 25-29 57-28 81 0 32-15 61-10 87 14-76 23-164 23-264-1Z" />
      </g>

      <g className="moss-tufts">
        <path d="M87 177c-2-28 8-48 30-60-5 23 0 41 16 54 0-26 11-43 33-54-8 24-6 45 8 63" />
        <path d="M319 157c-4-24 4-42 24-54-3 22 4 38 20 47 2-20 11-34 28-43-4 20 0 36 13 49" />
        <path d="M824 159c-4-27 5-47 26-61-3 24 3 42 20 54 3-22 13-38 32-48-5 23-1 41 13 54" />
        <path d="M1045 176c0-28 11-47 33-58-6 24-1 43 15 56 2-24 12-41 32-51-6 23-3 42 11 56" />
      </g>

      <g className="moss-speckles">
        <circle cx="223" cy="186" r="7" /><circle cx="256" cy="168" r="4" /><circle cx="418" cy="207" r="6" />
        <circle cx="790" cy="194" r="5" /><circle cx="947" cy="183" r="7" /><circle cx="980" cy="205" r="4" />
      </g>
      <ellipse className="moss-impact-ring" cx="600" cy="120" rx="72" ry="14" />
      <g className="moss-pop moss-pop-left"><circle cx="560" cy="108" r="7" /><circle cx="577" cy="101" r="4" /></g>
      <g className="moss-pop moss-pop-right"><circle cx="640" cy="106" r="6" /><circle cx="657" cy="99" r="3" /></g>
    </svg>
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

      <MossLanding />

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
