import './bird-lab.css'

function TallWildBird() {
  return (
    <svg className="bird-study-svg tall-wild" viewBox="0 0 400 430" role="img" aria-label="키가 큰 자연형 키위새">
      <defs>
        <radialGradient id="wild-tall-body" cx="37%" cy="20%" r="86%"><stop stopColor="#a9876a" /><stop offset=".62" stopColor="#735340" /><stop offset="1" stopColor="#4a362e" /></radialGradient>
        <pattern id="tall-feather-pattern" width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(16)"><path d="M0 7h13" stroke="#e4c6a1" strokeWidth="2" opacity=".25" /></pattern>
      </defs>
      <ellipse className="tall-wild-shadow" cx="190" cy="395" rx="105" ry="14" />
      <path className="tall-wild-body" d="M91 303c-5-67 19-139 78-192 7-42 37-68 77-62 44 6 66 50 45 87-6 11-15 19-26 25 30 55 39 126 9 178-25 44-76 58-121 39-39-17-59-41-62-75Z" />
      <path className="tall-wild-feathers" d="M91 303c-5-67 19-139 78-192 7-42 37-68 77-62 44 6 66 50 45 87-6 11-15 19-26 25 30 55 39 126 9 178-25 44-76 58-121 39-39-17-59-41-62-75Z" />
      <path className="tall-wild-beak" d="M268 105c54 0 95 15 126 46-52 4-96-6-139-29Z" />
      <circle className="tall-wild-eye" cx="249" cy="89" r="8" /><circle className="tall-wild-glint" cx="251" cy="87" r="2.4" />
      <path className="tall-wild-whisker" d="m247 116 28 13m-31-7 24 19" />
      <path className="tall-wild-leg" d="M146 356v39m78-43v43m-102 1h30m49 0h30" />
      <path className="tall-wild-strokes" d="m143 155 22 12m-33 11 25 9m-33 18 26 5m-35 28 29 1m-31 29 31-4m-24 37 30-9m-11 42 27-17m41-162 24 11m-15 22 27 8m-18 21 28 5m-20 28 27 1m-26 29 28-5m-28 34 24-10" />
    </svg>
  )
}

function WhiteGentleBird() {
  return (
    <svg className="bird-study-svg white-gentle" viewBox="0 0 400 430" role="img" aria-label="키가 큰 흰색 키위새">
      <defs><linearGradient id="gentle-body" x1=".2" x2=".9" y1="0" y2="1"><stop stopColor="#fff" /><stop offset=".65" stopColor="#eef1ee" /><stop offset="1" stopColor="#cbd4ce" /></linearGradient></defs>
      <ellipse className="gentle-shadow" cx="185" cy="395" rx="105" ry="15" />
      <path className="gentle-body" d="M91 311c-1-79 28-164 91-210 11-36 42-57 76-46 36 11 52 51 34 83-7 12-17 20-30 26 26 55 29 125 2 175-24 45-72 58-115 39-36-16-58-38-58-67Z" />
      <path className="gentle-sprout" d="M196 87c-17-40 0-68 41-81 3 33-10 60-41 81Zm28 2c8-37 33-53 68-47-14 29-35 45-68 47Z" />
      <path className="gentle-wing" d="M112 249c10-56 43-91 91-92-19 45-22 93-5 144-44 10-75-7-86-52Z" />
      <path className="gentle-beak" d="M276 117c50-2 90 11 122 38-47 10-90 2-129-20Z" />
      <circle className="gentle-eye" cx="260" cy="99" r="8" />
      <circle className="gentle-cheek" cx="270" cy="132" r="8" />
      <path className="gentle-leg" d="M139 362v34m83-37v37m-107 1h30m52 0h31" />
    </svg>
  )
}

function BeanpoleBird() {
  return (
    <svg className="bird-study-svg beanpole" viewBox="0 0 400 430" role="img" aria-label="세로로 긴 미니멀 키위새">
      <ellipse className="beanpole-shadow" cx="190" cy="399" rx="91" ry="11" />
      <path className="beanpole-body" d="M120 320c0-96 25-257 91-257 67 0 92 160 92 257 0 47-36 70-92 70-55 0-91-23-91-70Z" />
      <circle className="beanpole-eye" cx="239" cy="117" r="8" />
      <path className="beanpole-beak" d="M251 132c59-3 105 9 143 36-56 11-105 5-149-17Z" />
      <path className="beanpole-leg" d="M170 378v31m82-31v31" />
      <circle className="beanpole-button button-one" cx="180" cy="213" r="5" /><circle className="beanpole-button button-two" cx="180" cy="239" r="5" />
    </svg>
  )
}

