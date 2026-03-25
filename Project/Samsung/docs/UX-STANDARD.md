# AI 주도형 UX/UI 표준 가이드 v2.0

> **[System Directive for AI]**
> 너는 메니인소프트 정보보호포털의 프론트엔드 코드를 생성하는 'UX/UI Core Guardian'이다. 
> 본 문서에 정의된 모든 규칙(Rules), 제약(Constraints), 명명 규칙(Naming Conventions), 변수(Tokens)는 절대적인 기준이다. 신규 UI/UX 생성 시 반드시 이 문서의 뼈대와 물리 법칙을 상속받아 코드를 작성하라.

---

## 1. Design Tokens & Theme Constraints (디자인 토큰)

### 1.0 전제 — Primary(메인 브랜드 컬러)는 **고객사·빌드마다 바뀐다**

- **메인 컬러 = `--color-primary`**. 솔루션 전역의 “브랜드 축”은 이 변수(와 아래 **Primary 파생** 변수들)로만 표현한다.
- **서술 vs 코드 블록:** 본문 표·절에서는 **토큰 이름·역할**을 우선 쓴다. **HEX·rgba 등 픽셀 기준값**은 **§1.13 참조 `:root` 스냅샷** 코드 블록에만 모아 둔다. 레포에 전역 CSS가 없을 때는 그 블록을 그대로 붙여 넣고, 있으면 해당 `:root`와 동기화한다.
- **동작 보장 (컴포넌트):** 화면·컴포넌트 CSS/마크업에는 **항상 `var(--토큰이름)`만** 쓴다 (§1.11). Primary만 `:root`에서 바꿔도 대비 관계가 유지되게 한다.
- **기준값 위치:** 토큰의 **참조 기본값**은 §1.13과 동일한 내용이어야 한다. Samsung HTML 프로젝트에서는 `Project/Samsung/html/style.css` 맨 위 `:root`가 그 사본 역할을 한다.

---

### 1.1 고객사 전환 시 인간 체크리스트 (Primary 갈아끼우기)

1. **`--color-primary`** 를 해당 고객사 브랜드 메인으로 설정한다.
2. **`--color-primary-hover`** 는 Primary보다 한 단계 어두운(또는 디자인 시스템이 정한) 호버 전용으로 둔다.
3. **불투명도 스케일** `--color-primary-80` / `-60` / `-40` / `-20` / `-10` / `-5` 는 **모두 동일 브랜드 RGB에 대한 알파 단계**(100%는 `--color-primary` 본색)다. Primary를 바꾸면 이 여섯 단계도 **같은 비율로 전부 다시 맞춘다**. **`--color-primary-border`** 는 구현상 보통 `--color-primary-20` 과 동일 계열로 둔다.
4. **`--color-primary-bg`** 는 `--color-primary-10` 을 가리키는 별칭이다. 연한 브랜드 면은 **`--color-primary-bg`** 또는 **`--color-primary-10` / `-5`** 등 맥락에 맞는 단계만 쓴다.
5. **Primary 톤이 들어간 고정 별칭** (`--color-card-accent` 등)은 브랜드가 바뀌면 시각적으로 어색할 수 있으므로, `:root`에서 **고객사에 맞게 재조정**한다.
6. **`--color-logo`**, **`--color-button-primary-hover`** 처럼 **다른 토큰을 가리키는 별칭**은, 브랜드 정책에 따라 Primary로 바꿀지 여부를 검토한다 (문서상 의미만 정의하고, 매핑은 구현에서 결정).

---

### 1.2 Primary 계열 (브랜드 스케일 — 의미만)

**표준 단계:** 본색 **100%** + 알파 **80% / 60% / 40% / 20% / 10% / 5%** (`--color-primary-80` … `-5`). 중간 농도가 필요하면 60·40을, 테두리·옅은 틴트는 20·10·5를 우선 쓴다.

| CSS 변수 | 단계(개념) | 의미·용도 |
|----------|------------|-----------|
| `--color-primary` | 100% | **메인 브랜드 본색**. Primary 버튼·활성 탭·강조 아이콘·키보드 Focus 아웃라인 등 |
| `--color-primary-80` | 80% | 진한 브랜드 틴트·오버레이·보조 강조 |
| `--color-primary-60` | 60% | 중간 진하기 텍스트·아이콘·구분 면 |
| `--color-primary-40` | 40% | 중간 옅은 틴트·비활성에 가까운 브랜드 톤 |
| `--color-primary-20` | 20% | 연한 틴트·**기본 브랜드 테두리**에 가까운 농도 |
| `--color-primary-10` | 10% | 선택 행·칩·호버 배경 등 **밝은 브랜드 면** |
| `--color-primary-5` | 5% | 가장 옅은 브랜드 배경 틴트 |
| `--color-primary-hover` | (별도) | Primary 컨트롤 호버 — 디자인 시스템이 정한 **한 단계 어두운 본색**(알파 스케일과 별개로 둘 수 있음) |
| `--color-primary-border` | (별칭) | 브랜드 톤 테두리. 구현에서는 보통 **`--color-primary-20` 과 동일**하게 둠 |
| `--color-primary-bg` | (별칭) | → **`--color-primary-10`**. “연한 primary 배경” 한 번에 지정 |

