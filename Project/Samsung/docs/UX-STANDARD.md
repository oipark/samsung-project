# AI 주도형 UX/UI 표준 가이드 v2.0

> **[System Directive for AI]**
> 너는 메니인소프트 정보보호포털의 프론트엔드 코드를 생성하는 'UX/UI Core Guardian'이다. 
> 본 문서에 정의된 모든 규칙(Rules), 제약(Constraints), 명명 규칙(Naming Conventions), 변수(Tokens)는 절대적인 기준이다. 신규 UI/UX 생성 시 반드시 이 문서의 뼈대와 물리 법칙을 상속받아 코드를 작성하라.

### 참조 범위 (경로·파일)

본 문서 본문·AI 출력에서 **다른 파일·폴더를 경로로 인용**할 때는, **`UX-STANDARD.md`와 같은 디렉터리**에 있는 아래만 허용한다. 그 외 레포 경로(예: `html/`, 타 문서)는 **적지 않고**, 근거·검증 링크로도 쓰지 않는다.

| 허용 | 설명 |
|------|------|
| **`UX-STANDARD-root.css`** | 동일 폴더의 `:root` 토큰 정본. 구현 프로젝트 전역 CSS는 이 파일(또는 §1.13 블록)과 동기화한다. |
| **`img/`** | 동일 폴더 아래 `img/` 안의 자산만. 예: `img/파일명.png` |

스크린샷·다이어그램이 필요하면 `img/`에 두고 위 형식으로만 말한다.

### 기본 `img/` 자산 — 언어(국기)·OS·제품 로고

**목적:** 매뉴얼·목록·버튼 등에서 **텍스트 바로 앞**에 아이콘을 붙여 **언어** 또는 **OS/제품**을 한눈에 구분한다. 아래는 **권장 파일명**이며, 실제 PNG는 `img/`에 두고 **부족하면 프로젝트에서 추가**한다(추가 시에도 **kebab-case**·의미 있는 이름).

| 용도 | 배치 | 권장 파일명 (예) |
|------|------|------------------|
| **한국어** (매뉴얼·언어 선택 등) | **「한국어」** 라벨 **앞** | `img/lang-ko.png` (대한민국 국기) |
| **English** | **「English」** 라벨 **앞** | `img/lang-en.png` (미국 국기) |
| **Windows** | 해당 텍스트(예: "Windows") **앞** | `img/os-windows.png` |
| **Linux** | 해당 텍스트 **앞** | `img/os-linux.png` |
| **AIX** | 해당 텍스트 **앞** | `img/os-aix.png` |
| **Oracle** (DB 등) | 해당 텍스트 **앞** | `img/os-oracle.png` |

**마크업·간격 (공통):**

- 컨테이너: `display: inline-flex`, **`align-items: center`**, 아이콘과 글자 사이 **`gap: 6px` ~ `8px`**.
- 아이콘 높이: **16px ~ 20px** (한 화면·컴포넌트 안에서 통일). 너비는 비율 유지(`height` 기준 `width: auto` 등).
- **접근성:** 의미가 있는 경우 `alt`에 짧은 설명(예: "한국어", "Windows"). 텍스트와 완전히 중복되면 `alt=""` 로 장식 처리하고 **옆 텍스트**로 의미를 전달한다.

**구현 참고:** 문서·AI가 경로를 적을 때는 **`img/…`** 만 쓴다(**참조 범위**). 실제 HTML·빌드에서는 `img/` 파일을 **정적 자산으로 복사·포함**해, 브라우저가 읽는 URL만 맞추면 된다.

**GNB·매뉴얼:** 본 표의 **국기 = 언어**, **로고 = OS/제품** 규칙을 따른다(하단 GNB 예시와 동일 축).

### 차트 라이브러리 표준

- 대시보드/리포트/상세의 **모든 차트 구현은 `Chart.js`만 사용**한다.
- 신규 화면에서 **ApexCharts, ECharts, Highcharts 등 다른 차트 라이브러리 추가 금지**.
- 공통 규칙(색상 토큰, 라벨, 툴팁, 빈 상태)은 본 문서 표준을 따르고, 라이브러리 차이는 두지 않는다.

---

## 1. Design Tokens & Theme Constraints (디자인 토큰)

### 1.0 전제 — Primary(메인 브랜드 컬러)는 **고객사·빌드마다 바뀐다**

- **메인 컬러 = `--color-primary`**. 솔루션 전역의 “브랜드 축”은 이 변수(와 아래 **Primary 파생** 변수들)로만 표현한다.
- **서술 vs 코드 블록:** 본문 표·절에서는 **토큰 이름·역할**을 우선 쓴다. **HEX·rgba 등 픽셀 기준값**은 **§1.13 참조 `:root` 스냅샷** 코드 블록에만 모아 둔다. 레포에 전역 CSS가 없을 때는 그 블록을 그대로 붙여 넣고, 있으면 해당 `:root`와 동기화한다.
- **동작 보장 (컴포넌트):** 화면·컴포넌트 CSS/마크업에는 **항상 `var(--토큰이름)`만** 쓴다 (§1.11). Primary만 `:root`에서 바꿔도 대비 관계가 유지되게 한다.
- **기준값 위치:** 토큰의 **참조 기본값**은 §1.13 및 동일 폴더 **`UX-STANDARD-root.css`** 의 `:root`와 같아야 한다. 구현 코드의 `:root`는 이 정본을 복사·동기화한다 (**참조 범위** 상단 표).

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

| CSS 변수 | 참조 값 (§1.13) | 용도 |
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

### 1.13 참조 `:root` 스냅샷 (전역 CSS 동기화용)

> **정본 파일:** 이 문서와 같은 폴더의 **`UX-STANDARD-root.css`**. 전역 CSS가 없으면 아래 블록 또는 해당 `.css`를 그대로 쓴다. **인라인 블록**은 문서만 열었을 때 복사·붙여넣기용이다. 구현 쪽 `:root`는 이 정본을 따르며, 역으로 다른 경로 파일을 UX 스탠다드 근거로 인용하지 않는다 (**참조 범위**).

```css
/* 디자인 시스템 CSS 변수 — Figma 디자인 시스템 (Color 2-363) */
/* UX-STANDARD.md §1.13 과 동기화. 정본: UX-STANDARD-root.css */
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

폰트 스택·스무딩은 **§1.13 `:root`** 및 **`UX-STANDARD-root.css`** 가 정본이다. 구현체에서는 아래 **`#app` 규칙**으로 외부 UI 프레임워크와 맞춘다.

### 2.1 본문·UI 텍스트 (Pretendard)

- **강제:** 모든 UI 문자열은 **Pretendard** 패밀리만 사용한다. 페이지·컴포넌트 전용 CSS에서 `font-family`를 임의의 웹폰트·시스템 폰트로 바꾸지 않는다.
- **CSS 변수:** `var(--font-pretendard)` — 스택 문자열은 §1.13에 있다.
- **`#app` 내부 Pretendard 강제 (프레임워크 기본 폰트 덮어쓰기 방지):**

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

본 절만으로도 **사이즈·패딩·타입·상태·모서리**를 구현할 수 있도록 수치와 시각 규칙을 문장으로 고정한다. **참조용 구현 예시는 §3.8** CSS 블록에 수록한다.

### 3.1 사이즈 (2종) — 높이·패딩

버튼은 **Small**과 **Medium** 두 가지 높이만 쓴다. `box-sizing: border-box`를 전제로 한다(테두리가 있는 타입은 높이 안에 테두리 두께가 포함된다).

| 사이즈 | 전체 높이(고정) | 좌우 패딩 | 상·하 패딩 |
|--------|-----------------|-----------|------------|
| **Small** | **24px** | **10px** | **0** |
| **Medium** | **34px** | **15px** | **0** |

