import { useEffect, useState } from 'react'
import './fall-intro.css'

function FallingEgg({ onLanded }: { onLanded: () => void }) {
  return (
    <div
      className="egg-scroll-rig"
      role="img"
      aria-label="유리 하늘에서 유리 지면으로 떨어져 금이 가는 흰색 유리 알"
      onAnimationEnd={(event) => {
        if (event.animationName === 'egg-camera-arrival') onLanded()
      }}
    >
      <div className="falling-egg-rig">
        <div className="egg-wake" aria-hidden="true"><i /><i /><i /></div>
        <div className="falling-egg">
          <div className="hatching-bird" aria-hidden="true">
            <img src="/assets/characters/kiwi-baby-brown.png" alt="" />
          </div>
          <span className="falling-shell" />
          <span className="falling-shell-glint" />
          <span className="falling-shell-rim" />
          <svg className="shell-cracks" viewBox="0 0 260 330" aria-hidden="true">
            <path className="shell-crack shell-crack-main" d="m106 265 23-23-11-23 25-21-11-22 19-22" />
            <path className="shell-crack shell-crack-left" d="m120 222-23-8-14-20M134 181l-24-10-7-20" />
            <path className="shell-crack shell-crack-right" d="m136 204 24-11 12-23M146 160l21-14" />
          </svg>
          <span className="hatch-shell-cup" />
          <span className="hatch-shell-lid" />
          <span className="hatch-chip" />
        </div>
        <span className="air-ring air-ring-one" />
        <span className="air-ring air-ring-two" />
      </div>
    </div>
  )
}

function GlassGround() {
  return (
    <div className="glass-ground" aria-hidden="true">
      <div className="glass-ridges glass-ridges-back">
        <i /><i /><i /><i />
      </div>
      <div className="glass-ground-plane">
        <span className="ground-caustic caustic-left" />
        <span className="ground-caustic caustic-right" />
      </div>
      <svg className="ground-impact-site" viewBox="0 0 600 180">
        <ellipse className="ground-contact-shadow" cx="300" cy="92" rx="66" ry="13" />
        <ellipse className="ground-impact-ring ring-inner" cx="300" cy="92" rx="74" ry="18" />
        <ellipse className="ground-impact-ring ring-outer" cx="300" cy="92" rx="112" ry="30" />
        <g className="ground-fractures">
          <path d="m245 95-42 20-29-3-25 13M355 96l45 18 27-7 31 14M274 104l-19 34-24 15M327 104l17 34 28 17" />
        </g>
        <g className="ground-shards shard-left"><path d="m259 88-18-34 30 18Z" /><path d="m232 91-25-20 30 5Z" /></g>
        <g className="ground-shards shard-right"><path d="m341 88 18-34-30 18Z" /><path d="m368 91 25-20-30 5Z" /></g>
      </svg>
    </div>
  )
}

const clouds = [
  ['cloud-a', 'cloud-near'], ['cloud-b', 'cloud-far'], ['cloud-c', 'cloud-mid'],
  ['cloud-d', 'cloud-near'], ['cloud-e', 'cloud-far'], ['cloud-f', 'cloud-mid'],
]

export default function FallIntro() {
  const [phase, setPhase] = useState<'idle' | 'descending' | 'landed' | 'hatched'>('idle')

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

  useEffect(() => {
    if (phase !== 'landed') return
    const hatchTimer = window.setTimeout(() => setPhase('hatched'), 2650)
    return () => window.clearTimeout(hatchTimer)
  }, [phase])

  const hasLanded = phase === 'landed' || phase === 'hatched'

  return (
    <main className={`fall-intro-scroll ${phase !== 'idle' ? 'has-descended' : ''} ${hasLanded ? 'is-landed' : ''} ${phase === 'hatched' ? 'is-hatched' : ''}`}>
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

        <GlassGround />
        <FallingEgg onLanded={() => setPhase('landed')} />
        <div className="fall-vignette" aria-hidden="true" />
      </section>
    </main>
  )
}