> 과거 문서의 “primary-light” 류 표현은 **`--color-primary-10` ~ `-40`** 중 UI 대비에 맞는 단계로 매핑한다.

---

### 1.3 Black (중립·투명도 스케일)

고정 **검정 베이스**에서 투명도만 줄인 스케일. 본문·구분선·비활성 등에 쓴다. **구체 `rgba` 값은 §1.13 `--color-black-*` 행**과 동일하다.

| CSS 변수 | 의미·용도 |
|----------|-----------|
| `--color-black-100` | 가장 진한 본문·타이틀 |
| `--color-black-80` | 보조 텍스트·아이콘 |
| `--color-black-60` | 더 약한 보조 |
| `--color-black-40` | 플레이스홀더·구분 |
| `--color-black-20` | 일반 테두리에 가까운 선 |
| `--color-black-10` | 연한 구분선·배경 틴트 |
| `--color-black-4` | 아주 옅은 면 |

---

### 1.4 White

| CSS 변수 | 의미·용도 |
|----------|-----------|
| `--color-white-100` | 카드·패널·모달 등 순백 면 |

---

### 1.5 Background (화면·표면)

| CSS 변수 | 의미·용도 |
|----------|-----------|
| `--color-bg-base` | 앱 전체 베이스 배경(페이지 뼈대) |
| `--color-bg-subtle` | 표 헤더 등 살짝 들어간 표면 |
| `--color-bg-white` | 카드 내부 등 흰 표면 (`--color-white-100` 과 동일 값으로 두는 것이 일반적) |

---

### 1.6 Text (문자 역할 별칭)

Black 스케일과 같은 계열을 **역할 이름**으로 고정한다.

| CSS 변수 | 의미·용도 |
|----------|-----------|
| `--color-text-primary` | 본문·강조 텍스트 |
| `--color-text-secondary` | 부제·부가 설명 |
| `--color-text-muted` | 비활성·덜 중요한 라벨 |

---

### 1.7 Status 색상 (Figma 디자인 시스템 — **본색 / Light / White** 3단)


의미색은 **색상 패밀리 8종**(Purple, Indigo, Blue, Cyan, Green, Yellow, Orange, Red)마다 아래 **3단계**만 쓴다. **HEX·rgba 값은 §1.13 `--color-status-*` 행**에 있다. 여기서는 **단계별 역할**만 고정한다.

| 단계 | Figma 스와치 이름 | 역할·타이포 권장 |
|------|-------------------|------------------|
| **본색** | `Status-{색}` | 솔리드 **진한** 상태색. 뱃지 글자·아이콘·강조 텍스트·테두리 등 |
| **Light** | `Status-Light-{색}` | **파스텔 솔리드** 배경. **글자는 흰색**(`--color-white-100`) 권장 |
| **White** | `Status-White-{색}` | **가장 옅은** 배경(연한 틴트). **글자는 본문색**(`--color-text-primary`) 권장 |

#### 1.7.1 본색 (Solid)

| CSS 변수 | 용도(예시) |
|----------|------------|
| `--color-status-purple` | 보라 계열 상태 |
| `--color-status-indigo` | 인디고·결재·진행 등 |
| `--color-status-blue` | 정보·보조 강조 |
| `--color-status-cyan` | 시안 강조 |
| `--color-status-green` | 성공·양호 |
| `--color-status-yellow` | 주의 |
| `--color-status-orange` | 경고 |
| `--color-status-red` | 오류·취약 |

#### 1.7.2 Light (파스텔 면 + 밝은 대비)

| CSS 변수 | 용도(예시) |
|----------|------------|
| `--color-status-light-purple` | 보라 Light 배경 |
| `--color-status-light-indigo` | 인디고 Light 배경 |
| `--color-status-light-blue` | 블루 Light 배경 |
| `--color-status-light-cyan` | 시안 Light 배경 |
| `--color-status-light-green` | 그린 Light 배경 |
| `--color-status-light-yellow` | 옐로우 Light 배경 |
| `--color-status-light-orange` | 오렌지 Light 배경 |
| `--color-status-light-red` | 레드 Light 배경 |

#### 1.7.3 White (옅은 배경 + 진한 글자)