- **상·하 패딩 0:** 위아래로 별도 패딩을 주지 않는다. 대신 **`min-height`(또는 `height`)를 위 표와 동일하게 고정**하고, 내부를 **`display: inline-flex` 또는 `flex` + `align-items: center` + `justify-content: center`** 로 채워 텍스트·아이콘을 수직·수평 중앙에 둔다.
- **짧은 라벨:** 라벨이 매우 짧을 때 **`min-width: 60px`**(Medium 기준)을 둔다. §3.8 `.btn-ds`와 동일.
- **표 vs 참조 구현:** §3.1 표는 **목표 스펙**(Small 24px·좌우 10px 등). §3.8 `.btn-ds`는 **높이 34px·`padding: 7.5px 12px`** 로 표와 다르다. 정리 시 표에 맞추거나 Small 전용 클래스를 추가한다.

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
- **Default:** 배경은 **아주 연한 면**이다. §3.8 참조 구현은 **`--color-bg-subtle`** (`#f2f4f8`, §1.13). 글자·아이콘 **`--color-primary`**, **Regular**. **외곽 테두리는 두지 않는다**(구분은 배경 톤 차이로만).
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

- **포커스(탭·칩 등):** Primary 링 예시:

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

### 3.8 참조 구현 — `.btn-ds` (Medium 단일 높이)

본 문서에 수록한 **참조 CSS**. **1st `:hover`** 는 §3.3.1의 `--color-primary-hover` 대신 **`--color-status-indigo`** 를 쓴다. **1st `:disabled`** 는 §3.3.1 서술과 달리 **`--color-black-20` 배경 + `--color-black-40` 글자**다. **3rd `:disabled`** 는 배경을 **`--color-black-10`** 으로 바꾼다(문서 §3.3.3의 “라벨만 opacity”와 다름). 통일이 필요하면 §3.3 서술과 본 블록 중 한쪽에 맞춘다.

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

## 4. Badge & Status Label Rules (뱃지·스테이터스 라벨)

스테이터스 **색상 패밀리**(Green, Red, Blue 등)가 정해진 뱃지·칩은 아래 **3단 토큰 규칙**을 따른다. 구현은 `var(--color-…)` 만 사용한다 (§1.11).

### 4.0 공통 색 규칙 (Status 3단)

| 역할 | CSS 토큰 (패밀리 `{색}` = green / red / blue / cyan / orange / yellow / indigo / purple) |
|------|----------------------------------------------------------------------------------------|
| **배경** (화이트계·옅은 면) | `--color-status-white-{색}` |
| **테두리** 1px solid (Light) | `--color-status-light-{색}` |
| **글자·아이콘·채움 도트** (본색) | `--color-status-{색}` |

- **모서리:** `border-radius: var(--radius-badge)` (§1.10, 4px).
- **폰트:** §2 Pretendard.
- **테두리 생략:** §4.5·§4.6처럼 용도상 칩/테두리가 없는 변형은 명시된 경우만 예외.

#### 4.0.1 중립(그레이) — Status Gray 패밀리 없음

문서·화면에서 **그레이**로 부르는 상태(계획 수립, NA, 전체, 0% 등)는 `--color-status-*` Gray가 없으므로 **Black 스케일**로 맞춘다.

| 역할 | 토큰 |
|------|------|
| 배경 | `--color-black-10` (또는 더 옅게 `--color-black-4`) |
| 테두리 | `--color-black-10` |
| 글자·아이콘·도트 | `--color-text-muted` (`--color-black-60` 계열) 또는 맥락에 따라 `--color-black-40` |

---

### 4.1 점검계획 스테이터스 (아이콘 + 라벨)

**용도:** 점검 계획 목록·상세에서 계획 단계 표시.  
**구성:** **Material Symbols Outlined** 아이콘(상태에 맞게 선택) + 한글 라벨.  
**레이아웃:** 높이 **22px** 수준, `padding` 약 **10px 4px**, 아이콘 컨테이너 **14×14px**, 아이콘·텍스트 **gap 5px**, 라벨 **12px Regular**. `display: inline-flex; align-items: center;`.

| 라벨(예) | 의미 색 | 배경 | 테두리 | 글자·아이콘 |
|----------|---------|------|--------|-------------|
| 계획 수립 | 그레이(중립) | §4.0.1 배경 | §4.0.1 테두리 | §4.0.1 글자·아이콘 |
| 진행중 | 블루 | `--color-status-white-blue` | `--color-status-light-blue` | `--color-status-blue` |
| 점검완료 | 그린 | `--color-status-white-green` | `--color-status-light-green` | `--color-status-green` |
| 점검오류 | 레드 | `--color-status-white-red` | `--color-status-light-red` | `--color-status-red` |

---

### 4.2 점검결과 스테이터스 (6px 도트 + 라벨)

**용도:** 점검 결과 요약·필터 등 위험도/판정과 별도의 **결과 상태** 표시.  
**구성:** 원형 도트 **직경 6px**(`border-radius: 50%`, 배경 = 본색 토큰) + 라벨.  
**레이아웃:** 행 높이 **22px** 수준, `padding` 약 **10px 4px**, **gap 5px**, 라벨 **12px Bold**. 칩 형태(배경·테두리)는 §4.0 표를 따른다.

| 라벨 | 의미 색 | 배경 | 테두리 | 글자·도트 |
|------|---------|------|--------|-----------|
| 양호 | 그린 | `--color-status-white-green` | `--color-status-light-green` | `--color-status-green` |
| 취약 | 레드 | `--color-status-white-red` | `--color-status-light-red` | `--color-status-red` |
| 인터뷰 | 오렌지 | `--color-status-white-orange` | `--color-status-light-orange` | `--color-status-orange` |
| 예외 | 블루 | `--color-status-white-blue` | `--color-status-light-blue` | `--color-status-blue` |
| NA | 그레이 | §4.0.1 배경 | §4.0.1 테두리 | §4.0.1 글자·도트 |

---

### 4.3 위험도 (6px 도트 + 라벨)

**용도:** High / Medium / Low 위험 구분.  
**구성·크기:** §4.2와 동일 (**6px** 도트, **22px** 행·패딩·gap·12px Bold 권장).  
**색:**

| 라벨 | 배경 | 테두리 | 글자·도트 |
|------|------|--------|-----------|
| High | `--color-status-white-red` | `--color-status-light-red` | `--color-status-red` |
| Medium | `--color-status-white-orange` | `--color-status-light-orange` | `--color-status-orange` |
| Low | `--color-status-white-yellow` | `--color-status-light-yellow` | `--color-status-yellow` |

---

### 4.4 결제·신청 현황 칩 (텍스트만)

**두 가지 높이:** **18px** 변형 / **22px** 변형. 모두 §4.0 색 3단을 적용한다.  
**레이아웃 (18px / 22px 변형):**

| 변형 | 고정 높이 | 좌우 패딩(참고) | 글자 |
|------|-----------|-----------------|------|
| **18px** | **18px** | 약 **7px**, 상하 **3px** | **10px Bold** |
| **22px** | **22px** | 약 **10px** | **12px Bold** |

**라벨·색·높이 조합:**

| 라벨 | 18px | 22px | 의미 색 | 배경 | 테두리 | 글자 |
|------|:----:|:----:|---------|------|--------|------|
| 완료 | O | O | 그린 | `--color-status-white-green` | `--color-status-light-green` | `--color-status-green` |
| 반려 | O | O | 레드 | `--color-status-white-red` | `--color-status-light-red` | `--color-status-red` |
| 결재중 | O | O | 인디고 | `--color-status-white-indigo` | `--color-status-light-indigo` | `--color-status-indigo` |
| 전체 | O | O | 그레이 | §4.0.1 배경 | §4.0.1 테두리 | §4.0.1 글자 |
| 등록 | — | **O** | 블루 | `--color-status-white-blue` | `--color-status-light-blue` | `--color-status-blue` |
| 수정 | — | **O** | 오렌지 | `--color-status-white-orange` | `--color-status-light-orange` | `--color-status-orange` |
| 삭제 | — | **O** | 레드 | `--color-status-white-red` | `--color-status-light-red` | `--color-status-red` |

