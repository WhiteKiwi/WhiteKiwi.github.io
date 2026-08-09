import { useEffect, useRef, type CSSProperties } from 'react'
import './education-journey.css'

const projects = [
  '충남삼성고등학교 대나무숲',
  '신입생들을 위한 가이드 페이지',
  '학교 축제 좌석 티켓팅 사이트',
  '학생회 홈페이지',
  '면학실 자리 신청 사이트',
]

const petalCount = 34

type PetalStyle = CSSProperties & {
  '--petal-left': string
  '--petal-duration': string
  '--petal-delay': string
  '--petal-drift-mid': string
  '--petal-drift': string
  '--petal-turn-mid': string
  '--petal-turn': string
  '--petal-scale': string
  '--petal-opacity': string
}

const petalStyles: PetalStyle[] = Array.from({ length: petalCount }, (_, index) => {
  const depth = index % 3
  const direction = index % 4 === 0 ? -1 : 1
  const drift = direction * (10 + (index % 7) * 3.2)
  const turn = 340 + depth * 190 + (index % 5) * 47

  return {
    '--petal-left': `${((index * 37) % 116) - 8}%`,
    '--petal-duration': `${8.4 + depth * 2.1 + (index % 6) * .63}s`,
    '--petal-delay': `${-((index * 1.73) % 13.8)}s`,
    '--petal-drift-mid': `${drift * -.24}vw`,
    '--petal-drift': `${drift}vw`,
    '--petal-turn-mid': `${turn * .47}deg`,
    '--petal-turn': `${turn}deg`,
    '--petal-scale': String(.58 + depth * .25 + (index % 4) * .04),
    '--petal-opacity': String(.44 + depth * .18),
  }
})

function WindowGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="school-window-grid">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </div>
  )
}

