import './bird-lab.css'

function FieldSketchBird() {
  return (
    <svg className="bird-study-svg field-sketch" viewBox="0 0 380 310" role="img" aria-label="손으로 그린 탐험가 키위새">
      <path className="sketch-wash" d="M43 222c62-93 151-143 276-147-48 72-102 130-214 166Z" />
      <path className="sketch-body" d="M126 205c-3-30 10-53 38-64 2-48 34-77 81-75 48 1 85 32 92 77 7 47-22 86-70 92-37 5-69-5-88-25-18 20-50 20-53-5Z" />
      <path className="sketch-beak" d="M171 147c-58 17-97 42-126 77 43-12 85-29 128-58" />
      <circle className="sketch-eye" cx="184" cy="123" r="8" />
      <path className="sketch-feathers" d="m215 84 9 18m11-23 7 20m13-14 4 22m21-11-4 19m24 2-13 13m31 11-19 6m20 18-21-2m10 24-20-10m-1 30-15-17m-11 32-7-22m-15 26-1-23m-20 18 6-21" />
      <path className="sketch-feet" d="m170 211-9 40m8-2-24 10m25-10 14 9m67-24-3 31m2-2-20 8m20-8 16 7" />
      <ellipse className="sketch-fruit" cx="76" cy="264" rx="43" ry="22" transform="rotate(-7 76 264)" />
      <ellipse className="sketch-fruit-core" cx="76" cy="264" rx="18" ry="8" transform="rotate(-7 76 264)" />
      <path className="sketch-question" d="M101 85c-5-17 6-28 22-27 16 1 23 16 14 28-6 8-17 8-18 20m-1 17h1" />
    </svg>
  )
}

function LongBeanBird() {
  return (
    <svg className="bird-study-svg long-bean" viewBox="0 0 440 280" role="img" aria-label="길쭉하고 털북숭이인 키위새">
      <path className="long-shadow" d="M43 234c92-18 214-18 304 2-74 25-226 24-304-2Z" />
      <path className="long-body" d="M28 161 19 143l15-7-8-18 18-3-2-20 21 4 6-21 20 10 13-19 17 15 18-16 14 18 24-12 9 23 26-5 3 25c41-13 82 4 96 40 17 45-14 88-66 92l-145 1c-63-2-101-37-90-89Z" />
      <path className="long-belly" d="M43 175c28 39 79 51 144 44 45-5 77-22 96-50-7 42-39 66-88 69l-105-1c-37-3-54-22-47-62Z" />
      <circle className="long-eye long-eye-back" cx="249" cy="121" r="20" />
      <circle className="long-eye" cx="278" cy="123" r="22" />
      <circle className="long-pupil" cx="285" cy="123" r="8" />
      <circle className="long-pupil" cx="255" cy="121" r="7" />
      <path className="long-beak-top" d="M292 143c61 4 104 22 137 54-51-7-96-19-143-37Z" />
      <path className="long-beak-bottom" d="m286 160 143 37c-55 1-101-6-149-23Z" />
      <path className="long-feet" d="M104 228c1 21-6 31-23 37m24-19 19 14m74-32c3 20-2 31-18 39m19-21 19 12" />
    </svg>
  )
}

function BeanMarks() {
  return (
    <svg className="bird-study-svg bean-marks" viewBox="0 0 390 300" role="img" aria-label="간단한 도형으로 만든 키위새 세 마리">
      <g className="bean bean-one">
        <path d="M38 199c0-57 25-113 67-113 43 0 68 55 68 113 0 42-27 66-68 66s-67-24-67-66Z" />
        <circle cx="123" cy="131" r="7" /><path className="bean-beak" d="m134 145 72 8-72 15Z" /><path className="bean-leg" d="M82 260v25m44-25v25" />
      </g>
      <g className="bean bean-two">
        <path d="M204 186c0-66 26-132 70-132 45 0 70 65 70 132 0 48-28 75-70 75-43 0-70-27-70-75Z" />
        <circle cx="289" cy="101" r="7" /><path className="bean-beak" d="m300 115 67-35-58 51Z" /><path className="bean-leg" d="M252 256v29m45-29v29" />
      </g>
    </svg>
  )
}

function WhiteSproutBird() {
  return (
    <svg className="bird-study-svg white-sprout" viewBox="0 0 360 310" role="img" aria-label="새싹을 닮은 흰 키위새">
      <defs><linearGradient id="sprout-white" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#dfe8e1" /></linearGradient></defs>
      <ellipse className="sprout-shadow" cx="161" cy="270" rx="98" ry="15" />
      <path className="sprout-body" d="M57 198c0-63 42-117 101-129 10-37 35-54 69-52-14 17-16 36-6 56 45 18 72 58 72 107 0 68-50 90-125 90-68 0-111-21-111-72Z" />
      <path className="sprout-leaf" d="M164 69c-12-36 5-59 40-69 5 28-8 52-40 69Z" />
      <path className="sprout-wing" d="M90 178c17-39 52-55 91-39-25 22-37 54-34 91-34-1-53-20-57-52Z" />
      <circle className="sprout-eye" cx="236" cy="119" r="8" />
      <path className="sprout-beak" d="M248 133c45-3 78 7 104 29-38 14-73 10-107-8Z" />
      <path className="sprout-leg" d="M129 256v28m69-31v31m-91 1h27m42 0h28" />
    </svg>
  )
}