| CSS 변수 | 용도(예시) |
|----------|------------|
| `--color-status-white-purple` | 탭·칩·행 배경 등 옅은 보라 틴트 |
| `--color-status-white-indigo` | 옅은 인디고 틴트 |
| `--color-status-white-blue` | 옅은 블루 틴트 |
| `--color-status-white-cyan` | 옅은 시안 틴트 |
| `--color-status-white-green` | 옅은 그린 틴트 |
| `--color-status-white-yellow` | 옅은 옐로우 틴트 |
| `--color-status-white-orange` | 옅은 오렌지 틴트 |
| `--color-status-white-red` | 옅은 레드 틴트 |

#### 1.7.4 레거시 별칭 (`*-10`)

기존 화면 호환용으로 **`--color-status-indigo-10`**, **`--color-status-red-10`**, **`--color-status-green-10`** 이름이 남아 있을 수 있다. 의미는 **White 티어와 동일**(옅은 배경 + 진한 글자 맥락). **신규 코드**에서는 **`--color-status-white-indigo`** 등 **White 계열 이름**을 우선한다.

---

### 1.9 호환·레이아웃용 별칭

다른 토큰을 가리키거나, 자주 쓰는 면·선을 묶은 이름. **새 HEX를 컴포넌트에 직접 쓰지 말고 이쪽을 우선**한다.

| CSS 변수 | 관계(문서상) | 용도 |
|----------|----------------|------|
| `--color-border` | → `--color-black-20` | 일반 테두리 |
| `--color-border-primary` | → `--color-primary` | 메인컬러 테두리 |
| `--color-border-light` | → `--color-black-10` | 연한 테두리 |
| `--color-border-card` | → `--color-bg-base` | 카드와 베이스 경계 |
| `--color-border-panel` | §1.13 → `#e2e8f0` | 패널·슬레이트 느낌 구분선 |
| `--color-card-accent` | §1.13 → `#e3ebf9` | 카드 강조 배경 (브랜드 바뀌면 조정 검토) |
| `--color-emergency` | §1.13 → `#ffd8e0` | 긴급·강조 알림 면 |
| `--color-badge-success` | §1.13 → `#d5f5dd` | 성공 뱃지 배경 |
| `--color-badge-success-text` | → `--color-status-green` | 성공 뱃지 글자 |
| `--color-f1f5f9` | §1.13 → `#f1f5f9` | 유틸 단색 면 |
| `--color-logo` | §1.13 → `var(--color-status-blue)` | 로고·브랜드 마크 톤 |
| `--color-button-primary-hover` | §1.13 → `var(--color-status-indigo)` | 레거시/호환 호버 별칭 |

**일반 테두리**가 필요하면 **`--color-border`** 또는 **`--color-border-panel`** 중 UI 맥락에 맞는 쪽을 쓴다.

---

### 1.10 그림자·모서리 (비색 토큰)

카드·팝오버·버튼·뱃지의 **깊이·라운딩**. 아래는 §1.13과 동일한 **참조 값**이다.

| CSS 변수 | 참조 값 (Samsung §1.13) | 용도 |
|----------|-------------------------|------|
| `--shadow-card` | `0 1px 1.75px rgba(0, 0, 0, 0.05)` | 카드 그림자 |
| `--shadow-popover` | `0 4px 3.5px rgba(0, 0, 0, 0.25)` | 팝오버·플로팅 |
| `--radius-card` | `8px` | 카드·큰 박스 |
| `--radius-button` | `4px` | 버튼 (§3과 동일) |
| `--radius-popover` | `8px` | 팝오버 |
| `--radius-badge` | `4px` | 뱃지 |

---

### 1.11 AI·개발 강제 규칙 (테마 안전)

- **금지:** 브랜드·테두리·배경·상태 표현에 **문자열로 색 숫자를 박는 것** (`#rrggbb`, `rgb(...)`, `rgba(...)` 를 컴포넌트 단 CSS/HTML 스타일에 직접 기입).
- **예외(문서만):** §1.13·§3 등 **본 문서 안의 코드 펜스**에 나온 리터럴은 `:root` 참조용이다. 화면용 CSS에는 **그대로 복사하지 말고** `var(--color-…)` 로만 연결한다.
- **허용:** `var(--color-…)` 만 사용. 예외가 필요하면 **먼저 `:root`(§1.13)에 토큰을 추가**한 뒤 변수로 참조한다.
- **Primary 교체 후 검증:** 전역 검색으로 **이전 고객사 RGB/HEX 리터럴**이 남아 있지 않은지 확인한다.

---

### 1.12 코드 작성 시 한 줄 요약