---

### 4.5 그래프 수치 (변동률 칩)

**용도:** 차트·카드에서 **전기 대비 %** 등을 짧게 표시.  
**레이아웃 (수치 칩, 16px 라인 기준):** 한 줄 높이 약 **16px**, `padding` 약 **6px 2px**, 아이콘·숫자 **gap 2px**, 숫자 **10px Bold**, `border-radius: 4px`. **테두리는 두지 않는다**. 배경만 옅은 Status 면 + 아이콘·숫자는 본색.

| 표현 | 아이콘·기호 | 의미 색 | 배경(옅은 면) | 글자·아이콘 |
|------|-------------|---------|---------------|-------------|
| 하락 + 음수% (예: -5%) | 하락 추세 아이콘 | 그린 | `--color-status-white-green` | `--color-status-green` |
| 상승 + 플러스% (예: +5%) | 상승 추세 아이콘 | 레드 | `--color-status-white-red` | `--color-status-red` |
| 중앙선 + 0% | 가로 중립선(—) | 그레이 | `--color-black-10` | `--color-black-40` (선·숫자 동일) |

> **의미:** “수치 **하락** = 긍정” 맥락에 맞춰 하락·음수는 **그린**, 상승·플러스는 **레드**로 고정한다. 제품 정책이 바뀌면 본 표만 수정한다.

---

### 4.6 점검결과 Pass / Fail / Fail-PS (10px 도트 + 라벨, 무칩)

**용도:** 상세·표 안에서 **영문 결과**를 도트와 함께 표시한다.  
**구성:** **배경·테두리 없음** — 행/셀 배경 위에만 올린다. **도트 직경 10px**, 본색 채움. 라벨 **14px Regular**, `line-height: 20px`, **gap 5px**.

| 라벨 | 색(도트·글자 동일) |
|------|---------------------|
| Pass | `--color-status-green` |
| Fail | `--color-status-red` |
| Fail-PS | `--color-status-red` (Fail과 동일 팔레트, **라벨 문자열만** 구분) |

---

### 4.7 AI·개발 강제 요약

- **금지:** 뱃지 단에서 임의 HEX/`rgb()` — §1.13·§4 토큰만 사용.
- **허용:** 패밀리별 **White / Light / 본색** 조합, 중립은 §4.0.1 Black 스케일.
- **검증:** 구현 산출물의 `.badge-inspection`, `.badge-application` 등이 본 절과 어긋나면 **토큰·클래스를 본 절 기준으로 정렬**한다.

---

## 5. Text Input & Dropdown Field Rules (인풋·드롭다운 필드)

텍스트 필드는 **일반 / 필터용 / 검색용** 세 종류다. 색·테두리는 **`var(--color-…)` 만** 쓴다 (§1.11).

### 5.0 세 종 공통 — 디폴트 베이스

| 속성 | 규칙 |
|------|------|
| **배경** | **`--color-white-100`** (또는 **`--color-bg-white`**) |
| **테두리** | **`1px solid var(--color-black-40)`** (Black 40%) |
| **폰트** | Pretendard, §2 |

인풋 **종류별로 달라지는 것**만 아래 절에 적는다. Disabled·Completed Disabled 등 **예외 면색**이 있으면 해당 행을 따른다.

### 5.0.1 필드 제목 라벨 — 배치

필드 제목(라벨)이 붙을 때 **인풋·드롭다운 트리거와의 상대 위치**는 아래만 쓴다.

| 구분 | 레이아웃 | 설명 |
|------|----------|------|
| **일반·검색** (및 폼에서 동일 패턴을 쓰는 필드) | **라벨 위 → 필드 아래** | 라벨이 **위**에 오고, 인풋 또는 드롭다운 필드가 **그 아래**에 온다(세로 스택). 검색 필드가 라벨 없이 단독으로 쓰이는 경우는 예외. |
| **필터** | **라벨 앞 → 필드 뒤 (가로)** | 라벨이 **왼쪽(앞)**에 오고, 인풋·드롭다운이 **오른쪽(뒤)**에 온다. **한 줄 가로 정렬**(`display: flex` / `inline-flex`, `flex-direction: row`, **`align-items: center`**)과 라벨·필드 사이 **일정 gap**으로 맞춘다. |

라벨 타이포·색은 §2·§1 텍스트 토큰을 따르고, **필터 행**에서도 라벨만 세로 중앙 기준으로 필드 높이(40px)와 맞춘다.

---

### 5.1 일반 인풋 (General)

라벨이 있으면 **§5.0.1** — 라벨 **위**, 필드 **아래**.

**레이아웃 (참고):** 높이 **44px**, 좌우 패딩 **15px**, **`border-radius: 5px`**, 본문·플레이스홀더 **16px Regular**. 값 입력 후 지우기가 있으면 트레일링 클리어 아이콘(예: **18px** 영역)을 둘 수 있다. 셀렉트(드롭다운 트리거) 변형은 우측 **24px** 영역에 쉐브론을 둔다.

| 상태 | 배경 | 테두리 | 글자·비고 |
|------|------|--------|-----------|
| **Default** | 흰색 (§5.0) | **`--color-black-40`** | 플레이스홀더 **`--color-black-40`**, 본문 입력 전과 동일 톤 허용 |
| **Disabled** | **`--color-black-10`** (`rgba` 스케일과 동일 계열) | **`--color-black-40`** | **`--color-black-20`** 계열로 저대비 |
| **Completed** (값 있음) | 흰색 | **`--color-black-40`** | 값 **`--color-text-primary`**, 클리어 버튼 가능 |
| **Focused** | 흰색 | **`--color-primary`** | 포커스 링·테두리만 Primary, 글자는 보통 **`--color-text-primary`** |
| **Error** | 흰색 | **`--color-status-red`** | 필드 값은 **`--color-text-primary`**, 하단 도움말(있으면) **11px Regular** + **`--color-status-red`**, 우측 경고 아이콘 가능 |
| **Completed Disabled** | **`--color-bg-base`** | **`--color-black-40`** | 값 **`--color-text-primary`**, **Regular** — 읽기 전용·비활성 확정값 |

---

### 5.2 필터 인풋 (Filter)

**레이아웃 (참고):** 높이 **40px**, 좌우 패딩 **15px**, **`border-radius: 5px`**, **14px**, `line-height: 20px`, 자간 **-0.01em** 수준(디자인과 동기화). 필터에 라벨이 있으면 **§5.0.1 필터 행(가로)** 을 따른다.

| 상태 | 배경 | 테두리 | 글자·비고 |
|------|------|--------|-----------|
| **Default** | 흰색 (§5.0) | **`--color-black-40`** | 플레이스홀더 **`--color-black-40`**, **Regular** |
| **Disabled** | **`--color-black-10`** | **`--color-black-40`** | 라벨 톤 **`--color-black-40`**, **Regular** |
| **Completed** (필터 값 적용됨) | 흰색 | **`--color-primary`** | 표시 값 **`--color-text-primary`**, **Bold(700)** |
| **Completed Disabled** | **`--color-bg-base`** | **`--color-black-40`** | 값 **`--color-text-primary`**, **Regular** |

셀렉트 트리거(On) 변형도 **상태별 테두리·면 규칙은 위와 동일**하게 맞춘다.

---

### 5.3 검색 인풋 (Search) — 페이지·툴바 등 단독 필드

라벨이 붙는 검색 필드는 **§5.0.1** — 라벨 **위**, 검색 필드 **아래**. 라벨 없는 단독 배치는 흔함.

**레이아웃 (참고):** 높이 **32px**, 좌우 패딩 **10px**·상하 **2px**, **`border-radius: 4px`**, **14px Regular**, `line-height: 20px`. 우측 검색 아이콘 **16px** 영역.

