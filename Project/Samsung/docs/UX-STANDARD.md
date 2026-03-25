# AI 주도형 UX/UI 표준 가이드 v2.0

> **[System Directive for AI]**
> 너는 메니인소프트 정보보호포털의 프론트엔드 코드를 생성하는 'UX/UI Core Guardian'이다. 
> 본 문서에 정의된 모든 규칙(Rules), 제약(Constraints), 명명 규칙(Naming Conventions), 변수(Tokens)는 절대적인 기준이다. 신규 UI/UX 생성 시 반드시 이 문서의 뼈대와 물리 법칙을 상속받아 코드를 작성하라.

---

## 1. Design Tokens & Theme Constraints (디자인 토큰)

### 1.0 전제 — Primary(메인 브랜드 컬러)는 **고객사·빌드마다 바뀐다**

- **메인 컬러 = `--color-primary`**. 솔루션 전역의 “브랜드 축”은 이 변수(와 아래 **Primary 파생** 변수들)로만 표현한다.
- **본 문서에는 색상 리터럴(HEX, `rgb()`, `rgba()` 숫자)을 적지 않는다.**  
  이유: 문서만 다른 PC·레포에 복사해도 “특정 고객사 색이 박힌 공식 문서”가 되지 않게 하기 위함이다. **실제 픽셀 값은 오직 구현 파일** (예: `Project/Samsung/html/style.css`의 `:root`) 에만 둔다.
- **동작 보장:** 화면·컴포넌트 CSS/마크업에서는 **항상 `var(--토큰이름)`만** 쓴다. 그래야 Primary만 `:root`에서 갈아끼워도 레이아웃·대비 관계가 유지되고 오류 없이 재사용된다.
- **단일 소스:** 토큰의 **현재 기본값**은 항상 `style.css` 맨 위 `:root`가 기준이다. 본 절은 **이름·의미·관계**만 정의한다.

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

고정 **검정 베이스**에서 투명도만 줄인 스케일. 본문·구분선·비활성 등에 쓴다. (구체 수치는 `style.css` 참고)

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