- **브랜드(가변):** `--color-primary`, `--color-primary-hover`, 알파 단계는 `--color-primary-80`·`-60`·`-40`·`-20`·`-10`·`-5`, 연한 배경 별칭 `--color-primary-bg`
- **글자:** `--color-text-primary` → `--color-text-secondary` → `--color-text-muted`
- **바탕:** `--color-bg-base` / `--color-bg-subtle` / `--color-bg-white`
- **테두리:** `--color-border`, `--color-border-light`, 필요 시 `--color-border-panel`
- **상태:** 패밀리별 **본색 → Light → White** 3단 (`--color-status-{색}`, `--color-status-light-{색}`, `--color-status-white-{색}`). 구 탭용 `*-10`은 White와 동일 용도

### 1.13 참조 `:root` 스냅샷 (Samsung HTML / 전역 CSS 동기화용)

> **정본 파일:** 이 문서와 같은 폴더의 `UX-STANDARD-root.css` (내용은 `Project/Samsung/html/style.css` 1~101행과 동기화). 레포에 전역 CSS가 없으면 아래 블록 또는 해당 `.css` 파일을 그대로 쓴다. **인라인 블록**은 문서만 열었을 때 복사·붙여넣기용이다.

```css
/* 디자인 시스템 CSS 변수 — Figma 디자인 시스템 (Color 2-363) */
/* UX-STANDARD.md §1.13 과 동기화. 원본: Project/Samsung/html/style.css 1~101행 */
:root {
  --font-pretendard: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-family: var(--font-pretendard);
  line-height: 1.5;
  color: #111111;
  background-color: #edf0f4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* ===== Figma Color Scheme — Primary (100% + 80/60/40/20/10/5% 알파 스케일) ===== */
  --color-primary: #13289f;                           /* Primary / 100% */
  --color-primary-80: rgba(19, 40, 159, 0.8);        /* 80% */
  --color-primary-60: rgba(19, 40, 159, 0.6);        /* 60% */
  --color-primary-40: rgba(19, 40, 159, 0.4);        /* 40% */
  --color-primary-20: rgba(19, 40, 159, 0.2);        /* 20% */
  --color-primary-10: rgba(19, 40, 159, 0.1);        /* 10% */
  --color-primary-5: rgba(19, 40, 159, 0.05);       /* 5% */
  --color-primary-hover: #0f2085;                     /* 버튼 호버용 (별도 톤) */
  --color-primary-border: var(--color-primary-20);   /* 테두리 = 20% 단계와 동일 */

  /* ===== Figma Color Scheme — Black ===== */
  --color-black-100: #111111;                         /* Black 100% */
  --color-black-80: rgba(17, 17, 17, 0.8);
  --color-black-60: rgba(17, 17, 17, 0.6);
  --color-black-40: rgba(17, 17, 17, 0.4);
  --color-black-20: rgba(17, 17, 17, 0.2);
  --color-black-10: rgba(17, 17, 17, 0.1);
  --color-black-4: rgba(17, 17, 17, 0.04);

  /* ===== Figma Color Scheme — White ===== */
  --color-white-100: #ffffff;                         /* White 100% */

  /* ===== Figma Color Scheme — Background ===== */
  --color-bg-base: #edf0f4;                           /* bg/EDF0F4 */
  --color-bg-subtle: #f2f4f8;                         /* bg/F2F4F8 */
  --color-bg-white: #ffffff;

  /* ===== Figma Color Scheme — Text (Black 계열) ===== */
  --color-text-primary: #111111;                      /* Black 100% */
  --color-text-secondary: rgba(17, 17, 17, 0.8);      /* Black 80% */
  --color-text-muted: rgba(17, 17, 17, 0.6);         /* Black 60% */

  /* ===== Figma Color (node 2:363) — Status 본색 / Light / White 3단 ===== */
  /* 본색(Solid): 스와치 1열 — 뱃지·아이콘·강조 텍스트 */
  --color-status-purple: #af52de;
  --color-status-indigo: #5856d6;
  --color-status-blue: #007aff;
  --color-status-cyan: #1ea5e4;
  --color-status-green: #0a8529;
  --color-status-yellow: #f1c100;
  --color-status-orange: #ff8400;
  --color-status-red: #e80b38;

  /* Light: 스와치 2열 — 파스텔 솔리드, 흰 글자 대비용 */
  --color-status-light-purple: #b899eb;
  --color-status-light-indigo: #adadfb;
  --color-status-light-blue: #7dbbff;
  --color-status-light-cyan: #a0bce8;
  --color-status-light-green: #71dd8c;
  --color-status-light-yellow: #ffe57d;
  --color-status-light-orange: #ffb55b;
  --color-status-light-red: #ff7b96;

  /* White: 스와치 3열 — 옅은 배경(동일 hue 30% 알파), 진한 본문색 권장 */
  --color-status-white-purple: rgba(184, 153, 235, 0.3);
  --color-status-white-indigo: rgba(173, 173, 251, 0.3);
  --color-status-white-blue: rgba(125, 187, 255, 0.3);
  --color-status-white-cyan: rgba(160, 188, 232, 0.3);
  --color-status-white-green: rgba(113, 221, 140, 0.3);
  --color-status-white-yellow: rgba(255, 229, 125, 0.3);
  --color-status-white-orange: rgba(255, 181, 91, 0.3);
  --color-status-white-red: rgba(255, 123, 150, 0.3);

  /* 호환: 예전 *-10 명칭 = White 티어와 동일 용도(탭·칩 배경 등) */
  --color-status-indigo-10: var(--color-status-white-indigo);
  --color-status-red-10: var(--color-status-white-red);
  --color-status-green-10: var(--color-status-white-green);

  /* ===== 호환용 별칭 ===== */
  --color-primary-bg: var(--color-primary-10);
  --color-border-light: var(--color-black-10);
  --color-border: var(--color-black-20);
  --color-border-card: var(--color-bg-base);
  --color-border-panel: #e2e8f0;
  --color-card-accent: #e3ebf9;
  --color-emergency: #ffd8e0;
  --color-badge-success: #d5f5dd;
  --color-badge-success-text: var(--color-status-green);
  --color-f1f5f9: #f1f5f9;
  --color-logo: var(--color-status-blue);
  --color-button-primary-hover: var(--color-status-indigo);

  /* Shadow & radius */
  --shadow-card: 0 1px 1.75px rgba(0, 0, 0, 0.05);
  --shadow-popover: 0 4px 3.5px rgba(0, 0, 0, 0.25);
  --radius-card: 8px;
  --radius-button: 4px;
  --radius-popover: 8px;
  --radius-badge: 4px;
}
```