| 상태 | 배경 | 테두리 | 글자·비고 |
|------|------|--------|-----------|
| **Default** | 흰색 (§5.0) | **`--color-black-40`** | 플레이스홀더 **`--color-black-40`**, 검색 아이콘 **`--color-black-60`** 계열 허용 |
| **Type text** (포커스·입력 중) | 흰색 | **`--color-primary`** | 입력 값 **`--color-text-primary`**, 클리어(예: **12px**) + 검색 아이콘 트레일링, **gap 5px** |

---

### 5.4 드롭다운 메뉴 패널 & 패널 내 검색 행

- **패널(옵션 리스트를 감싸는 박스):** 옵션·라벨의 **글꼴 크기는 트리거 필드와 동일**하게 맞춘다. **배경은 흰색**, **테두리는 `1px solid var(--color-black-40)`** — §5.0 디폴트 베이스와 동일한 면·선이다.
- **패널 안 “검색어 입력” 행 (Search fields in the drop-down menu):**
  - 행 배경 **`--color-bg-base`** (페이지 베이스와 동일 톤).
  - **테두리 없음** (`border: none` / `border-color: transparent`) — Default·입력 중·포커스 모두 **외곽선 없음**.
  - 플레이스홀더 **`--color-black-40`**, 입력 텍스트 **`--color-text-primary`**, **14px Regular**. 좌측 검색 아이콘(**14px** 영역), 텍스트와 **gap 7px**. 입력 중에는 우측 클리어(**12px**) 가능.

---

### 5.5 AI·개발 강제 요약

- **금지:** 인풋·드롭다운에 브랜드·상태색을 HEX/`rgb()`로 직접 박기 — §1·본 절 토큰만.
- **허용:** §5.0 공통 + 종류별 상태 표의 **`--color-primary`**, **`--color-black-*`**, **`--color-status-red`**, **`--color-bg-base`** 조합.
- **검증:** 동일 화면에서 일반·필터·검색이 **서로 다른 테두리 규칙을 섞어 쓰지 않는지**, 라벨이 **§5.0.1** 과 맞는지(일반=세로, 필터=가로), 드롭다운 패널이 §5.4 면·선·타이포를 따르는지 확인한다.

---

## 6. Radio, Checkbox & Toggle Rules (라디오·체크박스·토글)

선택·토글 컨트롤의 **선택됨·켜짐(On) 등 액티브 면·채움·강조 테두리**는 **`--color-primary`** 를 쓴다 (§1). 구현은 **`var(--color-…)` 만** (§1.11).

### 6.1 라디오 버튼 (박스형: 컨트롤 + 라벨)

**형태:** 라디오 도트와 텍스트를 **하나의 박스**로 묶는다. `inline-flex` / `flex` 로 **가로 배치**, **`align-items: center`**, 도트·라벨 **`gap: 7px`**.

