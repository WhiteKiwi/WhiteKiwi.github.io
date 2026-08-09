import { useEffect, useRef, useState, type RefObject } from 'react'
import EducationJourney from './EducationJourney'
import CareerJourney from './CareerJourney'
import TossOngoing from './TossOngoing'
import ContactFinale from './ContactFinale'
import './fall-intro.css'

type JourneyPhase = 'opening' | 'idle' | 'descending' | 'landed' | 'ready'

const chapterDeepLinks: Record<string, { selector: string; progress: number }> = {
  '#01': { selector: '.walking-intro-track', progress: .16 },
  '#01-intro': { selector: '.walking-intro-track', progress: .16 },
  '#02': { selector: '.education-track', progress: .22 },
  '#02-education': { selector: '.education-track', progress: .22 },
  '#03': { selector: '.career-whiteblock', progress: .18 },
  '#03-whiteblock': { selector: '.career-whiteblock', progress: .18 },
  '#04': { selector: '.career-fetching', progress: .18 },
  '#04-fetching': { selector: '.career-fetching', progress: .18 },
  '#05': { selector: '.career-aimpact', progress: .18 },
  '#05-aimpact': { selector: '.career-aimpact', progress: .18 },
  '#06': { selector: '.career-daangn', progress: .18 },
  '#06-daangn': { selector: '.career-daangn', progress: .18 },
  '#07': { selector: '.toss-ongoing-track', progress: .24 },
  '#07-toss': { selector: '.toss-ongoing-track', progress: .24 },
  '#07-ongoing': { selector: '.toss-ongoing-track', progress: .24 },
  '#contact': { selector: '.contact-finale-track', progress: .22 },
}

const prologueHashes = new Set(['#00', '#00-prologue'])
const getCurrentHash = () => window.location.hash.toLowerCase()
const getChapterDeepLink = () => chapterDeepLinks[window.location.hash.toLowerCase()]
const getRootLocation = () => `${window.location.pathname}${window.location.search}`

const normalizeInitialPrologueHash = () => {
  if (!prologueHashes.has(getCurrentHash())) return false
  window.history.replaceState(window.history.state, '', getRootLocation())
  return true
}

function OpeningTitle() {
  return (
    <div className="opening-title" aria-label="Hello, world. whitekiwi의 포트폴리오가 시작됩니다">
      <span className="opening-status">INITIALIZING A NEW JOURNEY</span>
      <svg className="opening-lettering" viewBox="0 0 1000 300" aria-hidden="true">
        <text className="opening-stroke opening-stroke-left" x="470" y="185" textAnchor="end">Hello, w</text>
        <ellipse className="opening-world-o" cx="510" cy="145" rx="27" ry="38" />
        <text className="opening-stroke opening-stroke-right" x="550" y="185">rld</text>
      </svg>
      <span className="opening-signature">A PORTFOLIO BY WHITEKIWI · 2026</span>
    </div>
  )
}