---

## 2. Typography & Font Style Rules (폰트 스타일 규칙)

본 절은 `Project/Samsung/html/components/컴포넌트-구조.md` §8과 동일 축이다. 폰트 스택·스무딩은 **§1.13 `:root`** 가 정본이며, Samsung HTML에서는 아래 **`#app` 규칙**으로 Bootstrap 등과 맞춘다.

### 2.1 본문·UI 텍스트 (Pretendard)

- **강제:** 모든 UI 문자열은 **Pretendard** 패밀리만 사용한다. 페이지·컴포넌트 전용 CSS에서 `font-family`를 임의의 웹폰트·시스템 폰트로 바꾸지 않는다.
- **CSS 변수:** `var(--font-pretendard)` — 스택 문자열은 §1.13에 있다.
- **Samsung HTML — `#app` 내부 Pretendard 강제 (Bootstrap 덮어쓰기 방지):**

```css
#app,
#app .btn,
#app .card,
#app .form-control,
#app .form-select,
#app .table,
#app input,
#app select,
#app textarea,
#app .dropdown-menu {
  font-family: var(--font-pretendard) !important;
}
```

- **신규 마크업:** 콘텐츠는 **`#app` 내부**에 두거나, 동일하게 `font-family: var(--font-pretendard)` 를 유지한다.

### 2.2 기본 타이포그래피 (글로벌)

- **기본 줄간격:** `line-height: 1.5` (`:root`와 동일하게 유지).
- **본문 색:** 텍스트 색은 **색상 토큰**과 조합한다 (`--color-text-primary` / `secondary` / `muted`, §1 참고).
- **렌더링:** `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale` 를 깨지 않는다.

### 2.3 아이콘 전용 (Material Symbols)

- **본문 폰트와 분리:** 아이콘은 **Google Material Symbols (Outlined)** 만 사용한다. 본문 `font-family`와 혼동하지 않는다.
- **마크업:** `<span class="material-symbols-outlined" …>아이콘명</span>` (필요 시 `font-variation-settings` 로 FILL 등 조정).
- **상세 금지 사항·대체 규칙:** 아래 **§9 Iconography** 를 따른다.

### 2.4 AI·개발 강제 요약

- **금지:** UI 텍스트에 다른 폰트 패밀리 하드코딩, 아이콘용으로 Material Symbols 외 라이브러리 사용.
- **허용:** `--font-pretendard` 및 Material Symbols 조합. 예외 폰트가 필요하면 **디자인 합의 후 `:root` 토큰 추가**로만 확장한다.

---

## 3. Button Style Rules (버튼 스타일 규칙)

본 절만으로도 **사이즈·패딩·타입·상태·모서리**를 구현할 수 있도록 수치와 시각 규칙을 문장으로 고정한다. **Samsung에서 이미 쓰는 구현 예시는 §3.8** CSS 블록에 수록한다.

### 3.1 사이즈 (2종) — 높이·패딩

버튼은 **Small**과 **Medium** 두 가지 높이만 쓴다. `box-sizing: border-box`를 전제로 한다(테두리가 있는 타입은 높이 안에 테두리 두께가 포함된다).

