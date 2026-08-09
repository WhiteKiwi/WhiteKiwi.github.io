import { useEffect, useState } from 'react'
import './portfolio-guidelines.css'

const sections = [
  ['00', 'Principles'],
  ['01', 'Identity'],
  ['02', 'Prompt mark'],
  ['03', 'Color'],
  ['04', 'Typography'],
  ['05', 'Voice'],
  ['06', 'Motion'],
  ['07', 'Illustration'],
  ['08', 'Social'],
] as const

/** 문서를 실제로 손볼 때 함께 갱신한다. 이 한 곳만 고치면 목차와 푸터가 같이 바뀐다. */
const lastUpdated = '2026.08.09'

const colors = [
  { name: 'Graphite', hex: '#171717', role: 'Primary ink', tone: 'dark' },
  { name: 'Warm Ivory', hex: '#F4F0E7', role: 'Primary canvas', tone: 'light' },
  { name: 'Prompt Amber', hex: '#D89A1D', role: 'Signal & action', tone: 'amber' },
  { name: 'Glass Sky', hex: '#D9E8EC', role: 'Prologue atmosphere', tone: 'sky' },
  { name: 'Kiwi Brown', hex: '#73523A', role: 'Character anchor', tone: 'brown' },
  { name: 'Kiwi Green', hex: '#79945A', role: 'Living detail', tone: 'green' },
] as const

/**
 * 각 회사·학교의 실제 브랜드에서 가져온 식별색이다.
 * 장면은 이 색에서 파생한 더 넓은 팔레트를 쓰므로 여기 값과 1:1로 일치하지 않는다.
 */
const chapterColors = [
  ['Education', '#007DC3', 'CNSA Blue'],
  ['Whiteblock', '#17194B', 'TAKEIT Navy'],
  ['Fetching', '#000000', 'FETCHING Black'],
  ['Aimpact', '#38A080', 'Arrange Mint'],
  ['Daangn', '#FF6F0F', 'Daangn Orange'],
] as const

function PromptMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`guidelines-prompt-mark${compact ? ' is-compact' : ''}`} aria-label="greater-than underscore prompt mark">
      <span aria-hidden="true">&gt;</span>
      <i aria-hidden="true">_</i>
    </span>
  )
}

function SectionLabel({ number, children }: { number: string; children: string }) {
  return (
    <div className="guidelines-section-label">
      <span>{number}</span>
      <p>{children}</p>
    </div>
  )
}