function KiwiScoutBird() {
  return (
    <svg className="bird-study-svg kiwi-scout" viewBox="0 0 400 430" role="img" aria-label="키가 큰 여행자 키위새">
      <ellipse className="scout-shadow" cx="190" cy="399" rx="111" ry="13" />
      <path className="scout-pack" d="M79 185c-21 18-29 57-19 117l72-3 8-130c-24-7-44-2-61 16Z" />
      <path className="scout-body" d="M102 304c-2-78 29-165 92-207 13-35 43-53 75-41 36 14 48 54 26 84-8 10-18 18-30 23 25 56 27 126-2 177-25 44-72 56-114 36-32-16-47-38-47-72Z" />
      <path className="scout-hat" d="M188 75c12-48 44-67 91-52l-10 45c-32-11-59-9-81 7Z" />
      <path className="scout-hat-brim" d="M174 76c38-18 82-15 132 8" />
      <path className="scout-scarf" d="M207 153c29 12 60 13 92 3l-10 27c-29 7-57 4-83-9Z" />
      <path className="scout-scarf-tail" d="m285 176 40 37-48-9Z" />
      <path className="scout-beak" d="M279 117c49 0 88 13 118 40-48 7-90-2-126-23Z" />
      <circle className="scout-eye" cx="262" cy="98" r="8" />
      <path className="scout-leg" d="M150 360v37m81-40v40m-105 1h30m50 0h31" />
      <path className="scout-map" d="M105 225 156 211l47 16-49 17Z" />
    </svg>
  )
}

function StiltBird() {
  return (
    <svg className="bird-study-svg stilt-bird" viewBox="0 0 400 430" role="img" aria-label="긴 다리를 가진 키위새">
      <ellipse className="stilt-shadow" cx="194" cy="402" rx="112" ry="11" />
      <path className="stilt-body" d="M93 153c0-58 45-98 112-98 65 0 109 37 109 91 0 55-43 91-111 91-66 0-110-31-110-84Z" />
      <path className="stilt-beak" d="M283 123c48-1 85 12 114 39-44 10-83 2-120-20Z" />
      <circle className="stilt-eye" cx="267" cy="106" r="9" />
      <path className="stilt-leg leg-left" d="M150 220c-8 55-10 110-6 168m0 0-33 14m33-14 27 13" />
      <path className="stilt-leg leg-right" d="M241 219c12 57 15 113 9 169m0 0-29 13m29-13 31 13" />
      <path className="stilt-knee" d="m145 303 17 12m87-8-16 12" />
      <path className="stilt-tuft" d="M166 67c-1-31 15-48 48-51-6 25-22 42-48 51Z" />
    </svg>
  )
}

function FruitTotemBird() {
  return (
    <svg className="bird-study-svg fruit-totem" viewBox="0 0 400 430" role="img" aria-label="키위 열매 모양의 키 큰 키위새">
      <defs><radialGradient id="totem-flesh" cx="45%" cy="38%" r="62%"><stop stopColor="#f7ffc4" /><stop offset=".25" stopColor="#c8f268" /><stop offset="1" stopColor="#7cb840" /></radialGradient></defs>
      <ellipse className="totem-shadow" cx="185" cy="400" rx="103" ry="13" />
      <path className="totem-rind" d="M84 304c0-93 29-240 104-240 76 0 105 146 105 240 0 54-41 85-105 85S84 358 84 304Z" />
      <path className="totem-flesh" d="M106 296c0-78 23-202 82-202 60 0 83 123 83 202 0 45-33 69-83 69s-82-24-82-69Z" />
      <ellipse className="totem-core" cx="188" cy="229" rx="25" ry="50" />
      <g className="totem-seeds"><circle cx="188" cy="143" r="6" /><circle cx="226" cy="157" r="6" /><circle cx="246" cy="194" r="6" /><circle cx="240" cy="242" r="6" /><circle cx="219" cy="286" r="6" /><circle cx="187" cy="315" r="6" /><circle cx="155" cy="286" r="6" /><circle cx="133" cy="242" r="6" /><circle cx="130" cy="194" r="6" /><circle cx="150" cy="157" r="6" /></g>
      <circle className="totem-eye" cx="239" cy="106" r="7" />
      <path className="totem-beak" d="M251 119c57-2 103 10 143 39-57 10-107 4-149-19Z" />
      <path className="totem-leg" d="M147 375v25m83-25v25m-104 1h27m55 0h28" />
    </svg>
  )
}

function PaperMarionetteBird() {
  return (
    <svg className="bird-study-svg paper-marionette" viewBox="0 0 400 430" role="img" aria-label="키가 큰 종이 인형 키위새">
      <ellipse className="marionette-shadow" cx="186" cy="401" rx="105" ry="12" />
      <polygon className="marionette-body" points="115,340 151,113 270,163 267,343" />
      <circle className="marionette-head" cx="248" cy="102" r="55" />
      <polygon className="marionette-wing" points="137,218 212,168 216,304" />
      <polygon className="marionette-beak" points="285,107 397,145 281,133" />
      <circle className="marionette-eye" cx="264" cy="87" r="7" />
      <circle className="marionette-pin pin-neck" cx="239" cy="146" r="8" /><circle className="marionette-pin pin-wing" cx="206" cy="220" r="8" />
      <path className="marionette-leg" d="m151 337-9 48 17 17m77-65 9 48-15 17" />
      <circle className="marionette-pin" cx="151" cy="338" r="7" /><circle className="marionette-pin" cx="236" cy="338" r="7" />
      <path className="marionette-string" d="M151 113 137 0m111 47 12-47m-54 220L198 0" />
    </svg>
  )
}

