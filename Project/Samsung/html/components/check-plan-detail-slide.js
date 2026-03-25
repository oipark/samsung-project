/**
 * 점검계획 상세정보 슬라이드 팝업 (asset-detail-slide.js 패턴 동일)
 * - #check-plan-detail-wrap 있을 때만 동작
 * - 점검명 셀(col 2) 클릭 → 패널 오픈, 데이터 채우기
 * - 콘텐츠는 페이지의 <template id="check-plan-detail-content"> 에서 주입
 */
(function () {
  'use strict';

  var WRAP_ID  = 'check-plan-detail-wrap';
  var PANEL_ID = 'check-plan-detail-panel';
  var TBODY_ID = 'check-plan-tbody';
  var TRIGGER_COL = 2; /* 점검명 열 */

  /* ── 템플릿 콘텐츠 패널 바디에 주입 ─────────────────────── */
  function injectContent() {
    var panelBody = document.getElementById('check-plan-detail-body');
    if (!panelBody) return;
    var tpl = document.getElementById('check-plan-detail-content');
    if (!tpl) return;
    if (tpl.content && tpl.content.cloneNode) {
      panelBody.appendChild(tpl.content.cloneNode(true));
    } else {
      panelBody.innerHTML = tpl.innerHTML;
    }
  }

  /* ── 테이블 행 데이터 → 폼 채우기 ───────────────────────── */
  function fillForm(row) {
    var cells = row ? row.querySelectorAll('td') : [];
    function set(id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val || '';
    }
    /* 테이블 컬럼: 0=cb, 1=순번, 2=점검명, 3=진행상태, 4=사업장, 5=점검일 */
    set('check-plan-name', cells[2] ? cells[2].textContent.trim() : '');
    set('check-plan-site', cells[4] ? cells[4].textContent.trim() : '');
    set('check-plan-dept',   '');
    set('check-plan-system', '');
  }

  /* ── 열기 / 닫기 ─────────────────────────────────────────── */
  function openPanel(row) {
    var wrap  = document.getElementById(WRAP_ID);
    var panel = document.getElementById(PANEL_ID);
    if (!wrap) return;

    if (wrap.classList.contains('is-open') && panel) {
      /* 다른 행 클릭: 전환 없이 즉시 갱신 */
      wrap.classList.remove('is-open');
      wrap.setAttribute('aria-hidden', 'true');
      panel.style.transition = 'none';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fillForm(row);
          panel.style.transition = '';
          wrap.classList.add('is-open');
          wrap.setAttribute('aria-hidden', 'false');
          if (panel) panel.focus();
        });
      });
    } else {
      fillForm(row);
      wrap.classList.add('is-open');
      wrap.setAttribute('aria-hidden', 'false');
      if (panel) panel.focus();
    }
  }

  function closePanel() {
    var wrap = document.getElementById(WRAP_ID);
    if (!wrap) return;
    wrap.classList.remove('is-open');
    wrap.setAttribute('aria-hidden', 'true');
  }

  /* ── 초기화 ─────────────────────────────────────────────── */
  function init() {
    var wrap = document.getElementById(WRAP_ID);
    if (!wrap) return;

    injectContent();

    var overlay  = document.getElementById('check-plan-detail-overlay');
    var closeBtn = document.getElementById('check-plan-detail-close');
    if (overlay)  overlay.addEventListener('click', closePanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    /* 점검명 셀 클릭 */
    document.addEventListener('click', function (e) {
      var td = e.target.closest('td');
      if (!td) return;
      var tbody = td.closest('tbody');
      if (!tbody || tbody.id !== TBODY_ID) return;
      if (td.cellIndex !== TRIGGER_COL) return;
      var tr = td.closest('tr');
      if (tr) openPanel(tr);
    });

    /* 패널 외부 클릭 시 닫기 */
    document.addEventListener('click', function (e) {
      var panel = document.getElementById(PANEL_ID);
      if (!wrap.classList.contains('is-open')) return;
      if (panel && panel.contains(e.target)) return;
      var td = e.target.closest('td');
      if (td && td.cellIndex === TRIGGER_COL) {
        var tb = td.closest('tbody');
        if (tb && tb.id === TBODY_ID) return;
      }
      closePanel();
    });

    window.openCheckPlanDetail = openPanel;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