**참고 파일:** [디자인 시스템 · Color · Status](https://www.figma.com/design/8WXSIme1vHHblQwqHbggyD/%EB%94%94%EC%9E%90%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C?node-id=2-363&m=dev) (`node-id=2-363`)

의미색은 **색상 패밀리 8종**(Purple, Indigo, Blue, Cyan, Green, Yellow, Orange, Red)마다 아래 **3단계**만 쓴다. 구체 수치는 `style.css` `:root`에만 두고, 여기서는 **단계별 역할**만 고정한다.

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
| `--color-border-panel` | `:root`에 정의 | 패널·슬레이트 느낌 구분선 |
| `--color-card-accent` | `:root`에 정의 | 카드 강조 배경 (브랜드 바뀌면 조정 검토) |
| `--color-emergency` | `:root`에 정의 | 긴급·강조 알림 면 |
| `--color-badge-success` | `:root`에 정의 | 성공 뱃지 배경 |
| `--color-badge-success-text` | → `--color-status-green` | 성공 뱃지 글자 |
| `--color-f1f5f9` | `:root`에 정의 | 유틸 단색 면 |
| `--color-logo` | 다른 토큰 참조(구현 확인) | 로고·브랜드 마크 톤 |
| `--color-button-primary-hover` | 다른 토큰 참조(구현 확인) | 레거시/호환 호버 별칭 |

**일반 테두리**가 필요하면 **`--color-border`** 또는 **`--color-border-panel`** 중 UI 맥락에 맞는 쪽을 쓴다.

---

### 1.10 그림자·모서리 (비색 토큰)

카드·팝오버·버튼·뱃지의 **깊이·라운딩**. 구체 수치·그림자 식은 **`style.css` `:root`**만 본다.

| CSS 변수 | 용도 |
|----------|------|
| `--shadow-card` | 카드 그림자 |
| `--shadow-popover` | 팝오버·플로팅 |
| `--radius-card` | 카드·큰 박스 |
| `--radius-button` | 버튼 |
| `--radius-popover` | 팝오버 |
| `--radius-badge` | 뱃지 |

---

### 1.11 AI·개발 강제 규칙 (테마 안전)

- **금지:** 브랜드·테두리·배경·상태 표현에 **문자열로 색 숫자를 박는 것** (`#rrggbb`, `rgb(...)`, `rgba(...)` 를 컴포넌트 단 CSS/HTML 스타일에 직접 기입).
- **허용:** `var(--color-…)` 만 사용. 예외가 필요하면 **먼저 `:root`에 토큰을 추가**한 뒤 변수로 참조한다.
- **Primary 교체 후 검증:** 전역 검색으로 **이전 고객사 RGB/HEX 리터럴**이 남아 있지 않은지 확인한다.

---

### 1.12 코드 작성 시 한 줄 요약

- **브랜드(가변):** `--color-primary`, `--color-primary-hover`, 알파 단계는 `--color-primary-80`·`-60`·`-40`·`-20`·`-10`·`-5`, 연한 배경 별칭 `--color-primary-bg`
- **글자:** `--color-text-primary` → `--color-text-secondary` → `--color-text-muted`
- **바탕:** `--color-bg-base` / `--color-bg-subtle` / `--color-bg-white`
- **테두리:** `--color-border`, `--color-border-light`, 필요 시 `--color-border-panel`
- **상태:** 패밀리별 **본색 → Light → White** 3단 (`--color-status-{색}`, `--color-status-light-{색}`, `--color-status-white-{색}`). 구 탭용 `*-10`은 White와 동일 용도

---

## 2. Typography & Font Style Rules (폰트 스타일 규칙)

본 절은 `Project/Samsung/html/components/컴포넌트-구조.md` §8과 동일 축이다. 구현의 **단일 소스**는 `Project/Samsung/html/style.css` 이다.

### 2.1 본문·UI 텍스트 (Pretendard)

- **강제:** 모든 UI 문자열은 **Pretendard** 패밀리만 사용한다. 페이지·컴포넌트 전용 CSS에서 `font-family`를 임의의 웹폰트·시스템 폰트로 바꾸지 않는다.
- **CSS 변수:** `var(--font-pretendard)`  
  - `:root` 정의: `'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- **적용 범위:** `:root`·`body`·`#app` 및 그 하위 **버튼·카드·폼·테이블·드롭다운** 등은 `style.css`에서 위 스택으로 통일한다. (Bootstrap 등 외부 스타일이 덮어쓰지 않도록 프로젝트 규칙을 따른다.)
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

## 3. Component Naming Convention (컴포넌트 명명 규칙)
AI는 피그마 디자인 레이어 및 개발 컴포넌트의 명칭을 분석하여, 아래 공식에 따라 맥락과 상태를 인지하고 코드를 자동 매핑한다.

- **Format:** `[ComponentType] / [Context_DataType] / [State]`
- **Example:** `Input / Admin_Auth_ID / Error`
- **Allowed States:** `Default`, `Hover`, `Disabled`, `Error`, `Focused`, `ReadOnly`

---

## 4. Layout Architecture (레이아웃 및 Wrapper-Slot 구조)

### 4.1 Global Layout (불변의 공통 영역)
GNB(상단)와 LNB(좌측)는 솔루션의 고정된 뼈대인 `<GlobalLayout>` 컴포넌트로 캡슐화되어 있다. 
- **Constraint:** AI는 신규 화면이나 기능을 생성할 때 GNB와 LNB의 구조, 스타일, DOM 트리를 절대 직접 수정하거나 침범해서는 안 된다.

### 4.2 Content Slot (가변 콘텐츠 영역)
- **Rule:** 신규 화면의 모든 UI(대시보드, 목록, 등록 폼 등)는 반드시 `<GlobalLayout>` 내부의 가변 영역인 `<main class="content-area">` 슬롯(Slot/Children) 내부에만 렌더링되도록 코드를 작성한다.

---

## 5. Form & Validation Matrix (입력 폼 및 유효성 검증)
인풋 컴포넌트 생성 시, 컴포넌트에 부여된 `DataType`을 기반으로 아래의 유효성 검증 로직과 Error UI 노출 로직을 자동 포함하여 코드를 생성한다.

| DataType | Trigger Event | Validation Rule (검증 조건) | Error UI & Message (실패 시 노출) |
| :--- | :--- | :--- | :--- |
| `required` | `onBlur` / `onSubmit` | 값이 Null 또는 빈 문자열일 경우 | "필수 입력 항목입니다." |
| `date_past` | 날짜 선택 완료 시 | 선택된 날짜 < `Today` 일 경우 | "시작일은 과거로 설정할 수 없습니다." |
| `ip_address` | `onChange` (타이핑) | IPv4 / IPv6 정규표현식 매칭 실패 시 | "올바른 IP 형식이 아닙니다." |
| `reason_text`| 글자 수 체킹 로직 | 텍스트 길이를 측정하여 10자 미만일 경우 | "상세 사유를 10자 이상 입력해주세요." |
| `keyword` | `onChange` (타이핑) | 특수문자 입력 시도 감지 시 | (메시지 없음) 해당 입력 자체를 `preventDefault` 처리 |

---

## 6. Composition Standard (모달 및 슬라이드 패널 합성 표준)

### 6.1 Slide Panel (Drawer)
상세 정보 조회/수정에 사용되는 우측 슬라이드 패널은 Container와 Content를 분리하여 합성(Composition) 구조로 렌더링한다.
- **Wrapper (Container):** `<SlidePanel>` 사용. 너비(1000px), Dimmed 오버레이, 슬라이드 모션, Header(제목, 닫기), Footer(저장/취소 버튼)는 이 컴포넌트에 고정.
- **Slot (Content):** 패널 내부의 구체적인 폼이나 테이블 데이터는 `<SlidePanel>` 호출 시 `children` props로 주입하여 렌더링한다.

### 6.2 Multi-level Panel (2중 슬라이드)
- 1차 패널 위에 2차 패널(예외 신청 등)이 겹쳐 열리는 구조를 허용한다 (최대 2 depth).
- **Rule:** 2차 패널 렌더링 시, 기존 1차 패널은 어둡게 비활성화(Dimmed) 처리하며, 2차 패널 닫기 이벤트 발생 시 1차 패널 상태로 복귀하는 라우팅/상태 관리를 구현한다.

---

## 7. Micro-Interaction Physics (마이크로 인터랙션 물리 법칙)
모든 동적 UI 전환 및 애니메이션은 하드코딩을 배제하고 아래의 글로벌 물리 법칙(CSS Transition/Animation)을 강제 적용한다.

- **Fast (`0.15s ease-in-out`):** 버튼 Hover 시 명도 변경, 체크박스 토글, 툴팁 렌더링
- **Base (`0.3s ease-in-out`):** 드롭다운/팝오버 열림, 트리 메뉴 접기/펼치기
- **Slow (`0.4s ease-out`):** 슬라이드 패널 등장, 모달 팝업 등장, 토스트 알림 등장

**[State Feedback Rules]**
- **Hover:** 요소에 `cursor: pointer` 적용 및 `var(--color-primary-hover)`로 전환.
- **Focus:** 키보드 탭(Tab) 접근 시 요소 외곽에 2px 두께의 `var(--color-primary)` Outline 강제 렌더링.
- **Active:** 버튼 클릭 이벤트 발생 시 `transform: scale(0.98)`을 적용하여 눌림 효과 구현.

---

## 8. Domain Business Logic (비즈니스 로직 및 상태 변경)

### 8.1 Submission Flow (임시저장 vs 제출 패턴)
AI는 폼 전송 이벤트 구현 시 아래의 분기 로직을 반드시 따른다.

- **`[임시저장]` 액션:**
  - `required` 검증 등 모든 Validation Bypass.
  - 즉시 Save API 호출 -> 완료 시 Toast Alert("임시저장되었습니다.", `bg-secondary`, 3초 후 Unmount).
- **`[제출]` 액션:**
  - 화면 내 전체 필드 Validation 실행.
  - **Error 핸들링:** 검증 실패 시 최상단 에러 필드로 `window.scrollTo` 및 `element.focus()` 자동 실행.
  - **Success 핸들링:** 검증 통과 시 다이얼로그 모달("제출하시겠습니까? 제출 후에는 수정이 제한됩니다.") 호출 -> `[확인]` 클릭 시 Submit API 호출 -> 완료 Toast 노출 후 목록 페이지 라우팅.

### 8.2 Data Protection (데이터 보호 및 경고)
- **삭제 차단:** 참조 중인 데이터 삭제 API 호출 시 (HTTP 409 Conflict 등), 브라우저 기본 `alert()` 사용을 금지하며 시스템 커스텀 `<Modal>`을 호출하여 참조 건수 및 차단 사유를 렌더링한다.
- **상태 변경:** '운영상태' 토글 등 중요 State 변경 시 "비활성화하면 점검이 일시 중지됩니다" 등의 경고를 포함한 `<Modal>`을 선행 노출하여 유저 컨펌을 받는다.

---

## 9. Iconography (아이콘 사용 규칙)
- **라이브러리 강제:** 프로젝트의 모든 아이콘은 오직 `Google Material Symbols (Outlined)`만 사용한다. 
- **금지 사항:** FontAwesome, Lucide, Heroicons 등 타 라이브러리 사용 및 SVG Path 직접 드로잉을 절대 금지한다.
- **알맞는 아이콘이 없을때:** 아이콘을 렌더링할 때는 알맞는 아이콘이 없을경우 최대한 비슷한 아이콘을 골라서 사용한다.
- **코드 작성 포맷:** 아이콘을 렌더링할 때는 반드시 아래의 HTML/컴포넌트 구조를 따른다.
  - `(예시) <span class="material-symbols-outlined">search</span>`

---

## 10. Company Logo Image (기업 로고 자동 배치 규칙)
- **로고 경로:** 기업 로고 이미지는 `/assets/logos/` 폴더 내에 위치한다.
- **파일명 매칭 (Naming Rule):** - AI는 화면에 기업 로고를 렌더링할 때, 전달받은 데이터의 `company_id` 또는 `영문 기업명`을 조합하여 이미지 경로를 자동 생성해야 한다.
  - `(포맷) /assets/logos/{company_name}_logo.png`
- **Fallback (대체 이미지):** 만약 해당 기업의 로고 파일이 존재하지 않거나 로드에 실패할 경우, 무조건 `/assets/logos/default_logo.png`를 노출하도록 에러 핸들링 코드를 작성한다.

---

## 11. Frontend Architecture & Component Loading Rules

본 프로젝트는 순수 HTML/JS 기반의 동적 컴포넌트 로딩 시스템을 사용한다. AI가 새로운 HTML 페이지나 JS 로직을 생성할 때는 반드시 아래의 렌더링 파이프라인과 규칙을 엄격히 준수해야 한다.

### 11.1 신규 HTML 페이지 생성 규칙 (Boilerplate)
새로운 화면(예: `new-page.html`)을 생성할 때, GNB, LNB 등의 공통 영역을 하드코딩해서는 안 되며, 반드시 `load.js`가 인식할 수 있는 **Placeholder** 형태로 뼈대를 구성해야 한다.

- **[필수 태그 구조]**
  1. `<head>` 내부에 페이지 제목 설정: `<meta name="gnb-title" content="페이지 제목">`
  2. 본문(Body) 좌측 메뉴 영역: `<div id="lnb-placeholder"></div>`
  3. 본문(Body) 상단 바 영역: `<div id="gnb-placeholder"></div>`
  4. 공통 로더 스크립트 삽입: `<script src="components/load.js"></script>` (이 스크립트 하나만 직접 로드한다)

### 11.2 동적 DOM 주입 및 스크립트 실행 타이밍 (Race Condition 방지)
모든 컴포넌트 HTML은 `load.js`를 통해 비동기(Promise.all)로 fetch되어 DOM에 주입된다. 따라서 AI는 스크립트 작성 시 DOM 요소가 즉시 존재한다고 가정해서는 안 된다.

- **[이벤트 리스너 강제]**
  - 자산 테이블이나 상세 슬라이드 등 동적으로 주입되는 DOM을 조작하는 JS 로직을 작성할 때는, 절대 최상단에서 즉시 실행(`DOMContentLoaded` 포함)하지 마라.
  - 반드시 `load.js`가 DOM 주입을 완료하고 발행하는 커스텀 이벤트를 수신한 뒤에 초기화 함수를 실행하도록 작성한다.
  - **예시 코드:** `document.addEventListener('asset-table-ready', initMyTableFunction);`

### 11.3 특수 컴포넌트 사용 규칙 (자산 현황 테이블 및 슬라이드)
- 데이터 테이블 목록이 필요한 페이지를 구성할 때는 `<section class="asset-table-section" id="asset-table-section-placeholder"></section>` 태그를 삽입하라.
- 상세 정보가 우측에서 열리는 패널이 필요한 경우, `</main>` 태그 바깥 최하단에 `<div id="asset-detail-placeholder"></div>`를 위치시켜라. `load.js`가 알아서 HTML 조각과 이벤트 핸들러(`asset-detail-slide.js`)를 주입할 것이다.