function PixelRangerBird() {
  return (
    <svg className="bird-study-svg pixel-ranger" viewBox="0 0 400 430" role="img" aria-label="키가 큰 픽셀 키위새">
      <g className="pixel-ranger-shadow"><rect x="78" y="396" width="223" height="13" /><rect x="119" y="409" width="148" height="8" /></g>
      <g className="pixel-ranger-body"><rect x="119" y="157" width="31" height="207" /><rect x="150" y="95" width="31" height="285" /><rect x="181" y="64" width="93" height="316" /><rect x="274" y="95" width="31" height="253" /></g>
      <g className="pixel-ranger-wing"><rect x="119" y="219" width="31" height="93" /><rect x="150" y="250" width="31" height="93" /><rect x="181" y="281" width="31" height="62" /></g>
      <rect className="pixel-ranger-eye" x="258" y="112" width="17" height="17" />
      <g className="pixel-ranger-beak"><rect x="289" y="143" width="103" height="16" /><rect x="274" y="159" width="87" height="16" /></g>
      <g className="pixel-ranger-leg"><rect x="157" y="364" width="16" height="34" /><rect x="265" y="348" width="16" height="50" /><rect x="126" y="397" width="62" height="11" /><rect x="245" y="397" width="62" height="11" /></g>
      <g className="pixel-ranger-pack"><rect x="88" y="204" width="31" height="111" /><rect x="72" y="235" width="16" height="65" /></g>
      <path className="pixel-ranger-cursor" d="m36 57 54 23-23 7 16 31-15 8-16-31-16 16Z" />
    </svg>
  )
}

const birds = [
  { id: 'A', name: 'Tall Wild', kind: 'NATURAL', note: '작은 머리로 좁아지는 긴 배 모양 몸과 강한 다리. 실제 키위의 비율을 가장 많이 살린 타입.', className: 'bird-card-wild', visual: <TallWildBird /> },
  { id: 'B', name: 'White Gentle', kind: 'SOFT MASCOT', note: '추천 · Milk Glass에서 태어난 듯한 흰 몸, 높은 머리와 키위색 새싹을 가진 부드러운 주인공.', className: 'bird-card-gentle', visual: <WhiteGentleBird /> },
  { id: 'C', name: 'Beanpole', kind: 'MINIMAL ICON', note: '세로로 길게 선 하나의 콩 모양. 가장 단순하지만 키가 큰 인상이 확실한 아이콘형.', className: 'bird-card-beanpole', visual: <BeanpoleBird /> },
  { id: 'D', name: 'Kiwi Scout', kind: 'TRAVELER', note: '모자, 가방, 스카프와 지도를 지닌 장신 여행자. 경력 여정을 직접 이끄는 캐릭터.', className: 'bird-card-scout', visual: <KiwiScoutBird /> },
  { id: 'E', name: 'Stilt Kiwi', kind: 'ABSURD TALL', note: '작은 몸 아래 긴 다리를 과장한 엉뚱한 타입. 걷기와 바이크 장면에서 코믹한 매력이 큽니다.', className: 'bird-card-stilt', visual: <StiltBird /> },
  { id: 'F', name: 'Fruit Totem', kind: 'KIWI WITHIN', note: '세로로 긴 키위 단면 자체가 몸이 된 토템형. 닉네임을 한눈에 기억시키는 방향.', className: 'bird-card-totem', visual: <FruitTotemBird /> },
  { id: 'G', name: 'Marionette', kind: 'PAPER MOTION', note: '길쭉한 종이 조각과 핀으로 조립한 인형. 관절과 부화 연출을 손맛 있게 만들 수 있습니다.', className: 'bird-card-marionette', visual: <PaperMarionetteBird /> },
  { id: 'H', name: 'Pixel Ranger', kind: 'DEVELOPER MODE', note: '높은 픽셀 몸과 배낭을 가진 개발자 모험가. 코드 세계로 전환되는 장면에 강합니다.', className: 'bird-card-ranger', visual: <PixelRangerBird /> },
]

export default function BirdLab() {
  return (
    <main className="bird-lab-page">
      <header className="bird-lab-header">
        <a href="/" className="bird-wordmark">whitekiwi®</a>
        <span>CHARACTER STUDY · ROUND 03</span>
        <a href="/?view=glass">BACK TO THE EGG ↗</a>
      </header>

      <section className="bird-lab-intro">
        <p>THE TALL KIWI</p>
        <h1>이번엔 모두,<br />키가 큰 키위새.</h1>
        <p className="bird-intro-copy">높은 머리, 세로로 긴 몸, 드러난 다리를 공통 조건으로 잡고 현실성부터 엉뚱함까지 다시 넓혔습니다.</p>
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
        <span>FIND THE HEIGHT</span>
        <p>마음에 드는 한 마리가 없어도 괜찮습니다. 몸은 B, 다리는 A, 성격은 D처럼 조합해도 됩니다.</p>
      </footer>
    </main>
  )
}
