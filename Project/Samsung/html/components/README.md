# LNB / GNB 공통 컴포넌트

다른 페이지에서도 동일한 사이드메뉴(LNB)와 상단바(GNB)를 쓰려면 아래 구조로 작성하면 됩니다.

## 사용 방법

1. **HTML 구조**  
   `index.html`, `asset-status.html`처럼 다음 placeholder를 두고, 그 아래에 각 페이지의 `<main>` 콘텐츠만 넣습니다.

```html
<div id="app" class="vh-100 d-flex flex-column">
  <div class="d-flex flex-grow-1 min-h-0 bg-custom-base" style="min-width: 1440px;">
    <div id="lnb-placeholder" class="flex-shrink-0" style="width: 260px;"></div>
    <div class="main-content-wrap d-flex flex-column flex-grow-1 min-h-0 position-relative">
      <div id="gnb-placeholder"></div>
      <main class="flex-grow-1 ...">
        <!-- 이 페이지 전용 콘텐츠 -->
      </main>
    </div>
  </div>
</div>
```

2. **스크립트**  
   `script.js` 대신 컴포넌트 로더만 넣습니다. 로더가 LNB/GNB를 채운 뒤 `script.js`를 자동으로 불러옵니다.

```html
<script src="components/load.js"></script>
```

3. **GNB 제목 변경**  
   페이지별 상단 제목을 바꾸려면 `<head>` 안에 메타 태그를 넣습니다.

```html
<meta name="gnb-title" content="자산 소유 현황" />
```

## 파일 구성

- `lnb.html` – LNB + 서브메뉴 마크업
- `gnb.html` – GNB 헤더 + 매뉴얼/프로필 팝오버
- `load.js` – 위 두 파일을 불러와 placeholder에 넣고 `script.js` 로드
