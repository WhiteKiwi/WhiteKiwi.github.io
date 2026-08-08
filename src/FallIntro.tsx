import { useEffect, useRef } from 'react'
import './fall-intro.css'

function FallingEgg() {
  return (
    <div className="egg-scroll-rig" role="img" aria-label="유리 하늘에서 숲의 나뭇잎으로 떨어지는 흰색 유리 알">
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
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    let frame = 0
    const clamp = (value: number) => Math.min(1, Math.max(0, value))
    const range = (from: number, to: number, value: number) => {
      const point = clamp((value - from) / (to - from))
      return point * point * (3 - 2 * point)
    }
    const update = () => {
      frame = 0
      const bounds = root.getBoundingClientRect()
      const travel = Math.max(root.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-bounds.top / travel)
      const zoom = range(0.02, 0.42, progress)
      const forest = range(0.12, 0.68, progress)
      const descent = range(0.26, 0.94, progress)
      const caught = range(0.84, 1, progress)

      root.style.setProperty('--scroll', progress.toFixed(4))
      root.style.setProperty('--zoom', zoom.toFixed(4))
      root.style.setProperty('--forest', forest.toFixed(4))
      root.style.setProperty('--descent', descent.toFixed(4))
      root.style.setProperty('--caught', caught.toFixed(4))
      root.style.setProperty('--airborne', (1 - caught).toFixed(4))
      root.style.setProperty('--egg-x', `${(descent * 18).toFixed(3)}vw`)
      root.style.setProperty('--egg-y', `${(descent * 14).toFixed(3)}vh`)
      root.style.setProperty('--egg-scale', (1 - zoom * 0.54).toFixed(4))
      root.style.setProperty('--forest-y', `${((1 - forest) * 38).toFixed(2)}vh`)
      root.style.setProperty('--sky-opacity', (1 - forest * 0.88).toFixed(4))
      root.style.setProperty('--leaf-bend', `${(-2 - caught * 8).toFixed(2)}deg`)
      root.style.setProperty('--flight-up', `${(-10 * (1 - caught)).toFixed(2)}px`)
      root.style.setProperty('--flight-down', `${(12 * (1 - caught)).toFixed(2)}px`)
      root.style.setProperty('--tumble-left', `${(-5 * (1 - caught)).toFixed(2)}deg`)
      root.style.setProperty('--tumble-right', `${(4 * (1 - caught)).toFixed(2)}deg`)
      root.style.setProperty('--wake-opacity', (0.52 * (1 - caught)).toFixed(4))
      root.style.setProperty('--air-pulse-opacity', (0.55 * (1 - caught)).toFixed(4))
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="fall-intro-scroll" ref={scrollRef}>
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
        <FallingEgg />
        <div className="fall-vignette" aria-hidden="true" />
      </section>
    </main>
  )
}