| 상태 | 박스 배경 | 박스 테두리 | 도트(16×16 영역) | 라벨 텍스트 |
|------|-----------|-------------|------------------|-------------|
| **ON (선택)** | **`--color-primary-10`** 계열 옅은 틴트(디자인상 라벤더 틴트와 동일 역할) | **`2px solid var(--color-primary)`** | 바깥 원 **`--color-primary`** 스트로크, 안쪽 채움 점 **`--color-primary`** | **`--color-text-primary`**, **14px Regular**, `line-height: 20px` |
| **OFF** | **`--color-white-100`** | **`1px solid var(--color-black-40)`** (#aaa 계열 중립선과 동일 역할) | 비선택 원형 — **외곽 링 `var(--color-primary)`**, 내부 **비채움(흰)** | **`--color-text-primary`**, **14px Regular** |
| **Disabled** | **`--color-bg-subtle`** (또는 `#ebeef3` 에 맞춘 전용 토큰으로 통일) | **`1px solid var(--color-black-40)`** | 비활성 원형(채움 없음), 스트로크 **`--color-black-40`** | **`--color-black-40`** 또는 **`--color-text-muted`**, **14px Regular** |

**박스 치수 (참고):** **`min-width: 70px`**, 좌우 **`padding: 12px`**, 상하 **`10px`**, **`border-radius: 4px`**. 라디오 그룹은 옵션마다 동일 박스 규칙을 반복한다.

---

### 6.2 체크박스 (아이콘만, 16×16 기준)

**공통:** 한 변 **16px**, **`border-radius: 2px`**. 액티브(선택·부분선택) **면색은 `var(--color-primary)`**.

| 상태 | 배경 | 테두리 | 내부 그래픽 |
|------|------|--------|-------------|
| **UnCheck** | **`--color-white-100`** | **`1px solid var(--color-black-60)`** | 없음 |
| **Check** | **`--color-primary`** | 없음(면이 곧 영역) | **흰색** 체크 마크 |
| **Partial** (indeterminate) | **`--color-primary`** | 없음 | **흰색** 가로 막대(중앙); 컴포넌트 전체에 **`opacity: 0.5`** 를 적용해 부모·자식 일관되게 반투명 처리 |
| **Disabled** | **`#d8dde2`** 계열 단색 면 — **`--color-black-20`** 단색으로 근사하거나 `:root`에 **비활성 체크박스 면** 토큰으로 고정 | 없음 | **회색조** 체크 마크(가독 유지) |
| **Disabled (No data)** | **`--color-white-100`** | **`1px solid var(--color-black-40)`** (#aaa 계열과 동일 역할) | 없음 — 데이터 없음·선택 불가 표시 |

라벨이 붙으면 **§5.0.1** 과 맞춘다(일반 폼이면 라벨 위·필드 아래, 필터 행이면 가로).

---

### 6.3 토글 (스위치, On / Off)

**치수 (참고):** 트랙 **가로 28px × 세로 16px**, **캡슐형** (`border-radius` 큰 값, 예: **100px**). 썸(핸들)은 **흰 원**, 트랙 안에서 좌우 이동.

| 상태 | 트랙(배경) | 썸 |
|------|------------|-----|
| **On** | **`--color-primary`** | **`--color-white-100`**, 트랙 **오른쪽** 정렬 |
| **Off** | **`--color-black-20`** (Black 20% 면) | **`--color-white-100`**, **`1px solid var(--color-primary)`** 테두리, 트랙 **왼쪽** 정렬 |

접근성: `role="switch"` / `aria-checked`, 키보드 포커스 시 **§3.7** 포커스 링 패턴을 따른다.

---

### 6.4 AI·개발 강제 요약

- **금지:** 선택·On 상태에 Primary 대신 임의 HEX, 체크박스만 예외 없이 다른 브랜드색.
- **허용:** 액티브 = **`--color-primary`**(및 필요 시 **`--color-primary-10`** 박스 틴트), 비활성·중립 = **`--color-black-*`**, **`--color-bg-subtle`**, **`--color-white-100`**.
- **검증:** 라디오 박스의 **2px / 1px 테두리** 전환이 상태표와 일치하는지, 체크 **Partial** 에 **`opacity: 0.5`** 가 빠지지 않았는지, 토글 **Off** 썸의 **Primary 1px 테두리**가 유지되는지 확인한다.

---

## 7. Grid & Page Layout (그리드·페이지 레이아웃)

### 7.1 그리드 시스템 — Bootstrap

- **열·행·브레이크포인트**는 **Bootstrap 그리드**(`container` / `container-fluid`, `row`, `col-*`, `g-*` 등)를 쓰고, **해당 버전 문서의 규칙**(12열, 반응형 접두사, 네거티브 마진·gutter 동작)을 따른다.
- 커스텀 그리드를 새로 짜서 Bootstrap과 **충돌하지 않게** 한다. 필요 시 `row`·`col` 조합으로만 확장하고, 임의 `float`·퍼센트 열로 그리드를 대체하지 않는다.

### 7.2 섹션 간격·페이지·콘텐츠 패딩

| 구분 | 기준값 | 설명 |
|------|--------|------|
| **섹션 ↔ 섹션** | **`20px`** | 화면 안에서 의미 있는 블록(섹션) 사이 세로(또는 스택 방향) 간격. `margin`·`gap` 등으로 **20px**를 기본으로 맞춘다. |
| **메인 콘텐츠 패딩(영역)** | **`40px`** | 페이지·레이아웃에서 **본문이 차지하는 메인 영역**의 바깥 여백(뷰포트 또는 레이아웃 셸 대비 **좌우·상하 인셋**). GNB·사이드바 등 고정 뼈대 **안쪽**으로 들어오는 “큰 틀”의 패딩 기준이다. |
| **콘텐츠 내부 패딩** | **`20px`** (기본) | 카드·패널·표 컨테이너 등 **블록 안쪽** 여백의 **일반 기본값**. |

**가변성:** 콘텐츠 내부 패딩은 **밀도·컴포넌트·모바일**에 따라 **20px보다 작거나 클 수 있다**. 이때는 **해당 화면·컴포넌트에서 일관되게**만 조정하고, 문서 기본값(20px / 40px / 섹션 gap 20px)과 **동시에 깨지지 않게** 우선순위를 정한다(예: 좁은 서브패널은 16px, 풀블리드 테이블은 좌우 0 등 — **의도적으로 예외인 경우만**).

### 7.3 AI·개발 강제 요약

- **금지:** Bootstrap 그리드 없이 임의 퍼센트만으로 페이지 뼈대를 구성해 브레이크포인트와 엇박자 나기.
- **허용:** 그리드 = Bootstrap 규칙, **섹션 gap 20px**, **메인 인셋 40px**, **내부 패딩 기본 20px** + 문서화된 예외.
- **검증:** 동일 템플릿에서 **메인 40px**와 **카드 내부 20px**가 혼용될 때 시각적 계층이 유지되는지, 섹션 간격이 **20px**에서 무분별하게 벗어나지 않는지 확인한다.

---

## 8. Table & Tooltip Rules (테이블·툴팁)

테이블은 **세로형**(페이지 목록 등)과 **가로형**(슬라이드·팝업 요약) 두 타입이다. 색·선은 **`var(--color-…)`** (§1.11).

### 8.0 용도 구분

| 타입 | 주 사용처 |
|------|-----------|
| **세로형** | 페이지 본문에서 **가장 많이 쓰는** 데이터 그리드(행=레코드, 열=필드). |
| **가로형** | **슬라이드·팝업** 안 **요약 정보** (항목명 `th` / 값 `td` 한 쌍이 한 줄 또는 블록). |

---

### 8.1 세로형 테이블

| 속성 | 규칙 |
|------|------|
| **모서리** | **`border-radius: 8px`** (컨테이너·카드 래퍼에 적용). |
| **셀 패딩** | 좌우 **`15px`**, 상하 **`0`** — 세로 정렬은 **`align-items: center`** 등으로 중앙. |
| **본문 글자** | **14px** Regular(열·맥락에 따라 Bold 허용). |
| **외곽 보더** | **`1px solid var(--color-border-panel)`** (`#e2e8f0`, §1.9). |
| **그림자** | **`0 1px 2px rgba(17, 17, 17, 0.05)`** (오프셋 Y **1px**, 블러 **2px**, Black **5%**). |

**상단 헤더 바(테이블 위·카드 헤더):**

- 왼쪽: **「전체 {숫자}건」** 형식으로 건수 표기(숫자 강조는 **`--color-primary`** 허용).
- 오른쪽: 필요 시 **버튼·툴바** 배치(`justify-content: space-between` 등).

**`<th>` (컬럼 헤더):**

- **높이 `40px`**, 배경 **`var(--color-bg-subtle)`** (`#f2f4f8`).
- 글자색은 열에 따라 가변 가능, **기본 `var(--color-text-primary)`** (Black 100%).

**`<td>` (본문 셀):**

- **높이 `56px`**(고정 행 기준).
- **얼룩말:** 홀수·짝수 행 교차 — **`--color-white-100`** / **`var(--color-black-4)`** 면 (Black 4%).
- 기본 텍스트 **`var(--color-text-primary)`**.
- **클릭 가능한 텍스트(링크·상세 이동):** **`var(--color-status-blue)`** (§1 — 링크 톤).
- **줄 수:** 기본 **최대 2줄**까지 표시. **3줄 이상은 말줄임**(`-webkit-line-clamp: 2` + `overflow: hidden` 등). 잘린·숨은 내용은 **마우스 오버 시 툴팁(§8.4)** 으로 전체 노출.

내부 뱃지·버튼·체크박스는 **§4·§3·§6** 과 맞춘다.

---

### 8.2 가로형 테이블 (요약)

| 속성 | 규칙 |
|------|------|
| **모서리** | **없음** (`border-radius: 0`). |
| **셀 패딩** | **좌 `15px`**, **상·하·우 `0`** (필요 시 값 셀만 미세 조정은 맥락 내 통일). |
| **글자** | **제목(항목) 14px**, **내용(값) 16px**. |
| **보더·그림자** | **없음**. |
| **상단 “테이블 헤더 바”** | **없음** — 바로 행부터 시작. |

**`<th>` 역할 셀 (왼쪽 라벨):**

- **높이 `36px`**(기본 행), 배경 **Black 5%** — **`rgba(17, 17, 17, 0.05)`** (또는 `:root`에 동일 값 토큰으로 고정).
- 글자색 가변 가능, **기본 `var(--color-black-80)`**.

**`<td>` 값 셀:**

- **높이 `36px`**를 기본으로 하되, **긴 본문 행은 행 높이가 늘어날 수 있음**(디자인 예제와 동일하게 여러 줄 값 허용).
- 배경 **`--color-white-100`**, 기본 텍스트 **`var(--color-text-primary)`**.
- **클릭 가능 영역:** **`var(--color-status-blue)`**.
- **중요한 값·라벨**은 **Bold(700)** 로 강조할 수 있음.

---

### 8.3 테이블 하단 영역 (세로형)

**적용:** **세로형 테이블** 카드에서 **그리드 본문 바로 아래**에 붙인다(좌·우 끝 정렬, **테이블과 동일 너비**의 한 줄 바). 가로형 요약 테이블에는 **기본 적용하지 않는다**.

**레이아웃:** `display: flex`, **`justify-content: space-between`**, **`align-items: center`**, 좌측 블록·우측 블록이 **각각 영역 끝**에 붙는다. 필요 시 상단에 **`1px solid var(--color-border-panel)`** 로 본문과 구분한다.

#### 왼쪽 영역

1. **페이지당 행 수 드롭다운** — 현재 표시 개수(예: 10·20·50) 선택. 스타일은 **§5.2 필터 인풋**과 같은 토큰 계열(흰 배경, **`1px solid var(--color-black-20)`** 테두리, **14px Regular**, **`border-radius: 4px`**, 좌우 패딩 등)로 맞춘다. 높이는 하단 바에 맞게 **약 30px** 전후로 통일.
2. **범위 문구** — 드롭다운 오른쪽에 **`gap: 10px`** 수준으로 두고, **「전체 {총개수}개 중 {시작}-{끝} 표시」** 형식으로 적는다. 필터 적용 시 **`(필터됨)`** 등 부가 문구를 붙일 수 있다.

#### 오른쪽 영역 — 페이지네이션

**순서(고정):** **`<<`** (첫 페이지) · **`<`** (이전) · **페이지 번호들** · **`>`** (다음) · **`>>`** (마지막)의 형태의 아이콘 사용.

| 항목 | 규칙 |
|------|------|
| **번호 표시 개수** | 한 번에 보이는 **페이지 숫자는 최대 10개**. 11페이지 이상이면 **윈도우를 이동**하며 앞·뒤 구간을 본다(예: 1–10 다음 11–20). |
| **현재 페이지(액티브)** | 배경 **`var(--color-primary)`**, 글자 **`var(--color-white-100)`**, **`border-radius: 5px`**. 치수 참고: **24×24px** 안에 **`padding: 4px 8px`** 로 숫자 중앙. **14px Regular**. |
| **비액티브 번호** | 배경 투명, 글자 **`var(--color-text-primary)`**, **14px Regular**. 인접 번호 **`gap: 4px`**. |
| **앞뒤 화살표** | **24×24px** 터치·클릭 영역, 아이콘 **`--color-black-20`** 계열 등 비활성 톤과 구분 가능하게. 이전·다음 그룹과 **`gap: 12px`**. |

첫/이전이 불가일 때·마지막/다음이 불가일 때는 **disabled·흐림** 처리로 상태를 맞춘다.

---

### 8.4 툴팁 (Tooltip)

**용도:** 세로형 테이블 **말줄임**, **숫자 요약 표기(예: 20k)** 등 **축약된 표면**에 대해, **호버 시 전체·상세**를 보여 준다.

| 속성 | 규칙 |
|------|------|
| **배경** | **`var(--color-primary)`** (Primary 100%). |
| **글자** | **`var(--color-white-100)`**, **14px Regular**, `line-height: 20px`. |
| **박스** | **`border-radius: 5px`**, 안쪽 패딩 **`12px 8px`** (디자인 기준). |
| **화살표** | 트리거 방향에 맞춘 삼각형(Top/Right 등) — Primary 면과 동일 색으로 맞춘다. |

접근성: **`title`만으로 대체하지 말고**, 키보드 포커스 가능한 요소에는 **포커스 시에도** 동일 정보를 노출할 수 있도록 구현을 검토한다.

---

### 8.5 AI·개발 강제 요약

- **금지:** 세로형에 가로형 보더 규칙(보더)을 섞거나, 툴팁 배경을 임의 HEX로만 지정, 페이지 번호를 **10개 초과**로 한 줄에 나열하기.
- **허용:** 세로형 = **8px 라운드·패널 보더·미세 그림자·얼룩말·2줄+말줄임+툴팁**; **하단 바(§8.3)** = 좌 **행 수+범위 문구**, 우 **`<<` `<` 번호×(≤10) `>` `>>`**·액티브 **Primary+흰글자+5px 라운드**; 가로형 = **무라운드·보더·그림자 없음·좌 15px 패딩·14/16 타이포**.
- **검증:** 말줄임 셀에 **호버 툴팁**이 빠지지 않았는지, 클릭 텍스트가 **`--color-status-blue`** 로 통일됐는지, **페이지네이션 숫자 최대 10개·액티브 스타일**이 지켜졌는지 확인한다.

---

## 9. Tab & Textarea Rules (탭·텍스트에어리어)

색·테두리는 **`var(--color-…)`** 만 (§1.11). 탭 그룹은 **키보드 포커스·`aria-selected`** 로 상태를 맞춘다.

### 9.1 기본 탭 (활성 / 비활성)

탭 목록은 **가로 나열**; 각 탭은 **텍스트 라벨**만 두고, **활성**과 **비활성** 두 가지 시각으로 구분한다.

| 상태 | 표시 | 타이포 | 레이아웃 (참고) |
|------|------|--------|-----------------|
| **활성 (ON)** | 하단 **`border-bottom: 3px solid var(--color-primary)`** | **16px Bold**, **`var(--color-text-primary)`** | 높이 **42px**, 좌우 **`padding: 24px`**, 상하 **`padding: 11.5px`** 수준으로 세로 중앙 정렬 |
| **비활성 (OFF)** | **하단 강조선 없음** (배경·밑줄 없는 텍스트 탭) | **16px Regular**, `line-height: 24px`, **`var(--color-text-primary)`** | 활성과 **동일 높이·좌우 패딩**으로 베이스라인 정렬 |

- 인접 탭 사이 구분이 필요하면 **공통 하단 베이스라인**(`1px solid var(--color-border-light)` 등)을 탭 **전체 너비**에 두고, 활성 탭만 **Primary 3px** 로 덮어쓰는 패턴을 쓴다.
- **호버:** 비활성 탭은 `cursor: pointer`, 호버 시 **`--color-primary-10`** 배경 등 **은은한 피드백**을 줄 수 있다(프로젝트 통일).

---

### 9.2 텍스트에어리어 (`<textarea>`)

| 속성 | 규칙 |
|------|------|
| **배경** | **`var(--color-white-100)`** |
| **테두리** | **`1px solid var(--color-black-40)`** |
| **모서리** | **`border-radius: 4px`** |
| **최소 높이** | 디자인 기준 **100px** 전후 — 내용·폼에 맞게 늘릴 수 있으나 **동일 화면 내 통일**. |
| **내부 패딩** | 본문 영역 **`10px`** (테두리 안쪽 텍스트 시작점). 바깥 래퍼에 **`2px`** 여유가 있으면 **합산 패딩**이 어긋나지 않게 한 방식만 쓴다. |
| **본문·플레이스홀더** | **14px Regular**, `line-height: 24px`, 플레이스홀더 **`var(--color-black-40)`**, 입력 텍스트 **`var(--color-text-primary)`**. |
| **리사이즈** | 우하단 **드래그 핸들** 허용(브라우저 기본 또는 커스텀 아이콘). `resize: vertical` 권장(가로 무한 확장 방지). |

포커스·에러·비활성 상태는 **§5 일반 인풋**과 같은 토큰 규칙을 적용한다 — **Focused** 테두리 **`var(--color-primary)`**, **Error** **`var(--color-status-red)`**, **Disabled** 면·글자 **`--color-black-10` / `--color-black-20`** 계열.

---

### 9.3 AI·개발 강제 요약

- **금지:** 탭 활성 구분을 임의 HEX 밑줄로만 지정, 텍스트에어리어 테두리를 인풋 기본과 다른 임의 회색으로 분산.
- **허용:** 탭 = **ON(Primary 3px 하단선·Bold)** / **OFF(선 없음·Regular)**; 텍스트에어리어 = **흰 배경·black40 테두리·4px 라운드·16px/24px**. 포커스·에러는 **§5** 와 동일.
- **검증:** 탭 전환 시 **레이아웃 점프**가 없는지, `textarea`가 **§5** 포커스 링·에러와 충돌하지 않는지 확인한다.

---

## 10. Filter Bar, Filter Panel, Date Picker & Search Dropdown (필터·데이트피커)

테이블 **위**에는 **필터 트리거 + 적용 조건 칩** 한 줄이 있고, 클릭 시 **필터 패널(팝업)** 이 열린다. 패널 안에는 **날짜(Flatpickr)**·**검색형 드롭다운** 등이 올 수 있다. 색은 **`var(--color-…)`** (§1.11). 글씨 크기는 기본 14px.

### 10.1 필터 선택·확인 바 (테이블 상단)

**위치:** 세로형 테이블 **바로 위**, 한 줄. **두 구역으로 나뉘되 `gap: 0`** 으로 맞닿게 한다.

| 구역 | 역할 | 배경 | 테두리(공통) |
|------|------|------|----------------|
| **앞** | 필터 패널을 여는 **버튼** — 필터 아이콘 + **「필터」** 라벨 + (선택) **적용된 조건 개수** 배지 | **`--color-white-100`** | **`1px solid var(--color-primary-40)`** |
| **뒤** | 적용된 조건 **칩**이 가로로 나열, 각 칩에 **라벨·값·개별 닫기**; 맨 끝에 **전체 초기화** | **`var(--color-primary-5)`** | **동일** **`1px solid var(--color-primary-40)`** |

- 두 구역 **모두** 위 테두리 규칙을 **통일**한다(바깥만 둘레가 이어지도록 `border-collapse`·인접 보더 중복 제거 등으로 구현).
- **칩:** 한 조건씩 노출, **닫기**로 해당 조건만 제거.
- **전체 초기화:** 맨 뒤 **`a` 링크** — **`--color-primary`** 텍스트(및 밑줄 유무는 프로젝트 통일). Figma 예시의 **「필터 초기화」** 버튼과 **동일 역할**이면 스타일만 §3 버튼 Small과 맞출 수 있으나, 문서 기준 **전체 리셋은 `<a>`** 로 둔다.

**레이아웃 (참고):** 전체 높이 **50px** 전후, 앞 구역은 아이콘·텍스트·숫자 배지를 `inline-flex` 로 중앙 정렬.

---

### 10.2 필터 패널 (드롭다운·모달)

**구조 (세 블록):**

1. **상단 타이틀 바** — 필터 아이콘 + **「필터」** 제목, 하단 **`1px`** 구분선(패널 테두리와 동일 계열).
2. **본문** — 스크롤 가능 영역 안에 **필터 행**만 세로로 쌓는다.
3. **하단 버튼 바** — `flex` + `space-between`.
4. **색상 및 그림자** - 'background'는 흰색, 보더라인은 primary100%의 색상을 입힌다. 그림자는 x0, y4, blur4, color : black20% 으로 설정한다.

**본문 규칙:**

- **한 줄 = 라벨 + 컨트롤 1세트**, **라벨과 인풋은 가로 정렬**(**§5.0.1 필터 행**).
- **한 열(컬럼)에 필터는 최대 6개**까지 **세로** 나열. 필터 개수가 더 많으면 **2단·3단 그리드**로 컬럼을 나눈다(열 간 **세로 구분선**은 디자인과 동일하게 `0~1px` 중립선).
- 각 그리드 셀 안에서 인풋·드롭다운·라디오 그룹은 **`width: 100%`** 로 **남는 가로를 채운다**(`min-width: 0` 로 flex 수축 허용).

**하단 버튼:**

- **왼쪽:** **필터 초기화**(패널 안 값만 초기화).
- **오른쪽:** **취소** · **필터 적용** (§3 Small/Medium 버튼 타입과 맞춤).

내부 컨트롤은 **§5 필터 인풋**, **§6 라디오**, **§10.3·§10.4** 를 따른다.

---

### 10.3 데이트피커 (Flatpickr 고정)

**구현:** 날짜·기간 선택은 **Flatpickr**만 사용한다(로케일 `ko` 등). `style.css` 의 **`.flatpickr-*` 커스텀**과 **커스텀 푸터(닫기/저장)** 패턴을 유지·확장한다.

#### 트리거 인풋 (활성 전·후)

| 상태 | 테두리 | 기타 |
|------|--------|------|
| **기본** | **`1px solid var(--color-black-40)`** | 높이 **40px**, **`border-radius: 4px`**, 좌우 **`padding: 12px`**, 상하 **`6px`**. 왼쪽 **캘린더 아이콘 20px**, 텍스트와 **`gap: 8px`**. 표시 값 **14px Regular**, **`--color-text-primary`**. 범위는 **`YYYY-MM-DD ~ YYYY-MM-DD`** 형식 권장. |
| **포커스·열림** | **`1px solid var(--color-primary)`** | 동일 치수. |

#### 캘린더 UI (피그마와 동일하게 맞출 것)

- **컨테이너:** 흰 배경, **`1px solid var(--color-primary)`**, **`border-radius: 4px`**, 안쪽 **`padding: 20px`**.
- **범위 선택:** **시작일·종료일**은 **원형**, 배경 **`--color-primary`**, 글자 **`--color-white-100`**. **그 사이 구간**은 행 단위 **`--color-primary-10`** 면으로 이어지는 **캡슐형 하이라이트**(Flatpickr `inRange` 스타일).
- **요일 헤더:** **12px**, 색 **`#999`** 계열(토큰 없으면 **`--color-black-40`** 대비 약한 보조색으로 통일).
- **일자 숫자:** **14px**, 본문 **`#333`** 계열 → **`--color-text-primary`** 에 가깝게.
- **월 제목:** **16px Bold**, **`--color-text-primary`**; 좌우 **이전/다음** **24px** 아이콘 영역.
- **이중 월:** 나란히 두 달(범위 선택), 월 헤더 간격·그리드 열 정렬은 피그마 레이아웃을 따른다.
- **하단:** **닫기** — 흰 배경 + **`1px solid var(--color-primary)`** + Primary 글자; **저장** — 배경 **`--color-primary`** + 흰 글자. 높이 **24px** 전후, **`border-radius: 4px`**, **`padding: 0 10px`**.

Flatpickr 테마는 **선택·범위·오늘** 등 모든 강조색을 **`--color-primary`** 계열로만 맞춘다.

---

### 10.4 드롭다운 + 패널 내 검색

**용도:** 옵션이 많을 때 **트리거 → 패널**에서 **검색으로 걸러 선택**한다.

**트리거 (필터용 셀렉트):**

- 높이 **40px**, 열릴 때(포커스·펼침) **`border: 2px solid var(--color-primary)`**, **`border-radius: 5px`**, 좌우 **15px**, **14px Regular**, 쉐브론 트레일링 — **§5.2 Completed** 계열과 동일한 “강조 테두리” 톤.

**패널:**

- 배경 **`--color-white-100`**, **`1px solid var(--color-black-20)`**, **`border-radius: 5px`**, 안쪽 **`padding: 10px`**.
- **상단:** **§5.4** 의 **드롭다운 안 검색 행**과 동일 — 배경 **`--color-bg-base`**, **테두리 없음**, **32px** 높이, **14px**, 검색 아이콘 + placeholder **`--color-black-40`**.
- **목록:** 스크롤 영역, 항목 **14px**, **`border-radius: 5px`**, 행 패딩 **`7px 10px`**. **「선택안함」** 행은 배경 **`--color-black-10`**. **코드+이름 2열**일 때 코드 **`--color-primary-60`**(또는 동일 투명도), 이름 **`--color-text-primary`**, 열 간 **`gap: 2px`**.
- **스크롤바:** 트랙 **`--color-black-20`** 계열 **얇은 바**로 피그마와 유사하게.

**그리드:** 옵션 내용에 따라 목록을 **1열** 또는 **2열 그리드**로 나눈다(짧은 라벨은 2열, 긴 설명은 1열 등 **화면별 일관**).

---

### 10.5 AI·개발 강제 요약

- **금지:** 필터 날짜에 네이티브만 쓰고 디자인을 맞추려 함, Flatpickr 없이 이중 월·범위 UI를 새로 구현.
- **허용:** §10.1 바, §10.2 패널, **Flatpickr + §10.3 색·레이아웃**, §10.4 검색 드롭다운.
- **검증:** 필터 바 **양 구역 보더 통일·gap 0**, 패널 **6행 초과 시 다단**, 인풋 **`width: 100%`**, 데이트 **Primary 계열만** 사용했는지 확인한다.

---

## 11. Slide Panel (슬라이드 팝업)

화면 **우측**에서 들어오는 **패널형 UI**다. **내부 컨텐츠**는 화면마다 달라지므로 본 절에서는 **껍질·동작·치수·시각 규칙**만 정한다. 시각은 고객사 디자인 시안의 슬라이드 패널 프레임과 맞추되, **수치·동작은 본 절이 우선**이다. 레이아웃·스크롤/하단 분리 패턴은 **자산 소유 현황** 화면의 슬라이드 팝업을 참고할 수 있으나, **구현 수치는 본 절과 다르면 본 절에 맞출 것**.

### 11.1 모달과 구분

- **딤(반투명 전체 오버레이) 없음.** 뒤 페이지·그리드·버튼은 **그대로 클릭 가능**하다.
- **비차단(non-blocking)** 패널로 취급한다. `role="dialog"`, 제목 연결(`aria-labelledby`), 닫기 버튼 **`aria-label="닫기"`** 등은 갖춘다.

### 11.2 단수·너비

| 구성 | 1단 패널 너비 | 2단 패널 너비 |
|------|---------------|---------------|
| **2중이 필요 없는 화면** | **1000px** | — |
| **2중 구조**(1단 안에서 2단 오픈) | **1000px** | **900px** |

- 공통 **`max-width: 100vw`**, 좁은 뷰포트에서는 가로 스크롤 없이 패널이 줄어든다.
- 2단은 1단 **위에 겹쳐** 오른쪽에서 한 겹 더 들어오는 형태로, **z-index**로 2단이 위다.

### 11.3 포인터·다른 항목으로 교체

- **전체 화면 고정 래퍼**는 **`pointer-events: none`**, **패널 박스만 `pointer-events: auto`** 로 두어 뒤 컨텐츠가 클릭되게 한다.
- **슬라이드가 열린 상태**에서 **다른 트리거**(다른 행·버튼 등)로 또 열면: **기존 패널은 닫힐 때 슬라이드 트랜지션 없이** 즉시 사라지고 **새 패널**이 나타난다(또는 동일 패널에 내용만 갱신).

### 11.4 닫기

- **우측 상단** 닫기 아이콘 버튼(Material Symbols `close` 등).
- **슬라이드 패널 영역 밖**(뷰포트에서 패널 직사각형 **밖**)을 클릭해도 닫힌다. 딤이 없으므로 “밖”은 주로 **패널 왼쪽 본문**이다.
- **2단이 함께 열린 상태**에서 바깥 클릭 시 **2단만 먼저 닫기** vs **한 번에 전부 닫기** 중 **제품 안에서 하나로 통일**한다.

### 11.5 영역 구조·패딩·스크롤·하단 버튼

**일반적인 골격:**

1. **타이틀(헤더)** — 상단, **패딩 20px**. 제목·아이콘·우측 닫기.
2. **컨텐츠** — 그 아래, **패딩 30px**. (그 사이·아래에 정보 바·탭 등이 들어갈 수 있으며, **복잡한 화면**은 패딩·구역을 설계에 맞게 조정 가능.)

**하단 버튼:**

- **있을 수도 없을 수도 있음.**
- 있을 때: 패널을 **`flex` 세로 컬럼 + `overflow: hidden`**, 컨텐츠는 **`flex: 1` · `min-height: 0` · `overflow-y: auto`**, 버튼 행은 **`flex-shrink: 0`** 으로 **하단 고정**. 스크롤은 **본문만**, 버튼 줄은 **스크롤에 묻히지 않음**.

### 11.6 배경·테두리·그림자

| 항목 | 규칙 |
|------|------|
| **배경** | **`--color-white-100`** |
| **패널 외곽 테두리** | **없음** |
| **그림자** | **X −4px**, **Y 0**, **blur 20px**, 색 **Black 20%** → **`var(--color-black-20)`** |

```css
.slide-panel {
  background: var(--color-white-100);
  border: none;
  box-shadow: -4px 0 20px var(--color-black-20);
}
```

내부 구분선(헤더 하단 등)은 **§1 토큰** 보더·텍스트로 처리하고, **패널 바깥 한 줄 border**는 두지 않는다.

### 11.7 애니메이션·포커스

- **열기:** 우측 슬라이드 인 트랜지션 가능(시간·이징은 프로젝트 통일).
- **§11.3 교체** 시 **사라지는 패널**은 **트랜지션 없이** 제거.
- **§3.7** 패널 래퍼 `outline` 제거와 실제 컨트롤 `:focus-visible` 규칙을 함께 적용한다.

### 11.8 AI·개발 강제 요약

- **금지:** 전체 딤으로 뒤 클릭 차단, 2중 너비 임의 변경, 패널 외곽 보더를 필터 패널(§10.2)과 혼동해 동일 규칙 적용.
- **허용:** §11.2 너비, §11.6 그림자, §11.5 스크롤/하단 분리, §11.3·§11.4 동작.
- **검증:** 뒤 클릭 가능, 바깥 클릭 닫기, 2단 시 **1200 / 1000**, **`box-shadow: -4px 0 20px var(--color-black-20)`**.

---

## 12. Summary Portlet Pattern (요약 포틀릿 — 느슨한 표준)

메인 화면마다 데이터 모델이 달라도, 요약 포틀릿은 **완전 자유형**이 아니라 **공통 뼈대 + 화면별 변형**으로 관리한다. 본 절은 픽셀 고정 스펙이 아니라 **느슨한 표준**이다.

### 12.1 적용 원칙

- 목적은 “핵심 지표를 빠르게 스캔”하는 것이며, 상세 분석은 하단 테이블/차트로 넘긴다.
- 화면별로 카드 수·지표 항목·보조 표현(도트/바/텍스트)은 달라질 수 있다.
- 다만 **타이포·간격 스케일·토큰 색 체계**는 동일하게 유지한다(§1~§4).

### 12.2 공통 구조(필수)

요약 포틀릿은 아래 3블록을 기본으로 가진다.

1. **헤더 영역**: 제목, 기준 시점(예: 오늘/최근 7일), 보조 액션(새로고침/펼침·접기 등)
2. **핵심 KPI 영역**: 큰 숫자(값) + 단위(건, 대, %) + 증감 정보(선택)
3. **보조 정보 영역**: 세부 분해(예: Pass/Fail, 사업장별, 상태별) 또는 보조 안내

### 12.3 Required / Recommended / Optional

| 등급 | 항목 | 규칙 |
|------|------|------|
| **Required** | 정보 계층 | 제목 → 핵심 값 → 보조 정보 순서를 유지한다. |
| **Required** | 색상 | 임의 HEX 대신 **`var(--color-...)`** 토큰만 사용한다. |
| **Required** | 숫자 표기 | 천단위 구분, 단위 표기(건/대/%), 소수점 자리수 규칙을 화면 내에서 통일한다. |
| **Required** | 상태 표현 | 증감/상태 색은 §4 상태 패밀리 규칙과 일관되게 매핑한다. |
| **Recommended** | 레이아웃 안정성 | 데이터 길이가 달라도 카드 높이·정렬이 크게 흔들리지 않게 한다. |
| **Recommended** | 빈 상태 | 데이터 없음 시 메시지/아이콘/대체값(`-`) 패턴을 제공한다. |
| **Optional** | 보조 시각화 | 미니 바, 도트, 아이콘, 배지 등은 화면 성격에 맞게 선택한다. |
| **Optional** | 상호작용 | 펼침/접기, 드릴다운 링크, 툴팁은 필요한 화면에서만 사용한다. |

### 12.4 화면별 변형 가이드

- **허용되는 변형:** 카드 개수, 보조 지표 형태, 컬럼 수, 접힘/펼침, 강조 지표 우선순위
- **지양할 변형:** 같은 제품 안에서 화면마다 숫자 포맷·상태 색 의미·아이콘 스타일이 바뀌는 것
- **체크 포인트:** “한 화면에서 처음 보는 사용자도 3초 내 핵심 수치 1~2개를 읽을 수 있는가”

### 12.5 금지 사항

- 요약 포틀릿마다 완전히 다른 컴포넌트 철학(타이포/간격/색 시스템)을 도입하는 것
- 동일 의미의 상태를 화면마다 다른 색으로 표현하는 것
- 데이터가 길어졌다는 이유로 포틀릿 자체를 임의 테이블처럼 변형해 가독성을 깨는 것

### 12.6 AI·개발 강제 요약

- **금지:** 포틀릿을 화면마다 별개 디자인 시스템으로 구현, 상태색/숫자 포맷 임의 변경.
- **허용:** 공통 뼈대 유지 + 화면별 데이터 특성에 맞는 변형(카드 수/보조 지표/접힘 여부).
- **검증:** 정보 계층(제목→값→보조) 유지, 토큰 사용, 숫자·상태 규칙의 화면 간 일관성.

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