| 사이즈 | 전체 높이(고정) | 좌우 패딩 | 상·하 패딩 |
|--------|-----------------|-----------|------------|
| **Small** | **24px** | **10px** | **0** |
| **Medium** | **34px** | **15px** | **0** |

- **상·하 패딩 0:** 위아래로 별도 패딩을 주지 않는다. 대신 **`min-height`(또는 `height`)를 위 표와 동일하게 고정**하고, 내부를 **`display: inline-flex` 또는 `flex` + `align-items: center` + `justify-content: center`** 로 채워 텍스트·아이콘을 수직·수평 중앙에 둔다.
- **짧은 라벨:** 라벨이 매우 짧을 때 **`min-width: 60px`**(Medium 기준)을 둔다. §3.8 `.btn-ds`와 동일.
- **표 vs 참조 구현:** §3.1 표는 **목표 스펙**(Small 24px·좌우 10px 등). Samsung `.btn-ds`(§3.8)는 **높이 34px·`padding: 7.5px 12px`** 로 표와 다르다. 정리 시 표에 맞추거나 Small 전용 클래스를 추가한다.

### 3.2 너비 (2가지)

- **콘텐츠·패딩 기준 (Hug):** 기본은 `width: auto`. 라벨 길이·아이콘 유무에 따라 너비가 결정되며, 좌우에는 §3.1의 패딩만큼만 여백이 붙는다.
- **전체 폭:** 폼 하단·모달 푸터 등에서 **한 줄을 꽉 채워야 하면 `width: 100%`** 를 쓴다. 이때도 §3.1의 좌우 패딩·고정 높이·타입별 색 규칙은 그대로 적용한다.

### 3.3 타입·스타일 (3종) — Primary / Black / White 토큰만

버튼의 **배경·글자·테두리·비활성**은 모두 **Primary, Black, White 토큰 family** 안에서만 조합한다 (§1). 컴포넌트 CSS에 **HEX·`rgb()` 숫자 리터럴을 직접 쓰지 않는다.**

아래 세 타입은 이름을 **1st / 2rd / 3rd** 로 부른다(구현 시 클래스·토큰 이름에 그대로 써도 된다).

#### 3.3.1 1st — 솔리드 주요 버튼

- **용도:** 저장, 확인, 로그인 등 화면에서 **가장 중요한 한 가지 행동**에 쓴다. 한 화면에 여러 개를 나란히 두지 않는 것이 일반적이다.
- **Default:** 배경 **`--color-primary`**, 글자·아이콘 **`--color-white-100`**, **굵기 Bold**. 테두리는 없거나 배경과 동일하게 두어 윤곽이 끊기지 않게 한다.
- **Hover:** 배경만 **`--color-primary-hover`** 로 바꾼다. 글자·아이콘은 흰색 유지. 포인터 커서(`cursor: pointer`)는 활성 상태에서만.
- **Disabled:** 클릭 불가(`pointer-events: none` 또는 `disabled` 속성). 배경은 **Black 계열의 옅은 불투명 면**으로 둔다 — 예: **`--color-black-100`에 낮은 불투명도**를 주거나, **`--color-black-20`**에 가까운 단색 면으로 `:root`에 토큰을 정의해 쓴다. 글자·아이콘은 **`--color-white-100`** 을 유지해 “채워진 칩” 형태로 읽히게 한다. 시각적으로는 **채도가 낮고 눌린 느낌**이면 된다.

#### 3.3.2 2rd — 라인(아웃라인) 보조 버튼

- **용도:** 취소 옆의 보조 확인, “다음 단계” 등 **주요 버튼보다 한 단계 약한** 행동.
- **Default:** 배경 **`--color-white-100`** 또는 **`--color-bg-white`**. 테두리는 **1px 실선**, 색 **`--color-primary`** 또는 **`--color-border-primary`**(둘 다 Primary 계열). 글자·아이콘 **`--color-primary`**, **굵기 Regular**.
- **Hover:** 배경을 **`--color-primary-10`**(`--color-primary-bg`와 같은 계열)로 채운다. 테두리 색과 글자 색은 Default와 동일하게 유지해, “흰 바탕에서 살짝 올라온 Primary 틴트”로 보이게 한다.
- **Disabled:** 배경·테두리·글자의 **색 조합은 Default와 동일**하게 두고, **버튼 루트 요소 전체에 불투명도를 낮춘다**(구현 표준: **`opacity: 0.3`** 또는 동일한 시각적 약화를 내는 방식 하나로 프로젝트 전체 통일). 이렇게 하면 테두리·글자가 함께 흐려져 비활성임이 분명해진다.

#### 3.3.3 3rd — 옅은 면(소프트) 보조 버튼

