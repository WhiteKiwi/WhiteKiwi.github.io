import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import './resume.css'
import {
  awards,
  companies,
  contacts,
  education,
  formatDuration,
  lastUpdated,
  monthsBetween,
  profile,
  skills,
  totalCareerMonths,
  ui,
  type Lang,
} from './resume-data'

type PointerStyle = CSSProperties & { '--px'?: string; '--py'?: string }

const STORAGE_KEY = 'whitekiwi-resume-lang'
const TRAIL_LENGTH = 18

function readLang(): Lang {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'ko'
  } catch {
    return 'ko'
  }
}

function PromptMark() {
  return (
    <span className="resume-mark" aria-label="whitekiwi">
      <span aria-hidden="true">&gt;</span>
      <i aria-hidden="true">_</i>
    </span>
  )
}

/** 섹션이 처음 보일 때 한 번만 표시 상태로 올린다. 되돌리지 않으므로 읽는 도중 문장이 사라지지 않는다. */
function useReveal() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scope = root.current
    if (!scope) return

    const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!window.IntersectionObserver) {
      targets.forEach((el) => el.setAttribute('data-reveal', 'in'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.setAttribute('data-reveal', 'in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return root
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length || !window.IntersectionObserver) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-24% 0px -60% 0px', threshold: 0 },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

const NAV = [
  { id: 'experience', key: 'experience' },
  { id: 'skills', key: 'skills' },
  { id: 'education', key: 'education' },
  { id: 'awards', key: 'awards' },
  { id: 'contact', key: 'contact' },
] as const

function Resume() {
  const [lang, setLang] = useState<Lang>('ko')
  const [trail, setTrail] = useState(false)
  const scope = useReveal()
  const active = useActiveSection(NAV.map((item) => item.id))
  const stage = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: -9999, y: -9999 })

  useEffect(() => setLang(readLang()), [])

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // 저장이 막혀 있어도 현재 세션 전환은 그대로 동작한다.
    }
  }, [lang])

  // 좌표만 커스텀 속성으로 넘기고 배경 그리드를 드러내는 일은 CSS mask가 한다.
  useEffect(() => {
    const el = stage.current
    if (!el) return

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.current = { x: event.clientX, y: event.clientY }
      el.style.setProperty('--px', `${event.clientX}px`)
      el.style.setProperty('--py', `${event.clientY}px`)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  // 워드마크로 켜는 숨은 트레일. 앞 점은 커서를, 뒤 점은 바로 앞 점을 쫓아 지연이 누적된다.
  useEffect(() => {
    if (!trail) return

    const dots = Array.from(trailRef.current?.children ?? []) as HTMLElement[]
    const path = dots.map(() => ({ ...pointer.current }))
    let frame = 0

    const tick = () => {
      for (let i = 0; i < path.length; i += 1) {
        const target = i === 0 ? pointer.current : path[i - 1]
        path[i].x += (target.x - path[i].x) * .34
        path[i].y += (target.y - path[i].y) * .34
        dots[i].style.transform = `translate3d(${path[i].x}px, ${path[i].y}px, 0)`
      }
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [trail])

  const t = useCallback((entry: Record<Lang, string>) => entry[lang], [lang])

  // 경력 길이만 조회 시점으로 계산한다. 갱신 시점은 손으로 관리하는 상수다.
  const careerLength = formatDuration(totalCareerMonths(companies), lang)
  const stamp = lang === 'ko' ? `${lastUpdated} 기준` : `Updated ${lastUpdated}`

  return (
    <div
      className="resume"
      ref={stage}
      style={{ '--px': '68vw', '--py': '32vh' } as PointerStyle}
    >
      <div className="resume-grid" aria-hidden="true" />
      {trail && (
        <div className="resume-trail" ref={trailRef} aria-hidden="true">
          {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
            <i key={i} style={{ '--i': i, '--total': TRAIL_LENGTH } as CSSProperties} />
          ))}
        </div>
      )}

      <aside className="resume-rail">
        {/* 숨은 토글이라 라벨로 설명하지 않는다. 메인 여정으로 가는 길은 하단에 따로 있다. */}
        <button
          type="button"
          className={`resume-rail-home${trail ? ' is-on' : ''}`}
          onClick={() => setTrail((current) => !current)}
          aria-pressed={trail}
        >
          <PromptMark />
          <span>whitekiwi</span>
        </button>

        <nav aria-label={t(ui.resume)}>
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? 'is-active' : undefined}
              aria-current={active === item.id ? 'true' : undefined}
            >
              {t(ui[item.key])}
            </a>
          ))}
        </nav>

        <div className="resume-rail-actions">
          <div className="resume-lang" role="group" aria-label="Language">
            <button type="button" onClick={() => setLang('ko')} aria-pressed={lang === 'ko'}>KO</button>
            <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button>
          </div>
          <button type="button" className="resume-print" onClick={() => window.print()}>
            {t(ui.print)} <span aria-hidden="true">↓</span>
          </button>
        </div>
      </aside>

      <main className="resume-sheet" ref={scope}>
        <header className="resume-hero">
          <p className="resume-eyebrow" data-reveal="out">
            <PromptMark /> {t(ui.resume)} · {stamp}
          </p>
          <h1 data-reveal="out">
            {t(profile.name)}
            <em>{profile.handle}</em>
          </h1>
          <p className="resume-role" data-reveal="out">
            <span>{t(profile.role)}</span>
            <b>{lang === 'ko' ? `경력 ${careerLength}` : `${careerLength} of experience`}</b>
          </p>
          <p className="resume-tagline" data-reveal="out">{t(profile.tagline)}</p>

          <ul className="resume-contacts" data-reveal="out">
            {contacts.map((contact) => (
              <li key={contact.label}>
                <span>{contact.label}</span>
                <a href={contact.href} target={contact.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                  {contact.value}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <section id="experience" className="resume-section">
          <h2 className="resume-section-title" data-reveal="out"><span>01</span>{t(ui.experience)}</h2>

          <ol className="resume-companies">
            {companies.map((company) => (
              <li
                key={company.id}
                className="resume-company"
                data-reveal="out"
                style={{ '--accent': company.accent } as CSSProperties}
              >
                <div className="resume-company-head">
                  <div className="resume-company-name">
                    <h3>{t(company.name)}</h3>
                    <p>{t(company.role)}</p>
                  </div>
                  <div className="resume-company-time">
                    <b>{company.start} — {company.end ?? t(ui.present)}</b>
                    <span>{formatDuration(monthsBetween(company.start, company.end), lang)}</span>
                  </div>
                </div>

                {company.summary && (
                  <p className="resume-company-summary">
                    {company.ongoing && <mark>{t(ui.inProgress)}</mark>}
                    {t(company.summary)}
                  </p>
                )}

                {company.projects.length > 0 && (
                  <ul className="resume-projects">
                    {company.projects.map((project) => (
                      <li key={project.title.ko}>
                        <div className="resume-project-head">
                          <h4>{t(project.title)}</h4>
                          {project.period && <span>{project.period}</span>}
                        </div>
                        <ul>
                          {project.points[lang].map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section id="skills" className="resume-section">
          <h2 className="resume-section-title" data-reveal="out"><span>02</span>{t(ui.skills)}</h2>
          <ul className="resume-skills" data-reveal="out">
            {skills.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>
        </section>

        <section id="education" className="resume-section">
          <h2 className="resume-section-title" data-reveal="out"><span>03</span>{t(ui.education)}</h2>
          <ul className="resume-list" data-reveal="out">
            {education.map((item) => (
              <li key={item.school.ko}>
                <div>
                  <h3>{t(item.school)}</h3>
                  <p>{t(item.detail)}</p>
                </div>
                <span>{t(item.period)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="awards" className="resume-section">
          <h2 className="resume-section-title" data-reveal="out"><span>04</span>{t(ui.awards)}</h2>
          <ul className="resume-list" data-reveal="out">
            {awards.map((item) => (
              <li key={item.title.ko}>
                <div><h3>{t(item.title)}</h3></div>
                <span>{item.date}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="resume-section resume-outro">
          <h2 className="resume-section-title" data-reveal="out"><span>05</span>{t(ui.contact)}</h2>
          <p className="resume-outro-mail" data-reveal="out">
            <a href="mailto:jh145478@gmail.com">jh145478@gmail.com</a>
          </p>
          <p className="resume-outro-link" data-reveal="out">
            <a href="/">{t(ui.journey)} <span aria-hidden="true">↗</span></a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default Resume
