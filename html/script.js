/**
 * Vanilla JS - 대시보드 인터랙션
 * (탭 전환, 체크박스, 필터 모달, LNB 접기 등은 필요 시 addEventListener + classList로 구현)
 */
(function () {
  'use strict';

  const lnb = document.getElementById('lnb');
  const lnbToggle = document.getElementById('lnb-toggle');
  if (lnbToggle && lnb) {
    lnbToggle.addEventListener('click', function () {
      lnb.classList.toggle('collapsed');
      // 접힌 상태일 때 너비 80px 등 스타일은 CSS .lnb.collapsed 로 제어 가능
    });
  }
})();