function RoadRunnerBird() {
  return (
    <svg className="bird-study-svg road-runner" viewBox="0 0 420 300" role="img" aria-label="달리는 여행자 키위새">
      <path className="runner-speed speed-one" d="M5 138h96" /><path className="runner-speed speed-two" d="M27 166h68" />
      <path className="runner-body" d="M83 174c12-59 73-97 154-88 69 8 106 45 94 93-12 50-67 75-143 65-75-10-116-32-105-70Z" />
      <path className="runner-neck" d="M239 104c22-45 51-63 87-49 30 12 37 41 17 68-19 26-53 30-88 10Z" />
      <circle className="runner-eye" cx="318" cy="78" r="8" />
      <path className="runner-beak" d="M332 90c39 0 68 11 88 31-34 9-63 4-94-14Z" />
      <path className="runner-scarf" d="M259 112c-38 13-76 9-113-10l13 27c35 15 68 17 101 4Z" />
      <path className="runner-scarf-tail" d="m157 111-58-23 30 42Z" />
      <path className="runner-leg" d="m177 230-35 48m42-33 28 34m54-48-15 47m14-30 39 17" />
      <path className="runner-pack" d="M104 136c5-27 27-40 57-31l20 71-80 7Z" />
    </svg>
  )
}

function FruitSuitBird() {
  return (
    <svg className="bird-study-svg fruit-suit" viewBox="0 0 360 320" role="img" aria-label="키위 열매 옷을 입은 키위새">
      <defs>
        <radialGradient id="fruit-flesh" cx="43%" cy="42%" r="58%"><stop stopColor="#f6ffc1" /><stop offset=".28" stopColor="#c9f466" /><stop offset="1" stopColor="#80bd43" /></radialGradient>
      </defs>
      <ellipse className="fruit-shadow" cx="161" cy="284" rx="102" ry="14" />
      <ellipse className="fruit-rind" cx="158" cy="169" rx="116" ry="108" />
      <ellipse className="fruit-flesh" cx="158" cy="169" rx="94" ry="87" />
      <ellipse className="fruit-core" cx="158" cy="169" rx="31" ry="47" />
      <g className="fruit-seeds"><circle cx="158" cy="105" r="6" /><circle cx="198" cy="116" r="6" /><circle cx="221" cy="150" r="6" /><circle cx="216" cy="191" r="6" /><circle cx="191" cy="222" r="6" /><circle cx="151" cy="232" r="6" /><circle cx="113" cy="215" r="6" /><circle cx="92" cy="180" r="6" /><circle cx="96" cy="140" r="6" /><circle cx="119" cy="112" r="6" /></g>
      <circle className="fruit-head" cx="236" cy="103" r="53" />
      <circle className="fruit-eye" cx="251" cy="88" r="7" />
      <path className="fruit-beak" d="M272 105c37 2 64 13 83 31-32 8-59 3-88-13Z" />
      <path className="fruit-leg" d="M119 264v26m74-27v27m-96 1h28m46 0h29" />
    </svg>
  )
}

function PaperPuppetBird() {
  return (
    <svg className="bird-study-svg paper-puppet" viewBox="0 0 380 310" role="img" aria-label="종이 인형 키위새">
      <ellipse className="puppet-shadow" cx="168" cy="273" rx="105" ry="13" />
      <polygon className="puppet-tail" points="49,170 98,121 112,194" />
      <ellipse className="puppet-body" cx="168" cy="177" rx="91" ry="75" transform="rotate(8 168 177)" />
      <circle className="puppet-head" cx="247" cy="111" r="52" />
      <polygon className="puppet-wing" points="102,169 172,127 191,222" />
      <circle className="puppet-pin pin-wing" cx="169" cy="177" r="8" />
      <circle className="puppet-pin pin-neck" cx="224" cy="135" r="8" />
      <circle className="puppet-eye" cx="263" cy="96" r="7" />
      <polygon className="puppet-beak" points="280,112 373,145 276,134" />
      <path className="puppet-leg" d="m132 235-9 47m89-43 10 43" />
      <circle className="puppet-pin" cx="132" cy="236" r="7" /><circle className="puppet-pin" cx="211" cy="238" r="7" />
    </svg>
  )
}

