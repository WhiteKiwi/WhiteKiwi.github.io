import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react'
import './contact-finale.css'

type ContactStyle = CSSProperties & {
  '--contact-progress'?: number
  '--glow-x'?: string
  '--glow-y'?: string
}

type OutputTone = 'default' | 'muted' | 'accent' | 'error' | 'success'

type TerminalLine = {
  text: string
  tone?: OutputTone
}

type TerminalEntry = {
  id: number
  command: string
  lines: TerminalLine[]
}

const TERMINAL_STORAGE_KEY = 'whitekiwi-contact-terminal-v1'
const githubUrl = 'https://github.com/whitekiwi'
const blogUrl = 'https://blog.whitekiwi.link'
const linkedinUrl = 'https://www.linkedin.com/in/whitekiwi/'
const instagramUrl = 'https://www.instagram.com/whitekiwi_'
const emailUrl = 'mailto:jh145478@gmail.com'

const availableCommands = ['help', 'whoami', 'open github', 'open blog', 'open linkedin', 'open instagram', 'open email', 'clear']

const loadTerminalEntries = (): TerminalEntry[] => {
  try {
    const saved = window.sessionStorage.getItem(TERMINAL_STORAGE_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed as TerminalEntry[] : []
  } catch {
    return []
  }
}

export default function ContactFinale({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const terminalLogRef = useRef<HTMLDivElement>(null)
  const nextEntryIdRef = useRef(Date.now())
  const hasBootedRef = useRef(false)
  const [entries, setEntries] = useState<TerminalEntry[]>(loadTerminalEntries)
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [bootCommand, setBootCommand] = useState('')
  const [bootReady, setBootReady] = useState(false)

  const commandHistory = useMemo(() => entries.map((entry) => entry.command).filter(Boolean), [entries])

  useEffect(() => {
    try {
      if (entries.length) window.sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(entries.slice(-30)))
      else window.sessionStorage.removeItem(TERMINAL_STORAGE_KEY)
    } catch {
      // The terminal still works when storage is unavailable.
    }
  }, [entries])

  useEffect(() => {
    terminalLogRef.current?.scrollTo({ top: terminalLogRef.current.scrollHeight, behavior: 'smooth' })
  }, [entries, bootReady])

  useEffect(() => {
    if (!active) return
    const track = trackRef.current
    if (!track) return

    let animationFrame = 0
    const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
    const update = () => {
      animationFrame = 0
      const rect = track.getBoundingClientRect()
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1)
      track.style.setProperty('--contact-progress', String(clamp(-rect.top / distance)))
    }
    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = track.getBoundingClientRect()
      track.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
      track.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    track.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      track.removeEventListener('pointermove', onPointerMove)
    }
  }, [active])

  useEffect(() => {
    if (!active || hasBootedRef.current || !trackRef.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fullCommand = '$ contact --interactive'
    let typeTimer = 0
    let readyTimer = 0

    const startBoot = () => {
      if (hasBootedRef.current) return
      hasBootedRef.current = true
      if (reducedMotion) {
        setBootCommand(fullCommand)
        setBootReady(true)
        return
      }

      let character = 0
      typeTimer = window.setInterval(() => {
        character += 1
        setBootCommand(fullCommand.slice(0, character))
        if (character === fullCommand.length) {
          window.clearInterval(typeTimer)
          readyTimer = window.setTimeout(() => setBootReady(true), 360)
        }
      }, 42)
    }

    const observer = new IntersectionObserver((observations) => {
      if (observations.some((observation) => observation.isIntersecting)) {
        startBoot()
        observer.disconnect()
      }
    }, { threshold: .08 })
    observer.observe(trackRef.current)

    return () => {
      observer.disconnect()
      if (typeTimer) window.clearInterval(typeTimer)
      if (readyTimer) window.clearTimeout(readyTimer)
    }
  }, [active])

  const executeCommand = useCallback((rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ')
    if (!command) return

    if (command === 'clear') {
      setEntries([])
      setInput('')
      setHistoryIndex(-1)
      try {
        window.sessionStorage.removeItem(TERMINAL_STORAGE_KEY)
      } catch {
        // Clearing the visible terminal still works when storage is unavailable.
      }
      return
    }

    let lines: TerminalLine[]
    if (command === 'help') {
      lines = [
        { text: 'AVAILABLE COMMANDS', tone: 'accent' },
        ...availableCommands.map((item) => ({ text: `  ${item}`, tone: 'default' as const })),
        { text: 'Use ↑ and ↓ to revisit command history.', tone: 'muted' },
      ]
    } else if (command === 'whoami') {
      lines = [
        { text: 'Jihoon Jang / 장지훈', tone: 'success' },
        { text: 'Node.js Developer', tone: 'default' },
        { text: 'Building useful products and dependable systems.', tone: 'muted' },
        { text: 'Seoul, Korea · KST', tone: 'muted' },
      ]
    } else if (command === 'open') {
      lines = [
        { text: 'usage: open <channel>', tone: 'accent' },
        { text: 'available channels:', tone: 'muted' },
        { text: '  github', tone: 'default' },
        { text: '  blog', tone: 'default' },
        { text: '  linkedin', tone: 'default' },
        { text: '  instagram', tone: 'default' },
        { text: '  email', tone: 'default' },
      ]
    } else if (command === 'open github') {
      const opened = window.open(githubUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening GitHub in a new tab…' : `Popup blocked. Open manually: ${githubUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open blog') {
      const opened = window.open(blogUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening Blog in a new tab…' : `Popup blocked. Open manually: ${blogUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open linkedin') {
      const opened = window.open(linkedinUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening LinkedIn in a new tab…' : `Popup blocked. Open manually: ${linkedinUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open instagram' || command === 'open instargram') {
      const opened = window.open(instagramUrl, '_blank')
      if (opened) opened.opener = null
      lines = [{ text: opened ? 'Opening Instagram in a new tab…' : `Popup blocked. Open manually: ${instagramUrl}`, tone: opened ? 'success' : 'error' }]
    } else if (command === 'open email') {
      lines = [{ text: 'Opening your email client…', tone: 'success' }]
      window.location.href = emailUrl
    } else if (command === 'cd' || command.startsWith('cd ')) {
      const target = command.slice(2).trim() || '~'
      lines = [
        { text: `zsh: cd: ${target}: permission denied`, tone: 'error' },
        { text: 'This journey is read-only. Try `help` instead.', tone: 'muted' },
      ]
    } else if (command.startsWith('open ')) {
      lines = [
        { text: `open: unknown channel: ${command.slice(5)}`, tone: 'error' },
        { text: 'Run `open` to see the available channels.', tone: 'muted' },
      ]
    } else {
      lines = [
        { text: `zsh: command not found: ${command}`, tone: 'error' },
        { text: 'Type `help` to see the commands available here.', tone: 'muted' },
      ]
    }

    nextEntryIdRef.current += 1
    setEntries((current) => [...current, { id: nextEntryIdRef.current, command, lines }].slice(-30))
    setInput('')
    setHistoryIndex(-1)
  }, [])

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    executeCommand(input)
  }

  const navigateHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    if (!commandHistory.length) return

    if (event.key === 'ArrowUp') {
      const nextIndex = historyIndex < 0 ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0)
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
      return
    }

    if (historyIndex < 0) return
    const nextIndex = historyIndex + 1
    if (nextIndex >= commandHistory.length) {
      setHistoryIndex(-1)
      setInput('')
    } else {
      setHistoryIndex(nextIndex)
      setInput(commandHistory[nextIndex])
    }
  }

  return (
    <footer
      className="contact-finale-track"
      ref={trackRef}
      aria-label="장지훈 연락처 터미널"
      style={{ '--contact-progress': 0, '--glow-x': '72vw', '--glow-y': '34vh' } as ContactStyle}
    >
      <div className="contact-finale-stage">
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-grid" aria-hidden="true" />
        <div className="contact-marquee" aria-hidden="true">
          <span>HELLO · CONTACT · HELLO · CONTACT · </span>
          <span>HELLO · CONTACT · HELLO · CONTACT · </span>
        </div>

        <header className="contact-finale-meta">
          <span>WHITEKIWI / CONTACT</span>
          <span>INTERACTIVE SHELL · KST</span>
          <strong>END</strong>
        </header>

        <div className="contact-finale-copy">
          <p className="contact-command"><span>$</span> say hello<i aria-hidden="true" /></p>
          <h2><span>LET&apos;S</span><strong>CONNECT.</strong></h2>
          <p>좋은 제품에 관한 흥미로운 이야기라면,<br />언제든 반갑습니다.</p>
        </div>

        <section className={`contact-terminal ${bootReady ? 'is-ready' : ''}`} aria-label="대화형 연락처 터미널">
          <header className="contact-terminal-bar">
            <span aria-hidden="true"><i /><i /><i /></span>
            <strong>whitekiwi@portfolio — contact</strong>
            <small>zsh</small>
          </header>

          <div className="contact-terminal-log" ref={terminalLogRef} role="log" aria-live="polite" onClick={() => terminalInputRef.current?.focus()}>
            <div className="terminal-boot" aria-hidden="true">
              <p><span className="terminal-prompt-mark">›</span>{bootCommand}<i /></p>
              {bootReady && (
                <div className="terminal-boot-output">
                  <span>[ok] identity loaded: whitekiwi</span>
                  <span>[ok] contact channels mounted</span>
                  <strong>Interactive contact shell is ready.</strong>
                  <small>Type `help` or choose a command below.</small>
                </div>
              )}
            </div>

            {entries.map((entry) => (
              <div className="terminal-entry" key={entry.id}>
                <p className="terminal-entry-command"><span>visitor@portfolio %</span> {entry.command}</p>
                <div className="terminal-entry-output">
                  {entry.lines.map((line, index) => <span className={`is-${line.tone ?? 'default'}`} style={{ '--line-delay': `${index * 45}ms` } as CSSProperties} key={`${line.text}-${index}`}>{line.text}</span>)}
                </div>
              </div>
            ))}
          </div>

          <form className="contact-terminal-form" onSubmit={submitCommand}>
            <label htmlFor="contact-terminal-input">visitor@portfolio %</label>
            <input
              id="contact-terminal-input"
              ref={terminalInputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setHistoryIndex(-1)
              }}
              onKeyDown={navigateHistory}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={bootReady ? 'type a command…' : 'booting…'}
              disabled={!bootReady}
            />
            <button type="submit" disabled={!bootReady || !input.trim()}>RUN</button>
          </form>

          <div className="contact-terminal-shortcuts" aria-label="명령 바로 실행">
            {availableCommands.map((command) => (
              <button type="button" onClick={() => executeCommand(command)} disabled={!bootReady} key={command}>{command}</button>
            ))}
          </div>
        </section>

        <nav className="contact-link-dock" aria-label="연락처와 외부 링크">
          <div className="contact-link-primary">
            <span>CONTACT</span>
            <a href={emailUrl}>jh145478@gmail.com</a>
          </div>
          <div className="contact-link-list">
            <a className="contact-email-compact" href={emailUrl}>Email <span aria-hidden="true">↗</span></a>
            <a href={githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={blogUrl} target="_blank" rel="noreferrer">Blog <span aria-hidden="true">↗</span></a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          </div>
        </nav>

        <div className="contact-finale-bottom">
          <p>THANKS FOR SCROLLING <span aria-hidden="true">✦</span> PORTFOLIO 2026</p>
          <div>
            <a href="/?view=guidelines">PORTFOLIO GUIDELINES <span aria-hidden="true">↗</span></a>
            <a href="/">RUN AGAIN <span aria-hidden="true">↺</span></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