function FallingEgg({
  action,
  onDescend,
  onContinue,
  onLanded,
}: {
  action: 'descend' | 'continue' | null
  onDescend: () => void
  onContinue: () => void
  onLanded: () => void
}) {
  const interactive = action !== null
  return (
    <button
      className="egg-scroll-rig"
      type="button"
      aria-hidden={!interactive}
      aria-label={action === 'descend' ? '알을 착지시키기' : action === 'continue' ? '01 소개 장면으로 이동' : undefined}
      disabled={!interactive}
      onClick={action === 'descend' ? onDescend : onContinue}
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
          <svg className="shell-cracks" viewBox="0 0 260 330" aria-hidden="true">
            <path className="shell-crack shell-crack-main" d="m130 8 10 18-13 17 15 22-12 18 14 23-10 20" />
            <path className="shell-crack shell-crack-left" d="m128 42-20-8-14-14m37 62-23-7-12-15" />
            <path className="shell-crack shell-crack-right" d="m139 27 17-8 8-11m-23 57 21-13 11-15m-30 69 17-10 10-16" />
          </svg>
        </div>
        <span className="air-ring air-ring-one" />
        <span className="air-ring air-ring-two" />
      </div>
      {action === 'continue' && <span className="egg-continue-cue">CLICK TO CONTINUE</span>}
    </button>
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

function WalkingIntroduction({
  trackRef,
  showScrollCue,
}: {
  trackRef: RefObject<HTMLElement | null>
  showScrollCue: boolean
}) {
  const contactLinks = [
    { label: 'GitHub', href: 'https://github.com/whitekiwi' },
    { label: 'Blog', href: 'https://blog.whitekiwi.link' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/whitekiwi/' },
    { label: 'Instagram', href: 'https://www.instagram.com/whitekiwi_' },
  ]

  return (
    <section className="walking-intro-track" ref={trackRef} aria-label="장지훈 개발자 소개">
      <div className="walking-intro">
        <div className="intro-paper-sky" aria-hidden="true">
          <span className="intro-sun" />
          <span className="intro-cloud intro-cloud-one" />
          <span className="intro-cloud intro-cloud-two" />
        </div>
        <div className="intro-landscape" aria-hidden="true">
          <span className="intro-hill intro-hill-back" />
          <span className="intro-hill intro-hill-front" />
          <span className="intro-ground-line" />
        </div>

        <div className="intro-copy">
          <p className="intro-line intro-hello">안녕하세요</p>
          <p className="intro-line intro-role"><strong>Node.js</strong>{' '}Developer</p>
          <p className="intro-line intro-name">장지훈입니다</p>
        </div>

        <div className="kiwi-walk-path" aria-hidden="true">
          <div className="kiwi-walk-shadow" />
          <div className="kiwi-walk-sprite">
            <img src="/assets/characters/kiwi-walk-cycle.png" alt="" />
          </div>
        </div>

        <div className={`intro-scroll-cue ${showScrollCue ? 'is-visible' : ''}`} aria-hidden={!showScrollCue}>
          <span>SCROLL TO BEGIN</span>
          <i><b /></i>
          <small>아래로 스크롤해 여정을 이어가세요</small>
        </div>

        <nav className="intro-contact" aria-label="연락처와 외부 링크">
          <div className="intro-contact-primary">
            <span>CONTACT</span>
            <a href="mailto:jh145478@gmail.com">jh145478@gmail.com</a>
          </div>
          <div className="intro-contact-links">
            {contactLinks.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                {link.label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </section>
  )
}

const clouds = [
  ['cloud-a', 'cloud-near'], ['cloud-b', 'cloud-far'], ['cloud-c', 'cloud-mid'],
  ['cloud-d', 'cloud-near'], ['cloud-e', 'cloud-far'], ['cloud-f', 'cloud-mid'],
]

export default function FallIntro() {
  const [phase, setPhase] = useState<JourneyPhase>(() => {
    if (normalizeInitialPrologueHash()) return 'opening'
    return getChapterDeepLink() ? 'ready' : 'opening'
  })
  const [showIntroScrollCue, setShowIntroScrollCue] = useState(false)
  const introTrackRef = useRef<HTMLElement>(null)
  const introCueTimerRef = useRef<number | null>(null)
  const introCueEligibleRef = useRef(false)
  const introCueVisibleRef = useRef(false)
  const introCueConsumedRef = useRef(false)
  const beginDescent = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setPhase((current) => current === 'idle' ? (reducedMotion ? 'landed' : 'descending') : current)
  }

  useEffect(() => {
    if (phase !== 'opening') return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const openingTimer = window.setTimeout(() => setPhase('idle'), reducedMotion ? 220 : 4800)
    return () => window.clearTimeout(openingTimer)
  }, [phase])

  const isScrollLocked = phase !== 'ready'
  useEffect(() => {
    if (!isScrollLocked) return
    const html = document.documentElement
    const body = document.body
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyBackground: body.style.background,
    }
    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'
    body.style.background = '#8ec4eb'
    return () => {
      html.style.overflow = previous.htmlOverflow
      html.style.overscrollBehavior = previous.htmlOverscroll
      body.style.overflow = previous.bodyOverflow
      body.style.overscrollBehavior = previous.bodyOverscroll
      body.style.background = previous.bodyBackground
    }
  }, [isScrollLocked])

  useEffect(() => {
    let firstFrame = 0
    let secondFrame = 0

    const moveToChapter = () => {
      if (prologueHashes.has(getCurrentHash())) {
        window.location.replace(getRootLocation())
        return
      }
      const deepLink = getChapterDeepLink()
      if (!deepLink) return
      if (phase !== 'ready') {
        setPhase('ready')
        return
      }

      if (firstFrame) window.cancelAnimationFrame(firstFrame)
      if (secondFrame) window.cancelAnimationFrame(secondFrame)
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(deepLink.selector)
          if (!target) return
          const targetTop = window.scrollY + target.getBoundingClientRect().top
          const distance = Math.max(target.offsetHeight - window.innerHeight, 0)
          window.scrollTo({ top: targetTop + distance * deepLink.progress, behavior: 'auto' })
        })
      })
    }

    moveToChapter()
    window.addEventListener('hashchange', moveToChapter)
    return () => {
      if (firstFrame) window.cancelAnimationFrame(firstFrame)
      if (secondFrame) window.cancelAnimationFrame(secondFrame)
      window.removeEventListener('hashchange', moveToChapter)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'idle') return

    let touchY = 0
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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const readyTimer = window.setTimeout(() => setPhase('ready'), reducedMotion ? 80 : 2350)
    return () => window.clearTimeout(readyTimer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return
    const track = introTrackRef.current
    if (!track) return

    let animationFrame = 0
    const updateProgress = () => {
      animationFrame = 0
      const rect = track.getBoundingClientRect()
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1)
      const frame = Math.floor(progress * 32) % 4
      const step = Math.floor(progress * 32)
      const reveal = (start: number, end: number) => Math.min(Math.max((progress - start) / (end - start), 0), 1)
      const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
      const isMobile = window.innerWidth <= 700
      const centerY = isMobile ? 36 : 40
      const targetScales = isMobile
        ? { hello: .32, role: .44, name: .32 }
        : { hello: .34, role: .31, name: .32 }
      const lineWidths = {
        hello: (track.querySelector<HTMLElement>('.intro-hello')?.offsetWidth ?? 0) * targetScales.hello,
        role: (track.querySelector<HTMLElement>('.intro-role')?.offsetWidth ?? 0) * targetScales.role,
        name: (track.querySelector<HTMLElement>('.intro-name')?.offsetWidth ?? 0) * targetScales.name,
      }
      const leftEdge = window.innerWidth * (isMobile ? .06 : .065)
      const toVw = (pixels: number) => pixels / window.innerWidth * 100
      const desktopGap = Math.max(34, window.innerWidth * .032)
      const lineTargets = isMobile
        ? {
            hello: { x: toVw(leftEdge + lineWidths.hello / 2), y: 11.5, scale: targetScales.hello },
            role: { x: toVw(leftEdge + lineWidths.role / 2), y: 15.5, scale: targetScales.role },
            name: { x: toVw(leftEdge + lineWidths.name / 2), y: 19.5, scale: targetScales.name },
          }
        : {
            hello: { x: toVw(leftEdge + lineWidths.hello / 2), y: 14, scale: targetScales.hello },
            role: { x: toVw(leftEdge + lineWidths.hello + desktopGap + lineWidths.role / 2), y: 14, scale: targetScales.role },
            name: { x: toVw(leftEdge + lineWidths.hello + desktopGap + lineWidths.role + desktopGap + lineWidths.name / 2), y: 14, scale: targetScales.name },
          }
      const setLineState = (
        name: 'hello' | 'role' | 'name',
        revealStart: number,
        revealEnd: number,
        settleStart: number,
        settleEnd: number,
      ) => {
        const opacity = reveal(revealStart, revealEnd)
        const settled = reveal(settleStart, settleEnd)
        const target = lineTargets[name]
        const entryScale = lerp(.82, 1, opacity)
        const entryY = centerY + (1 - opacity) * 5
        track.style.setProperty(`--${name}-opacity`, String(opacity))
        track.style.setProperty(`--${name}-x`, `${lerp(50, target.x, settled)}vw`)
        track.style.setProperty(`--${name}-y`, `${lerp(entryY, target.y, settled)}vh`)
        track.style.setProperty(`--${name}-scale`, String(lerp(entryScale, target.scale, settled)))
        track.style.setProperty(`--${name}-blur`, `${(1 - opacity) * 12}px`)
      }

      track.style.setProperty('--intro-progress', String(progress))
      track.style.setProperty('--identity-progress', String(reveal(.12, .77)))
      const contactReveal = reveal(.6, .74)
      track.style.setProperty('--contact-reveal', String(contactReveal))
      track.style.setProperty('--contact-y', `${(1 - contactReveal) * 28}px`)
      track.style.setProperty('--kiwi-x', `${-18 + progress * 136}vw`)
      track.style.setProperty('--kiwi-frame', `${frame * -25}%`)
      track.style.setProperty('--kiwi-bob', `${step % 2 === 0 ? 0 : -5}px`)
      track.style.setProperty('--kiwi-tilt', `${step % 2 === 0 ? -0.35 : 0.35}deg`)
      track.style.setProperty('--sun-shift', `${progress * 22}px`)
      track.style.setProperty('--sun-rotate', `${progress * 24}deg`)
      track.style.setProperty('--cloud-near-shift', `${progress * -9}vw`)
      track.style.setProperty('--cloud-far-shift', `${progress * 7}vw`)
      track.style.setProperty('--hill-shift', `${progress * -3}vw`)
      track.style.setProperty('--hill-shift-opposite', `${progress * 3}vw`)
      setLineState('hello', .04, .11, .15, .25)
      setLineState('role', .27, .34, .39, .5)
      setLineState('name', .52, .59, .64, .75)
      track.style.setProperty('--world-shift', `${progress * -18}px`)
    }
    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return

    let touchY = 0
    const dismissScrollCue = () => {
      if (!introCueEligibleRef.current && !introCueVisibleRef.current) return
      introCueEligibleRef.current = false
      introCueVisibleRef.current = false
      introCueConsumedRef.current = true
      if (introCueTimerRef.current !== null) {
        window.clearTimeout(introCueTimerRef.current)
        introCueTimerRef.current = null
      }
      setShowIntroScrollCue(false)
    }
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 2) dismissScrollCue()
    }
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? touchY
      if (Math.abs(currentY - touchY) > 6) dismissScrollCue()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest('button, a, input, textarea, select')) return
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) dismissScrollCue()
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

  useEffect(() => () => {
    if (introCueTimerRef.current !== null) window.clearTimeout(introCueTimerRef.current)
  }, [])

  const hasDescended = phase === 'descending' || phase === 'landed' || phase === 'ready'
  const hasLanded = phase === 'landed' || phase === 'ready'
  const goToIntroduction = () => {
    if (!introCueConsumedRef.current) {
      introCueEligibleRef.current = true
      if (introCueTimerRef.current !== null) window.clearTimeout(introCueTimerRef.current)
      introCueTimerRef.current = window.setTimeout(() => {
        introCueTimerRef.current = null
        if (!introCueEligibleRef.current) return
        introCueVisibleRef.current = true
        introCueConsumedRef.current = true
        setShowIntroScrollCue(true)
      }, 2000)
    }
    introTrackRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <main className={`fall-intro-scroll ${phase === 'opening' ? 'is-opening' : ''} ${phase === 'idle' ? 'is-idle' : ''} ${hasDescended ? 'has-descended' : ''} ${hasLanded ? 'is-landed' : ''} ${phase === 'ready' ? 'is-scroll-ready' : ''}`}>
      <section className="fall-intro">
        {phase === 'opening' && <OpeningTitle />}
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
        <FallingEgg
          action={phase === 'idle' ? 'descend' : phase === 'ready' ? 'continue' : null}
          onDescend={beginDescent}
          onContinue={goToIntroduction}
          onLanded={() => setPhase('landed')}
        />
        <div className="fall-vignette" aria-hidden="true" />
      </section>
      <WalkingIntroduction trackRef={introTrackRef} showScrollCue={showIntroScrollCue} />
      <EducationJourney active={phase === 'ready'} />
      <CareerJourney active={phase === 'ready'} />
      <TossOngoing active={phase === 'ready'} />
      <ContactFinale active={phase === 'ready'} />
    </main>
  )
}