- **용도:** 툴바·필터 줄 등 **밀도 높은 UI**에서 덜 부담스러운 액션.
- **Default:** 배경은 **아주 연한 면**이다. Samsung 참조(§3.8)는 **`--color-bg-subtle`** (`#f2f4f8`, §1.13). 글자·아이콘 **`--color-primary`**, **Regular**. **외곽 테두리는 두지 않는다**(구분은 배경 톤 차이로만).
- **Hover:** 배경을 **`--color-primary-10`** 으로 맞추거나 한 단계 진하게 해서, Default보다 **Primary 성분이 조금 더 보이게** 한다. 글자색은 `--color-primary` 유지.
- **Disabled:** 배경색은 **Default와 동일**하게 유지한다. 대신 **글자와 아이콘이 들어 있는 내부 래퍼만 불투명도를 낮춘다**(예: **`opacity: 0.3`**) — 배경 면은 그대로 두어 2rd Disabled(전체 흐림)와 구분된다.

### 3.4 타이포그래피 (사이즈별)

| 사이즈 | 1st (Bold) | 2rd / 3rd (Regular) |
|--------|------------|---------------------|
| Medium | **14px** | **14px** |
| Small | **12px** | **12px** |

- **줄 높이:** 고정 높이 안에서 잘리지 않도록 **`line-height`는 1 또는 글자 크기에 맞는 단일 줄**로 둔다(여러 줄 라벨이 필요하면 별도 “텍스트 버튼” 패턴으로 분리한다).
- **폰트:** §2 **Pretendard** (`var(--font-pretendard)`).

### 3.5 아이콘

- **위치:** 라벨 **앞(leading)** 또는 **뒤(trailing)** 에 둘 수 있다. 한 버튼에 아이콘은 하나만 둔다.
- **간격:** 아이콘과 라벨 사이 **`gap: 6px`** — §3.8 `.btn-ds`와 동일.
- **크기:** Material Symbols는 라벨과 **같은 `font-size`** 로 두고 `line-height: 1`·flex 정렬로 맞춘다. Medium **14px**면 아이콘 **14px**(필요 시 **18px**까지). Small **12px**면 **12px~16px** 범위에서 통일.
- **색:** 버튼에 `color`를 타입별 글자 토큰으로 주고, 아이콘은 **`currentColor`** 를 쓰면 상태·타입이 바뀔 때 같이 맞는다.
- **라이브러리:** §2.3 및 **§9 Iconography** (Material Symbols).

### 3.6 모서리(라운드)

- **표준 값:** 모든 버튼의 모서리는 **`border-radius: 4px`** 로 통일한다.
- **토큰과의 관계:** §1.10의 **`--radius-button`** 은 버튼에 쓸 때 **반드시 4px와 동일한 값**으로 둔다. 다른 컴포넌트가 같은 변수를 쓰지 않는다면, 버튼 전용으로 `4px`를 직접 써도 되되 **프로젝트 안에서는 한 가지 방식만** 택한다.

### 3.7 상호작용·접근성

- **포커스(탭·칩 등):** Primary 링 예시(Samsung 구현):

