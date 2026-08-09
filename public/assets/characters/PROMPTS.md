# Character prompts

Built-in ImageGen mode was used with `public/assets/characters/kiwi-walk-cycle.png` as an identity reference.

Generated asset: `public/assets/characters/kiwi-toss-developer.png`. The flat chroma-key background was removed locally to produce the final transparent PNG; the asset is not wired into a page yet.

공통 규칙:

- 갈색 몸, 두꺼운 다크 코코아 아웃라인, 긴 황금색 부리, 작은 검은 눈, 가는 다리와 세 갈래 발
- 소품과 의상 색은 해당 챕터의 브랜드 색을 따른다
- 투명 배경, 배경 장식 없음, 단일 캐릭터

## 07 — Toss / Toss Income, developer

```text
Use case: character-illustration
Asset type: transparent-background character illustration for the whitekiwi developer portfolio
Input image: Image 1 is an identity reference only; keep exactly the same brown kiwi bird — tall rounded body, thick dark cocoa outline, very long golden-yellow curved beak, one tiny dark round eye, thin dark legs with three-toed golden feet, soft hand-painted texture inside the flat shapes.
Primary request: create the developer version of this kiwi, sitting and writing code on a laptop.
Subject: the kiwi sits on the floor with legs folded forward, an open laptop resting on its lap; the beak points right and slightly down toward the screen; one wing rests on the keyboard; the laptop screen faces the viewer at a slight angle and shows three short abstract code lines and a single blinking cursor block, no readable text; small over-ear headphones sit on the head, the beak passing freely beneath them.
Style/medium: editorial hand-drawn character illustration, flat shapes with subtle internal texture and a consistent thick outline, warm and approachable but not childish; identical rendering technique to the reference.
Composition/framing: single full-body character, centered, three-quarter seated view, generous transparent padding on all sides, no ground shadow.
Color palette: warm chestnut brown body, dark cocoa outline, golden ochre beak and feet, Toss Blue #0064FF headphones and laptop lid, Toss Gray #202632 screen bezel, off-white screen with #0064FF cursor block.
Constraints: transparent background; one character only; no text; no letters; no logos; no brand marks on the laptop; no desk; no chair; no mug; no plants; no mockup; no watermark.
Avoid: photorealism, 3D rendering, glossy highlights, drop shadows, kawaii blush cheeks, glasses, multiple poses, character sheet, background scenery.
```

## Contact — peeking kiwi (오답 반응용)

터미널 상단 테두리 위로 빼꼼 올라왔다 내려가는 연출에 쓴다. 기존 보행 스프라이트는 측면 전신이라
머리만 잘라 쓰면 부리 방향과 잘린 단면이 어색해서 별도 자산이 필요하다.

```text
Use case: character-illustration
Asset type: transparent-background character illustration for the whitekiwi developer portfolio
Input image: Image 1 is an identity reference only; keep exactly the same brown kiwi bird — thick dark cocoa outline, very long golden-yellow curved beak, one tiny dark round eye, soft hand-painted texture inside the flat shapes.
Primary request: create a peeking version of this kiwi, seen as if it has just popped its head up over a straight horizontal edge.
Subject: only the top of the head, the upper curve of the body, both eyes area and the long golden beak; the body is cut off flat at the bottom of the frame by a perfectly straight horizontal line, as if hidden behind a ledge; the kiwi faces the viewer at a slight three-quarter angle with the beak angled gently to the right and slightly down; the expression is curious and a little sheepish, made only with the eye shape and beak angle.
Style/medium: editorial hand-drawn character illustration, flat shapes with a consistent thick outline, identical rendering technique to the reference.
Composition/framing: the character fills the horizontal centre of the frame and is cropped by the bottom edge; transparent padding on the left, right and top; no ground shadow.
Color palette: warm chestnut brown body, dark cocoa outline, golden ochre beak, near-black eye.
Constraints: uniform #00ff00 chroma-key background for alpha extraction; one character only; the bottom cut must be a single straight horizontal line with no feet, legs or body below it; no text; no letters; no props; no speech bubble; no mockup; no watermark.
Avoid: photorealism, 3D rendering, glossy highlights, drop shadows, kawaii blush cheeks, full body, side profile, multiple poses, character sheet, background scenery.
```

Generated asset path: `public/assets/characters/kiwi-peek.png`.
