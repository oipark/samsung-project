# 디자인 토큰 (Design Tokens)

Figma 디자인 시스템과 코드를 맞추기 위한 토큰 정의입니다.

## 구조

- **`tokens.js`**  
  - 색상 참조 (`colors`), 뱃지 변형 (`BADGE_INSPECTION`, `BADGE_APPLICATION`), 테이블 스타일 등
  - Figma 스타일명을 주석으로 표기해 두었습니다.

- **`../index.css` (`:root`)**  
  - 실제 색상/그림자/radius 값은 CSS 변수로 정의
  - 토큰에서 `var(--color-*)` 형태로 참조

## Figma와 맞추는 방법

1. **색상**  
   Figma Variables / Style에서 hex 값을 가져와 `index.css`의 `:root` 변수 값을 수정합니다.

2. **뱃지**  
   Figma 컴포넌트(예: 점검계획 스테이터스, 신청상황_18px)의 배경/테두리/글자색을 확인한 뒤  
   `theme/tokens.js`의 `BADGE_INSPECTION`, `BADGE_APPLICATION` 객체를 수정합니다.

3. **테이블**  
   헤더/셀 스타일이 바뀌면 `tokens.js`의 `tableStyles`와 `components/ui/Table.jsx`를 함께 수정합니다.