```css
.filter-tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

- **포커스(슬라이드·모달 래퍼):** 아래처럼 **컨테이너 루트**는 윤곽을 제거한다. **실제 `button`·`a`** 에는 위 패턴 또는 Bootstrap 기본 포커스를 유지한다.

```css
.offcanvas:focus,
.offcanvas:focus-visible,
.offcanvas-body:focus,
.offcanvas-body:focus-visible,
.modal:focus,
.modal:focus-visible,
[tabindex]:focus,
[tabindex]:focus-visible {
  outline: none !important;
}
```

- **커서:** 활성 `cursor: pointer`, Disabled `cursor: not-allowed`(§3.8 `.btn-ds`).

### 3.8 Samsung 참조 구현 — `.btn-ds` (Medium 단일 높이)

`Project/Samsung/html/style.css` 발췌. **1st `:hover`** 는 §3.3.1의 `--color-primary-hover` 대신 **`--color-status-indigo`** 를 쓴다. **1st `:disabled`** 는 §3.3.1 서술과 달리 **`--color-black-20` 배경 + `--color-black-40` 글자**다. **3rd `:disabled`** 는 배경을 **`--color-black-10`** 으로 바꾼다(문서 §3.3.3의 “라벨만 opacity”와 다름). 통일이 필요하면 문서 또는 코드 한쪽에 맞춘다.

```css
/* ========== 버튼 컴포넌트 — Figma 323-3588 Button/Button-34px ========== */
.btn-ds { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; min-width: 60px; padding: 7.5px 12px; border-radius: 4px; font-size: 14px; line-height: 1; font-family: var(--font-pretendard); border: 1px solid transparent; cursor: pointer; box-sizing: border-box; white-space: nowrap; }
/* Type 1st — Primary */
.btn-ds-1st { background: var(--color-primary); color: #fff; font-weight: 700; }
.btn-ds-1st:hover { background: var(--color-status-indigo); color: #fff; }
.btn-ds-1st:disabled { background: var(--color-black-20); color: var(--color-black-40); cursor: not-allowed; }
/* Type 2nd — Outline */
.btn-ds-2nd { background: #fff; color: var(--color-primary); font-weight: 400; border-color: var(--color-primary); }
.btn-ds-2nd:hover { background: var(--color-primary-10); color: var(--color-primary); border-color: var(--color-primary); }
.btn-ds-2nd:disabled { background: #fff; color: var(--color-black-40); border-color: var(--color-black-20); cursor: not-allowed; }
/* Type 3rd — Tertiary */
.btn-ds-3rd { background: var(--color-bg-subtle); color: var(--color-primary); font-weight: 400; }
.btn-ds-3rd:hover { background: var(--color-primary-10); color: var(--color-primary); }
.btn-ds-3rd:disabled { background: var(--color-black-10); color: var(--color-black-40); cursor: not-allowed; }
```

### 3.9 AI·개발 강제 요약

- **금지:** Primary·Black·White 밖 팔레트, 버튼 전용 HEX/`rgb()` 하드코딩.
- **허용:** §1 토큰과 본 절 수치. **Small/Medium × 1st/2rd/3rd × Default/Hover/Disabled × Hug/100%** 는 클래스·컴포넌트로 명시한다.
- **검증:** 본 절 표·§3.8과 실제 CSS를 diff해 **높이·패딩·4px 라운드·상태별 색**이 어긋나지 않는지 확인한다.

---

#### GNB (Global Navigation Bar) 규칙

┌─────────────────────────────────────────────────────────────────────────┐
│ 📋 화면 제목               │ 2026.03.20 월요일 │ 매뉴얼 ▼ │ 👤 사용자 ▼  │
└─────────────────────────────────────────────────────────────────────────┘

- **위치**: 상단 고정, 전체 너비, width:100%
- **구성 (좌→우)**:
  left
  - 제목에 맞는 아이콘 + 현재 화면의 제목
  right
  - 현재 날짜 (YYYY.MM.DD 요일)
  - 매뉴얼 버튼 (메뉴얼가이드 리스트 드롭다운)
  - 사용자 프로필 버튼 (이름 + 드롭다운 아이콘)
- **높이**: 60px
- **배경색**: 흰색, 하단 border (`border-bottom: 1px solid #C9D0D7`)


#### GNB 메뉴얼얼 팝오버 (User Popover)

```
┌──────────────────────────────────┐
│ Manual List                    × │
├──────────────────────────────────┤
│ 사용자 메뉴얼 (User Manual)        │
│ 한국어 │ English                  │  < 버튼
│──────────────────────────────────│
│ 테니엄 에이전트(Tanium Agent)      │
│ 설치가이드 Install Guide           │ < 버튼
│ 윈도우 │ 리눅스                    │ < 버튼
│ 솔라리스스 │ aix                   │ < 버튼
│──────────────────────────────────│
│ 서버 보안 점검 체크리스트            │
│ (Server Security Checklist)      │
│ 한국어 │ English                  │ < 버튼
│──────────────────────────────────│
│ 보안 담당자 메뉴얼                  │
│ (Manual for Security Manager)    │
│ 한국어 │ English                  │ < 버튼
│──────────────────────────────────│
│ 주요 Q&A (Major Q&A) - Mosaic     │
│ 전사 보안 점검 상세 가이드           │ < 버튼
│ Security Diagnosis Detailed Guide│
└──────────────────────────────────┘
```

- 메뉴얼 별로 버튼튼 클릭 시 다운로드 기능 제공
- 한국어에는 한국국기, English에는 미국국기 이미지 텍스트앞에 배치
- 설치가이드와 전사 보안점검 상세 가이드 앞엔 알맞는 아이콘 배치
- 버튼 스타일은 설치가이드'btn btn-primary btn-sm' / 나머지 'btn btn-white btn-sm'

#### GNB 사용자 팝오버 (User Popover)

```
┌──────────────────┐
│ My Page        × │
├──────────────────┤
│ 부서명            │
│ knox & 개발그룹    │
│ 이름              │
│ 홍길동             │
│ ID               │
│ R02              │
├──────────────────┤
│ 대시보드 위젯 설정  │
├──────────────────┤
│ 언어 변경 Korean ▼ │
├──────────────────┤
│ [Logout]         │
└──────────────────┘
```

- 사용자 이름 클릭 시 팝오버 표시 (Bootstrap `popover` 또는 커스텀 드롭다운)
- 부서명, 이름, ID 표시
- 대시보드 위젯 설정 링크
- 언어 변경 드롭다운 (한국어/English)
- [Logout] 버튼: `btn btn-primary btn-sm`

