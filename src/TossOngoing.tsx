import { useEffect, useRef, type CSSProperties } from 'react'
import './toss-ongoing.css'

type TossOngoingStyle = CSSProperties & {
  '--toss-progress': number
  '--toss-copy-opacity': number
  '--toss-copy-y': string
  '--toss-card-opacity': number
  '--toss-card-y': string
  '--toss-exit': number
  '--toss-entry-y': string
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
const reveal = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start))
const smoothstep = (value: number) => value * value * (3 - 2 * value)

export default function TossOngoing({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active) return
    let animationFrame = 0

    const update = () => {
      animationFrame = 0
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) return

      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / distance)
      const copyIn = smoothstep(reveal(progress, .04, .18))
      const cardIn = smoothstep(reveal(progress, .12, .3))
      const exit = smoothstep(reveal(progress, .76, .94))
      const entry = smoothstep(reveal(progress, .015, .14))

      track.style.setProperty('--toss-progress', String(progress))
      track.style.setProperty('--toss-copy-opacity', String(Math.min(copyIn, 1 - exit)))
      track.style.setProperty('--toss-copy-y', `${(1 - copyIn) * 46 - exit * 28}px`)
      track.style.setProperty('--toss-card-opacity', String(Math.min(cardIn, 1 - exit * .72)))
      track.style.setProperty('--toss-card-y', `${(1 - cardIn) * 54 - exit * 18}px`)
      track.style.setProperty('--toss-exit', String(exit))
      track.style.setProperty('--toss-entry-y', `${entry * -118}%`)
    }

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [active])

  return (
    <section
      className="toss-ongoing-track"
      ref={trackRef}
      aria-label="토스와 토스인컴에서 이어지고 있는 현재 경력"
      style={{
        '--toss-progress': 0,
        '--toss-copy-opacity': 0,
        '--toss-copy-y': '46px',
        '--toss-card-opacity': 0,
        '--toss-card-y': '54px',
        '--toss-exit': 0,
        '--toss-entry-y': '0%',
      } as TossOngoingStyle}
    >
      <div className="toss-ongoing-stage">
        <div className="toss-entry-curtain" aria-hidden="true"><i /><span /></div>
        <div className="toss-ambient" aria-hidden="true">
          <i className="toss-orbit toss-orbit-one" />
          <i className="toss-orbit toss-orbit-two" />
          <i className="toss-blue-object" />
        </div>

        <header className="toss-ongoing-meta">
          <span>VIVA REPUBLICA → TOSS INCOME</span>
          <span>2021.11 — NOW</span>
          <strong><i aria-hidden="true" />07</strong>
        </header>

        <div className="toss-ongoing-word" aria-hidden="true">ONGOING</div>

        <article className="toss-ongoing-copy">
          <span>NODE.JS DEVELOPER · CURRENT CHAPTER</span>
          <h2><i>계속,</i><strong>만드는 중입니다.</strong></h2>
          <p>토스에서 시작해 토스인컴으로.<br />다음 이야기는 아직 현재진행형입니다.</p>
        </article>

        <aside className="toss-status-card" aria-label="경력 챕터 작성 상태">
          <header>
            <span>CURRENT STATUS</span>
            <strong><i aria-hidden="true" /> IN PROGRESS</strong>
          </header>
          <dl>
            <div><dt>CAREER</dt><dd>ACTIVE</dd></div>
            <div><dt>STORY</dt><dd>LOADING</dd></div>
            <div><dt>UPDATED</dt><dd>NOW</dd></div>
          </dl>
          <div className="toss-loading" aria-hidden="true"><i /></div>
          <footer><span>2021.11</span><b>NO FINISH LINE</b><span>NOW</span></footer>
        </aside>

        <div className="toss-ongoing-exit">
          <span>THE STORY CONTINUES</span>
          <i aria-hidden="true" />
          <small>SCROLL TO CONTACT</small>
        </div>
      </div>
    </section>
  )
}
