import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './egg-lab.css'

function TossfaceEgg() {
  return <span className="lab-tossface" aria-label="토스페이스 달걀 이모지">🥚</span>
}

function FlatEgg() {
  return (
    <svg className="lab-flat" viewBox="0 0 240 280" role="img" aria-label="플랫 그래픽 알">
      <path className="flat-shell" d="M120 18C73 18 37 83 37 158c0 65 31 104 83 104s83-39 83-104c0-75-36-140-83-140Z" />
      <path className="flat-light" d="M82 70c-17 25-25 57-24 90" />
      <circle className="flat-seed flat-seed-one" cx="105" cy="184" r="4" />
      <circle className="flat-seed flat-seed-two" cx="126" cy="195" r="4" />
      <circle className="flat-seed flat-seed-three" cx="145" cy="180" r="4" />
    </svg>
  )
}

function PaperEgg() {
  return (
    <div className="lab-paper" role="img" aria-label="종이를 겹쳐 만든 알">
      <span className="paper-layer paper-back" />
      <span className="paper-layer paper-middle" />
      <span className="paper-layer paper-front" />
      <span className="paper-cut" />
    </div>
  )
}

function GlassEgg() {
  return (
    <div className="lab-glass" role="img" aria-label="투명한 유리 알">
      <span className="glass-core" />
      <span className="glass-glint" />
      <span className="glass-caustic" />
    </div>
  )
}

function KiwiEgg() {
  return (
    <div className="lab-kiwi" role="img" aria-label="키위 열매를 닮은 알">
      <span className="kiwi-flesh" />
      <span className="kiwi-center" />
      <i className="kiwi-seed seed-a" />
      <i className="kiwi-seed seed-b" />
      <i className="kiwi-seed seed-c" />
      <i className="kiwi-seed seed-d" />
      <i className="kiwi-seed seed-e" />
      <i className="kiwi-seed seed-f" />
    </div>
  )
}

function OrbitEgg() {
  return (
    <svg className="lab-orbit" viewBox="0 0 280 280" role="img" aria-label="궤도 속 디지털 알">
      <defs>
        <linearGradient id="orbit-egg-fill" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#8bf3d0" />
          <stop offset="1" stopColor="#5b5ff0" />
        </linearGradient>
      </defs>
      <ellipse className="orbit-line orbit-line-one" cx="140" cy="145" rx="116" ry="47" />
      <ellipse className="orbit-line orbit-line-two" cx="140" cy="145" rx="105" ry="38" />
      <path className="orbit-shell" d="M140 42c-40 0-69 48-69 104 0 53 26 88 69 88s69-35 69-88c0-56-29-104-69-104Z" />
      <circle className="orbit-dot" cx="249" cy="139" r="8" />
      <circle className="orbit-star" cx="61" cy="80" r="3" />
    </svg>
  )
}

