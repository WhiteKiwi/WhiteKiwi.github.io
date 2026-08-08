import './fall-intro.css'

function FallingEgg() {
  return (
    <div className="falling-egg-rig" role="img" aria-label="유리 하늘을 계속 낙하하는 흰색 유리 알">
      <div className="egg-wake" aria-hidden="true"><i /><i /><i /></div>
      <div className="falling-egg">
        <span className="falling-shell" />
        <span className="falling-shell-glint" />
        <span className="falling-shell-rim" />
      </div>
      <span className="air-ring air-ring-one" />
      <span className="air-ring air-ring-two" />
    </div>
  )
}

const clouds = [
  ['cloud-a', 'cloud-near'], ['cloud-b', 'cloud-far'], ['cloud-c', 'cloud-mid'],
  ['cloud-d', 'cloud-near'], ['cloud-e', 'cloud-far'], ['cloud-f', 'cloud-mid'],
]

export default function FallIntro() {
  return (
    <main className="fall-intro">
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

      <FallingEgg />
      <div className="fall-vignette" aria-hidden="true" />
    </main>
  )
}
