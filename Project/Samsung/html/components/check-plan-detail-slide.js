/**
 * 점검계획 상세정보 오프캔버스 슬라이드
 * - #check-plan-detail-wrap 있을 때만 동작
 * - openCheckPlanDetail(row) 로 테이블 행 기준 상세 열기
 */
(function () {
  'use strict';

  var WRAP_ID = 'check-plan-detail-wrap';
  var PANEL_ID = 'check-plan-detail-panel';

  function openDetail(row) {
    var wrap = document.getElementById(WRAP_ID);
    var panel = document.getElementById(PANEL_ID);
    if (!wrap || !panel) return;
    wrap.style.display = '';
    if (row && row.querySelectorAll('td').length >= 5) {
      var cells = row.querySelectorAll('td');
      var planName = cells[2] ? cells[2].textContent.trim() : '';
      var el = document.getElementById('check-plan-name');
      if (el) el.value = planName;
      el = document.getElementById('check-plan-site');
      if (el) el.value = cells[4] ? cells[4].textContent.trim() : '';
      el = document.getElementById('check-plan-dept');
      if (el) el.value = '';
      el = document.getElementById('check-plan-system');
      if (el) el.value = '';
    }
    wrap.classList.add('is-open');
    wrap.setAttribute('aria-hidden', 'false');
    panel.focus();
  }

  function closeDetail() {
    var wrap = document.getElementById(WRAP_ID);
    if (!wrap) return;
    wrap.classList.remove('is-open');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.display = 'none';
  }

  var CHECK_PLAN_TBODY_ID = 'check-plan-tbody';
  var TRIGGER_COLUMN_INDEX = 2; /* 점검명 */

  function init() {
    var wrap = document.getElementById(WRAP_ID);
    if (!wrap) return;

    var overlay = document.getElementById('check-plan-detail-overlay');
    var closeBtn = document.getElementById('check-plan-detail-close');
    if (overlay) overlay.addEventListener('click', closeDetail);
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);

    window.openCheckPlanDetail = openDetail;

    /* 점검명 셀 클릭 시 슬라이드 오픈 (자산현황 서버명 클릭과 동일) */
    document.addEventListener('click', function (e) {
      var td = e.target.closest('td');
      if (!td || td.cellIndex !== TRIGGER_COLUMN_INDEX) return;
      var tbody = td.closest('tbody');
      if (!tbody || tbody.id !== CHECK_PLAN_TBODY_ID) return;
      var tr = td.closest('tr');
      if (tr) openDetail(tr);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