function ThreeEgg() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.1, 5.4)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const positions = geometry.attributes.position as THREE.BufferAttribute
    for (let index = 0; index < positions.count; index += 1) {
      const y = positions.getY(index)
      const taper = 0.83 + (1 - y) * 0.08
      positions.setX(index, positions.getX(index) * taper)
      positions.setY(index, y * 1.22 - 0.06 * y * y)
      positions.setZ(index, positions.getZ(index) * taper)
    }
    geometry.computeVertexNormals()

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf3ead7,
      roughness: 0.28,
      metalness: 0,
      clearcoat: 0.72,
      clearcoatRoughness: 0.18,
      sheen: 0.2,
      sheenColor: 0xffc7b4,
    })
    const egg = new THREE.Mesh(geometry, material)
    egg.castShadow = true
    egg.rotation.z = -0.08
    scene.add(egg)

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.ShadowMaterial({ color: 0x2a2540, opacity: 0.18 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -1.3
    floor.receiveShadow = true
    scene.add(floor)

    scene.add(new THREE.HemisphereLight(0xfff7ed, 0x7168d8, 2.1))
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.6)
    keyLight.position.set(-3, 4, 4)
    keyLight.castShadow = true
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0x8cf5d2, 7, 8)
    rimLight.position.set(2.5, -0.5, 2)
    scene.add(rimLight)

    let pointerX = 0
    let pointerY = 0
    let frame = 0
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionPreference.matches
    const onPointerMove = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect()
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5
    }
    mount.addEventListener('pointermove', onPointerMove)

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      if (reducedMotion) renderer.render(scene, camera)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    const clock = new THREE.Clock()
    const render = () => {
      frame = 0
      if (reducedMotion) {
        egg.position.y = 0
        renderer.render(scene, camera)
        return
      }
      const time = clock.getElapsedTime()
      egg.rotation.y += (pointerX * 0.55 - egg.rotation.y) * 0.04
      egg.rotation.x += (-pointerY * 0.3 - egg.rotation.x) * 0.04
      egg.position.y = Math.sin(time * 1.25) * 0.04
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    const onMotionPreferenceChange = () => {
      reducedMotion = motionPreference.matches
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      if (!reducedMotion) clock.start()
      render()
    }
    motionPreference.addEventListener('change', onMotionPreferenceChange)
    render()

    return () => {
      cancelAnimationFrame(frame)
      motionPreference.removeEventListener('change', onMotionPreferenceChange)
      observer.disconnect()
      mount.removeEventListener('pointermove', onPointerMove)
      geometry.dispose()
      material.dispose()
      floor.geometry.dispose()
      ;(floor.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div className="lab-three" ref={mountRef} aria-label="실시간으로 렌더링되는 3D 알" />
}

const concepts = [
  { id: '01', name: 'Tossface Original', kind: 'FONT GLYPH', note: '가장 단순한 기준점. 원본 그대로만 사용.', className: 'concept-tossface', visual: <TossfaceEgg /> },
  { id: '02', name: 'Kiwi Signal', kind: '2D VECTOR', note: '키위색과 씨앗을 숨긴 가장 캐릭터다운 후보.', className: 'concept-flat', visual: <FlatEgg /> },
  { id: '03', name: 'Paper Hatch', kind: 'CSS COLLAGE', note: '찢어지고 펼쳐지는 부화 연출에 강한 종이 조형.', className: 'concept-paper', visual: <PaperEgg /> },
  { id: '04', name: 'Glass Life', kind: 'CSS MATERIAL', note: '안의 생명을 미리 보여주는 반투명 유리 오브제.', className: 'concept-glass', visual: <GlassEgg /> },
  { id: '05', name: 'Kiwi Within', kind: 'CSS ILLUSTRATION', note: '알과 키위 열매를 하나의 세계관으로 합친 시그니처.', className: 'concept-kiwi', visual: <KiwiEgg /> },
  { id: '06', name: 'Soft Object', kind: 'THREE.JS / WEBGL', note: '빛과 시점에 반응하는 실제 3D 알. 여행의 주인공 후보.', className: 'concept-three', visual: <ThreeEgg /> },
  { id: '07', name: 'Origin Portal', kind: 'SVG MOTION', note: '개발자 포트폴리오다운 디지털 기원과 여정의 문.', className: 'concept-orbit', visual: <OrbitEgg /> },
]

export default function EggLab() {
  return (
    <main className="egg-lab">
      <header className="lab-header">
        <a href="/" className="lab-wordmark">whitekiwi®</a>
        <span>EGG DESIGN STUDY</span>
        <a href="/" className="lab-close">CLOSE ×</a>
      </header>

      <section className="lab-intro">
        <p>THE ORIGIN OBJECT</p>
        <h1>어떤 알에서<br />태어날까요?</h1>
        <span>같은 알을 다듬은 시안이 아니라, 재질과 제작 방식부터 다른 일곱 가지 출발점입니다.</span>
      </section>

      <section className="concept-grid">
        {concepts.map((concept) => (
          <article className={`concept-card ${concept.className}`} key={concept.id}>
            <div className="concept-meta">
              <span>{concept.id}</span>
              <span>{concept.kind}{concept.className === 'concept-glass' && <a href="/labs/glass">VIEW 6 STUDIES ↗</a>}</span>
            </div>
            <div className="concept-visual">{concept.visual}</div>
            <div className="concept-copy">
              <h2>{concept.name}</h2>
              <p>{concept.note}</p>
            </div>
          </article>
        ))}
      </section>

      <footer className="lab-footer">
        <p>마음에 드는 번호를 고르면, 그 알 하나를 부화 가능한 최종 캐릭터로 발전시킵니다.</p>
        <small>01은 토스팀의 Tossface 원본 글리프이며 비교 목적으로 변경 없이 사용했습니다. © Viva Republica</small>
      </footer>
    </main>
  )
}