function PortfolioGuidelines() {
  const [copied, setCopied] = useState<string | null>(null)

  // title은 guidelines/index.html이 직접 선언한다. GA page view가 마운트 전에 전송되기 때문이다.
  useEffect(() => {
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const previousTheme = themeColor?.content

    document.body.classList.add('guidelines-is-open')
    themeColor?.setAttribute('content', '#171717')

    return () => {
      document.body.classList.remove('guidelines-is-open')
      if (themeColor && previousTheme) themeColor.setAttribute('content', previousTheme)
    }
  }, [])

  const copyColor = async (hex: string) => {
    let didCopy = false

    try {
      await navigator.clipboard.writeText(hex)
      didCopy = true
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = hex
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      document.body.appendChild(fallback)
      fallback.select()
      didCopy = document.execCommand('copy')
      fallback.remove()
    }

    if (didCopy) {
      setCopied(hex)
      window.setTimeout(() => setCopied((current) => (current === hex ? null : current)), 1400)
    } else {
      setCopied(null)
    }
  }

  return (
    <main className="guidelines-page">
      <aside className="guidelines-rail" aria-label="Portfolio Guidelines 목차">
        <a className="guidelines-rail-brand" href="#top" aria-label="Portfolio Guidelines 맨 위로">
          <PromptMark compact />
          <span>whitekiwi</span>
        </a>

        <p className="guidelines-rail-title">Portfolio<br />Guidelines</p>

        <nav>
          {sections.map(([number, label]) => (
            <a href={`#${label.toLowerCase().replace(' ', '-')}`} key={number}>
              <span>{number}</span>{label}
            </a>
          ))}
        </nav>

        <p className="guidelines-version">LIVING DOCUMENT<br />01 / {lastUpdated.slice(0, 7)}</p>
      </aside>

      <div className="guidelines-content">
        <header className="guidelines-hero" id="top">
          <div className="guidelines-hero-meta">
            <span>WHITEKIWI / IDENTITY SYSTEM</span>
            <span>JIHOON JANG / NODE.JS DEVELOPER</span>
          </div>

          <div className="guidelines-hero-title">
            <p>Portfolio</p>
            <h1>Guide<span>lines</span></h1>
          </div>

          <div className="guidelines-hero-bottom">
            <p className="guidelines-hero-intro">
              A living system for a developer portfolio that feels
              <strong> technically deep, playfully precise, and unmistakably human.</strong>
            </p>
            <div className="guidelines-hero-mark" aria-hidden="true"><PromptMark /></div>
          </div>

          <div className="guidelines-marquee" aria-hidden="true">
            <span>CODE WITH CHARACTER · BUILD WITH INTENT · CODE WITH CHARACTER · BUILD WITH INTENT ·&nbsp;</span>
            <span>CODE WITH CHARACTER · BUILD WITH INTENT · CODE WITH CHARACTER · BUILD WITH INTENT ·&nbsp;</span>
          </div>
        </header>

        <section className="guidelines-section guidelines-principles" id="principles">
          <SectionLabel number="00">Principles</SectionLabel>
          <div className="guidelines-section-heading">
            <h2>How it should<br /><em>feel.</em></h2>
            <p>네 가지 원칙은 색이나 레이아웃보다 먼저 적용한다. 새 장면이 이 인상을 강화하지 못한다면 덜어낸다.</p>
          </div>

          <div className="guidelines-principle-grid">
            <article>
              <span>01</span><h3>Technical<br />depth</h3>
              <p>복잡한 시스템을 이해하고 만든 사람의 정확함. 기술은 장식이 아니라 이야기의 뼈대다.</p>
              <i aria-hidden="true">{'{ }'}</i>
            </article>
            <article>
              <span>02</span><h3>Playful<br />precision</h3>
              <p>귀엽되 가볍지 않게. 키위와 위트는 디테일 안에서 절제해 사용한다.</p>
              <i aria-hidden="true">✦</i>
            </article>
            <article>
              <span>03</span><h3>Editorial<br />clarity</h3>
              <p>큰 문장 하나, 작은 정보 하나. 계층과 여백으로 읽는 순서를 설계한다.</p>
              <i aria-hidden="true">Aa</i>
            </article>
            <article>
              <span>04</span><h3>Motion<br />with intent</h3>
              <p>움직임은 원인을 가진다. 스크롤과 장면, 오브젝트 사이의 관계를 설명한다.</p>
              <i aria-hidden="true">→</i>
            </article>
          </div>
        </section>

        <section className="guidelines-section guidelines-identity" id="identity">
          <SectionLabel number="01">Identity</SectionLabel>
          <div className="guidelines-section-heading is-light">
            <h2>One person.<br />Two names.</h2>
            <p><code>whitekiwi</code>는 온라인 정체성이고, Jihoon Jang은 그 정체성 뒤의 사람이다. 둘은 경쟁하지 않고 문맥에 따라 역할을 나눈다.</p>
          </div>

          <div className="guidelines-name-stage">
            <p className="guidelines-display-name">white<span>kiwi</span></p>
            <div>
              <p>PERSON</p><strong>Jihoon Jang</strong>
              <p>ROLE</p><strong>Node.js Developer</strong>
              <p>HANDLE</p><strong>@whitekiwi</strong>
            </div>
          </div>

          <div className="guidelines-rule-row">
            <article className="is-do"><span>DO / PREFERRED</span><p>whitekiwi</p><small>항상 소문자 한 단어로 쓴다.</small></article>
            <article className="is-dont"><span>DON’T</span><p>White Kiwi™</p><small>띄어쓰기, 임의의 대문자, 상표 기호를 붙이지 않는다.</small></article>
          </div>
        </section>

        <section className="guidelines-section guidelines-mark" id="prompt-mark">
          <SectionLabel number="02">Prompt mark</SectionLabel>
          <div className="guidelines-section-heading">
            <h2>A prompt,<br /><em>not a logo trick.</em></h2>
            <p><code>&gt;_</code>는 입력을 기다리는 상태다. 완성된 결과보다 계속 만들고 있다는 태도를 나타낸다.</p>
          </div>

          <div className="guidelines-mark-showcase">
            <div className="guidelines-mark-dark"><PromptMark /></div>
            <div className="guidelines-mark-light"><PromptMark /></div>
          </div>

          <div className="guidelines-mark-specs">
            <article>
              <span>SAFE AREA</span>
              <div className="guidelines-safe-area"><PromptMark compact /></div>
              <p>마크 높이의 ½ 이상을 모든 방향에 비워 둔다.</p>
            </article>
            <article>
              <span>MINIMUM SIZE</span>
              <div className="guidelines-size-line">
                <img src="/favicon-16x16.png?v=prompt-mark" width="16" height="16" alt="16픽셀 prompt mark" />
                <img src="/favicon-32x32.png?v=prompt-mark" width="32" height="32" alt="32픽셀 prompt mark" />
                <img src="/favicon-48x48.png?v=prompt-mark" width="48" height="48" alt="48픽셀 prompt mark" />
              </div>
              <p>디지털 최소 크기는 16px. 그 이하에서는 워드마크를 사용한다.</p>
            </article>
          </div>

          <div className="guidelines-misuse">
            <p>DON’T</p>
            <div><span className="is-stretched">&gt;_</span><small>STRETCH</small></div>
            <div><span className="is-outline">&gt;_</span><small>OUTLINE</small></div>
            <div><span className="is-rotate">&gt;_</span><small>ROTATE</small></div>
            <div><span className="is-low-contrast">&gt;_</span><small>LOSE CONTRAST</small></div>
          </div>
        </section>

        <section className="guidelines-section guidelines-color" id="color">
          <SectionLabel number="03">Color</SectionLabel>
          <div className="guidelines-section-heading is-light">
            <h2>Warm canvas.<br />Sharp signal.</h2>
            <p>따뜻한 아이보리 위에 Graphite로 구조를 만들고 Amber는 행동과 신호에만 사용한다. 클릭하면 값을 복사한다.</p>
          </div>

          <div className="guidelines-swatches">
            {colors.map((color, index) => (
              <button
                className={`guidelines-swatch is-${color.tone}`}
                onClick={() => copyColor(color.hex)}
                type="button"
                key={color.hex}
                aria-label={`${color.name} ${color.hex} 복사`}
              >
                <span>0{index + 1}</span>
                <div><strong>{color.name}</strong><small>{color.role}</small></div>
                <code>{copied === color.hex ? 'COPIED ✓' : color.hex}</code>
              </button>
            ))}
          </div>

          <div className="guidelines-chapter-colors">
            <div><span>CHAPTER COLORS</span><p>각 챕터의 식별색은 그 회사의 실제 브랜드에서 가져온다. 스토리가 새로운 세계로 이동할 때만 색의 주도권을 넘기며, 장면은 이 색에서 파생한 더 넓은 팔레트를 쓴다.</p></div>
            <ul>
              {chapterColors.map(([name, hex, source]) => (
                <li key={name}><i style={{ backgroundColor: hex }} /><span>{name}</span><small>{source}</small><code>{hex}</code></li>
              ))}
            </ul>
          </div>
          <p className="guidelines-copy-status" aria-live="polite">{copied ? `${copied} copied to clipboard` : ''}</p>
        </section>

        <section className="guidelines-section guidelines-type" id="typography">
          <SectionLabel number="04">Typography</SectionLabel>
          <div className="guidelines-section-heading">
            <h2>Say less.<br /><em>Set it bigger.</em></h2>
            <p>Manrope가 친근한 본문과 대담한 제목을 맡고, DM Mono는 시스템 정보와 개발자 문맥을 만든다.</p>
          </div>

          <div className="guidelines-type-specimens">
            <article className="guidelines-type-display">
              <div><span>DISPLAY / MANROPE 800</span><code>80—160PX</code></div>
              <p>Born to<br /><em>build.</em></p>
            </article>
            <article className="guidelines-type-body">
              <div><span>BODY / MANROPE 400—700</span><code>16—24PX</code></div>
              <p>기술적으로 깊이 있으면서도 귀엽고, 세련되고, 실험적인 개발자.</p>
              <p className="is-english">Design the system. Then leave enough room for a little wonder.</p>
            </article>
            <article className="guidelines-type-mono">
              <div><span>UTILITY / DM MONO 400—500</span><code>10—14PX</code></div>
              <p>$ whoami<br />JIHOON JANG<br />NODE.JS DEVELOPER_</p>
            </article>
          </div>

          <div className="guidelines-type-scale" aria-label="타이포그래피 크기 체계">
            <span>TYPE SCALE</span>
            <p className="type-xxl">Aa <small>DISPLAY</small></p>
            <p className="type-xl">Aa <small>H1</small></p>
            <p className="type-lg">Aa <small>H2</small></p>
            <p className="type-md">Aa <small>BODY</small></p>
            <p className="type-sm">Aa <small>LABEL</small></p>
          </div>
        </section>

        <section className="guidelines-section guidelines-voice" id="voice">
          <SectionLabel number="05">Voice</SectionLabel>
          <div className="guidelines-section-heading is-light">
            <h2>Clear.<br />Warm. Precise.</h2>
            <p>무엇을 했는지 먼저 말하고, 왜 중요한지 덧붙인다. 자신감은 구체성에서 나오며 과장으로 만들지 않는다.</p>
          </div>

          <div className="guidelines-voice-words" aria-hidden="true">
            <span>DIRECT</span><span>HUMAN</span><span>CURIOUS</span><span>SPECIFIC</span>
          </div>

          <div className="guidelines-copy-examples">
            <article className="is-do">
              <span>DO / ACTIVE & SPECIFIC</span>
              <p>크롤러를 모듈화하고<br />운영 환경을 ECS로 옮겼습니다.</p>
            </article>
            <article className="is-dont">
              <span>DON’T / VAGUE & INFLATED</span>
              <p>혁신적인 기술로<br />최고의 시너지를 창출했습니다.</p>
            </article>
          </div>

          <div className="guidelines-voice-notes">
            <p><b>01</b> 짧은 문장을 쓴다.</p>
            <p><b>02</b> 능동형 동사로 시작한다.</p>
            <p><b>03</b> 기술명보다 해결한 문제를 먼저 둔다.</p>
            <p><b>04</b> 위트는 한 장면에 한 번이면 충분하다.</p>
          </div>
        </section>

        <section className="guidelines-section guidelines-motion" id="motion">
          <SectionLabel number="06">Motion</SectionLabel>
          <div className="guidelines-section-heading">
            <h2>Every move<br /><em>has a reason.</em></h2>
            <p>서사는 스크롤에 묶고 공기, 잎, 꽃잎 같은 주변 세계만 낮은 강도로 살아 있게 둔다.</p>
          </div>

          <div className="guidelines-motion-demo" aria-hidden="true">
            <div className="guidelines-motion-orbit"><i /><i /><i /></div>
            <div className="guidelines-motion-cursor">SCROLL <b>↓</b></div>
          </div>

          <div className="guidelines-motion-rules">
            <article><span>01 / CAUSE</span><h3>Input owns the story.</h3><p>사용자가 멈추면 핵심 장면도 멈춘다.</p></article>
            <article><span>02 / RHYTHM</span><h3>One focus at a time.</h3><p>등장, 정착, 퇴장의 순서를 분명히 한다.</p></article>
            <article><span>03 / RESTRAINT</span><h3>Ambient stays quiet.</h3><p>자동 모션은 내용을 가리지 않는 낮은 강도로 쓴다.</p></article>
            <article><span>04 / ACCESS</span><h3>Respect reduced motion.</h3><p>같은 정보를 얻는 정적 대표 상태를 제공한다.</p></article>
          </div>
        </section>

        <section className="guidelines-section guidelines-illustration" id="illustration">
          <SectionLabel number="07">Illustration</SectionLabel>
          <div className="guidelines-section-heading is-light">
            <h2>Same kiwi.<br />New worlds.</h2>
            <p>키위는 성장해도 다른 캐릭터가 되지 않는다. 몸의 비례와 방향을 유지하고 소품, 행동, 배경으로 역할을 바꾼다.</p>
          </div>

          <div className="guidelines-character-stage">
            <div className="guidelines-character-frame">
              <div className="guidelines-character-sprite" role="img" aria-label="포트폴리오의 갈색 2D 키위 캐릭터" />
              <span>BASE CHARACTER / 3-C</span>
            </div>
            <div className="guidelines-character-anatomy">
              <p><b>01</b><span>TALL BODY</span><small>납작하지 않은 물방울형 몸</small></p>
              <p><b>02</b><span>LONG BEAK</span><small>작은 크기에서도 읽히는 실루엣</small></p>
              <p><b>03</b><span>LONG LEGS</span><small>걷는 여정의 리듬</small></p>
              <p><b>04</b><span>QUIET FACE</span><small>과장하지 않은 표정</small></p>
            </div>
          </div>

          <div className="guidelines-illustration-rule">
            <p>KEEP</p><strong>silhouette + direction + warmth</strong>
            <i>CHANGE</i><strong>props + action + environment</strong>
          </div>
        </section>

        <section className="guidelines-section guidelines-social" id="social">
          <SectionLabel number="08">Social & browser</SectionLabel>
          <div className="guidelines-section-heading">
            <h2>Recognizable<br /><em>at every size.</em></h2>
            <p>브라우저 탭에서는 prompt mark, 공유 화면에서는 <code>$ whoami</code>와 이름을 사용해 같은 첫인상을 이어간다.</p>
          </div>

          <div className="guidelines-social-grid">
            <article className="guidelines-og-card">
              <div><span>OPEN GRAPH / 1200 × 630</span><a href="/og-image.png" target="_blank" rel="noreferrer">OPEN ASSET ↗</a></div>
              <img src="/og-image.png" width="1200" height="630" alt="$ whoami, whitekiwi, Jihoon Jang, Node.js Developer가 적힌 Open Graph 이미지" />
            </article>
            <article className="guidelines-browser-card">
              <span>BROWSER IDENTITY</span>
              <div className="guidelines-browser-tab">
                <img src="/favicon-32x32.png?v=prompt-mark" width="24" height="24" alt="whitekiwi prompt mark favicon" />
                <p>$ whoami</p><i>×</i>
              </div>
              <dl>
                <div><dt>TITLE</dt><dd>$ whoami</dd></div>
                <div><dt>DESCRIPTION</dt><dd>Scroll through the work and journey of Jihoon Jang, a Node.js developer.</dd></div>
              </dl>
            </article>
          </div>
        </section>

        <footer className="guidelines-footer">
          <div><PromptMark compact /><span>whitekiwi / Portfolio Guidelines</span></div>
          <p>Build the system.<br /><strong>Keep the wonder.</strong></p>
          <div className="guidelines-footer-meta"><span>LAST UPDATED / {lastUpdated}</span><a href="/">VIEW PORTFOLIO ↗</a></div>
        </footer>
      </div>
    </main>
  )
}

export default PortfolioGuidelines