function SchoolCampus() {
  return (
    <div className="education-campus" aria-hidden="true">
      <span className="education-sun" />
      <span className="education-cloud education-cloud-left" />
      <span className="education-cloud education-cloud-right" />

      <div className="cherry-branch cherry-branch-left">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </div>
      <div className="cherry-branch cherry-branch-right">
        {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
      </div>

      <div className="school-building">
        <div className="school-wing school-wing-left"><WindowGrid /></div>
        <div className="school-center">
          <span className="school-roof" />
          <span className="school-clock">17</span>
          <strong>CNSA</strong>
          <small>CHUNGNAM SAMSUNG ACADEMY</small>
          <WindowGrid count={6} />
        </div>
        <div className="school-wing school-wing-right"><WindowGrid /></div>
      </div>

      <div className="campus-tree campus-tree-one"><i /></div>
      <div className="campus-tree campus-tree-two"><i /></div>
      <div className="campus-tree campus-tree-three"><i /></div>
      <div className="campus-lawn" />
      <div className="campus-path" />
    </div>
  )
}

function UniversityGate() {
  return (
    <div className="university-gate" aria-hidden="true">
      <div className="university-gate-sign">
        <span>建國大學校</span>
        <strong>KONKUK UNIVERSITY</strong>
      </div>
      <i className="gate-pillar gate-pillar-left" />
      <i className="gate-pillar gate-pillar-right" />
    </div>
  )
}

export default function EducationJourney({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active) return
    const track = trackRef.current
    if (!track) return

    const projectCards = Array.from(track.querySelectorAll<HTMLElement>('.education-project-card'))
    let animationFrame = 0

    const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
    const reveal = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start))
    const smoothstep = (value: number) => value * value * (3 - 2 * value)
    const visibility = (progress: number, enterStart: number, enterEnd: number, exitStart: number, exitEnd: number) => (
      Math.min(reveal(progress, enterStart, enterEnd), 1 - reveal(progress, exitStart, exitEnd))
    )

    const updateProgress = () => {
      animationFrame = 0
      const rect = track.getBoundingClientRect()
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-rect.top / distance)
      const frame = Math.floor(progress * 48) % 4
      const step = Math.floor(progress * 48)
      const kiwiTravel = progress <= .67 ? progress : .67 + (progress - .67) * .3

      const schoolOpacity = visibility(progress, .155, .235, .335, .415)
      const archiveOpacity = visibility(progress, .385, .455, .66, .735)
      const universityOpacity = reveal(progress, .71, .81)
      const gateOpacity = reveal(progress, .74, .88)
      const transitionProgress = smoothstep(reveal(progress, .008, .205))

      track.style.setProperty('--education-progress', String(progress))
      track.style.setProperty('--education-transition-y', `${transitionProgress * -112}%`)
      track.style.setProperty('--education-transition-tilt', `${transitionProgress * -2.4}deg`)
      track.style.setProperty('--education-gust-opacity', String(Math.sin(transitionProgress * Math.PI)))
      track.style.setProperty('--education-gust-x', `${-30 + transitionProgress * 162}vw`)
      track.style.setProperty('--education-gust-y', `${24 - transitionProgress * 61}vh`)
      track.style.setProperty('--education-gust-turn', `${transitionProgress * 390}deg`)
      track.style.setProperty('--education-campus-scale', String(1.075 - transitionProgress * .075))
      track.style.setProperty('--school-copy-opacity', String(schoolOpacity))
      track.style.setProperty('--school-copy-y', `${(1 - schoolOpacity) * 34 - reveal(progress, .335, .415) * 24}px`)
      track.style.setProperty('--archive-opacity', String(archiveOpacity))
      track.style.setProperty('--archive-y', `${(1 - archiveOpacity) * 30 - reveal(progress, .66, .735) * 20}px`)
      track.style.setProperty('--university-opacity', String(universityOpacity))
      track.style.setProperty('--university-y', `${(1 - universityOpacity) * 42}px`)
      track.style.setProperty('--gate-opacity', String(gateOpacity))
      track.style.setProperty('--gate-y', `${(1 - gateOpacity) * 50}px`)
      track.style.setProperty('--campus-x', `${progress * -12}vw`)
      track.style.setProperty('--campus-fade', String(1 - reveal(progress, .7, .88) * .72))
      track.style.setProperty('--education-kiwi-x', `${-17 + kiwiTravel * 137}vw`)
      track.style.setProperty('--education-kiwi-frame', `${frame * -25}%`)
      track.style.setProperty('--education-kiwi-bob', `${step % 2 === 0 ? 0 : -5}px`)
      track.style.setProperty('--education-kiwi-tilt', `${step % 2 === 0 ? -.4 : .45}deg`)
      track.style.setProperty('--branch-left-x', `${progress * -5.5}vw`)
      track.style.setProperty('--branch-right-x', `${progress * 4}vw`)

      projectCards.forEach((card, index) => {
        const start = .425 + index * .042
        const shown = reveal(progress, start, start + .06)
        const gone = reveal(progress, .655 + index * .008, .72 + index * .008)
        const cardOpacity = Math.min(shown, 1 - gone)
        const tilt = (index % 2 === 0 ? -1 : 1) * (1.4 - shown * 1.1)
        card.style.opacity = String(cardOpacity)
        card.style.transform = `translate3d(${(1 - shown) * 52}px, ${(1 - shown) * 24 - gone * 18}px, 0) rotate(${tilt}deg)`
      })

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
  }, [active])

  return (
    <section className="education-track" ref={trackRef} aria-label="학력과 고등학교 프로젝트">
      <div className="education-stage">
        <SchoolCampus />

        <div className="education-transition" aria-hidden="true">
          <span>CHAPTER 02 · SPRING 2017</span>
          <strong>봄의 교정으로</strong>
          <i />
        </div>
        <div className="education-transition-gust" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </div>

        <div className="education-petals" aria-hidden="true">
          {Array.from({ length: petalCount }, (_, index) => (
            <i className={`education-petal education-petal-${index % 3}`} style={petalStyles[index]} key={index} />
          ))}
        </div>

        <header className="education-meta">
          <span>WHITEKIWI&nbsp; / &nbsp;EDUCATION</span>
          <strong>02</strong>
        </header>

        <article className="education-school-copy">
          <span className="education-eyebrow">2017 · ASAN</span>
          <h2>충남삼성고등학교</h2>
          <p><span>에서 </span><strong>IT 과정</strong>을 이수했습니다</p>
        </article>

        <article className="education-project-archive">
          <div className="education-project-heading">
            <span>SELECTED PROJECTS · 2017—2019</span>
            <h2><span>세 번의 봄,</span><br /><strong>그 사이</strong></h2>
            <div className="education-school-notes">
              <span>학생회장</span>
              <span>2018 정보올림피아드 · 은상</span>
            </div>
          </div>
          <ol className="education-project-list">
            {projects.map((project, index) => (
              <li className="education-project-card" key={project}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{project}</strong>
              </li>
            ))}
          </ol>
        </article>

        <article className="education-university-copy">
          <span className="education-eyebrow">2020 · SEOUL</span>
          <h2>건국대학교</h2>
          <p><strong>컴퓨터공학과</strong>에 진학했습니다</p>
        </article>

        <UniversityGate />

        <div className="education-kiwi-path" aria-hidden="true">
          <div className="education-kiwi-shadow" />
          <div className="education-kiwi-sprite">
            <img src="/assets/characters/kiwi-graduate-walk-cycle.png" alt="" />
          </div>
        </div>

        <div className="education-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  )
}