function PixelBird() {
  return (
    <svg className="bird-study-svg pixel-bird" viewBox="0 0 360 310" role="img" aria-label="픽셀 아트 키위새">
      <g className="pixel-shadow"><rect x="74" y="263" width="208" height="14" /><rect x="103" y="277" width="150" height="8" /></g>
      <g className="pixel-body">
        <rect x="73" y="108" width="30" height="119" /><rect x="103" y="78" width="30" height="179" /><rect x="133" y="63" width="90" height="194" /><rect x="223" y="78" width="30" height="164" /><rect x="253" y="108" width="30" height="104" />
      </g>
      <g className="pixel-wing"><rect x="103" y="153" width="30" height="60" /><rect x="133" y="168" width="30" height="60" /><rect x="163" y="183" width="30" height="45" /></g>
      <rect className="pixel-eye" x="223" y="108" width="17" height="17" />
      <g className="pixel-beak"><rect x="270" y="132" width="75" height="15" /><rect x="253" y="147" width="62" height="15" /></g>
      <g className="pixel-leg"><rect x="128" y="242" width="15" height="31" /><rect x="218" y="233" width="15" height="40" /><rect x="103" y="272" width="55" height="11" /><rect x="202" y="272" width="55" height="11" /></g>
      <path className="pixel-cursor" d="m27 51 50 21-21 7 14 28-14 7-14-28-15 15Z" />
    </svg>
  )
}

const birds = [
  { id: 'A', name: 'Field Sketch', kind: 'HAND DRAWN', note: '굽은 자세, 거친 깃털 선, 호기심 많은 표정. 경력마다 새로운 것을 발견하는 탐험가.', className: 'bird-card-sketch', visual: <FieldSketchBird /> },
  { id: 'B', name: 'Long Bean', kind: 'COMIC CREATURE', note: '추천 · 납작하고 긴 몸, 아주 긴 부리, 큰 눈을 과장한 개성 강한 코믹 캐릭터.', className: 'bird-card-long', visual: <LongBeanBird /> },
  { id: 'C', name: 'Bean Marks', kind: 'ICON SYSTEM', note: '배 모양 몸과 막대 다리만 남긴 초간단 심볼. 방향과 자세를 다양하게 만들기 쉽습니다.', className: 'bird-card-bean', visual: <BeanMarks /> },
  { id: 'D', name: 'White Sprout', kind: 'BRAND MASCOT', note: '흰 몸이 위로 자라 새싹이 된 실루엣. whitekiwi라는 이름을 가장 독자적으로 해석.', className: 'bird-card-sprout', visual: <WhiteSproutBird /> },
  { id: 'E', name: 'Road Runner', kind: 'ADVENTURE', note: '수평으로 기울어진 몸, 달리는 다리, 스카프와 가방. 여정과 배달 장면에 최적화.', className: 'bird-card-runner', visual: <RoadRunnerBird /> },
  { id: 'F', name: 'Fruit Suit', kind: 'ABSURD CUTE', note: '키위 열매가 몸이고 새의 머리가 붙은 엉뚱한 설정. 기억에 남는 밈 같은 주인공.', className: 'bird-card-fruit', visual: <FruitSuitBird /> },
  { id: 'G', name: 'Paper Puppet', kind: 'KINETIC COLLAGE', note: '원·삼각형·핀으로 조립한 종이 인형. 관절을 실제로 움직이는 애니메이션에 적합.', className: 'bird-card-puppet', visual: <PaperPuppetBird /> },
  { id: 'H', name: 'Pixel Kiwi', kind: 'DEVELOPER MODE', note: '8비트 픽셀로 만든 키위새. 커서와 코드 세계를 여행하는 개발자 캐릭터.', className: 'bird-card-pixel', visual: <PixelBird /> },
]

export default function BirdLab() {
  return (
    <main className="bird-lab-page">
      <header className="bird-lab-header">
        <a href="/" className="bird-wordmark">whitekiwi®</a>
        <span>CHARACTER STUDY · ROUND 02</span>
        <a href="/?view=glass">BACK TO THE EGG ↗</a>
      </header>

      <section className="bird-lab-intro">
        <p>THE MAIN CHARACTER</p>
        <h1>같은 새 말고,<br />다른 세계관 여덟 개.</h1>
        <p className="bird-intro-copy">몸의 비율부터 선, 재료, 움직임 방식까지 전부 다르게 잡았습니다. 색이 아니라 실루엣으로 골라주세요.</p>
      </section>

      <section className="bird-study-grid">
        {birds.map((bird) => (
          <article className={`bird-study-card ${bird.className}`} key={bird.id}>
            <div className="bird-study-meta"><span>{bird.id}</span><span>{bird.kind}</span></div>
            <div className="bird-study-visual">{bird.visual}</div>
            <div className="bird-study-copy"><h2>{bird.name}</h2><p>{bird.note}</p></div>
          </article>
        ))}
      </section>

      <footer className="bird-lab-footer">
        <span>CHOOSE A WORLD</span>
        <p>이제는 색이 아니라 실루엣으로 고를 수 있습니다. 하나를 고르면 그 세계관으로 표정과 움직임을 확장합니다.</p>
      </footer>
    </main>
  )
}
