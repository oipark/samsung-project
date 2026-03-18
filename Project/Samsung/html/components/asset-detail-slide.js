/**
 * 자산 상세 정보 슬라이드 팝업 컴포넌트
 * - #asset-detail-wrap 이 있을 때만 동작 (placeholder에 HTML 주입 후 로드)
 * - 테이블 .asset-table-tbody 의 서버 명 컬럼(기본 3번째) 클릭 시 1단 패널 오픈
 * - 1단 내 "자산 변경 이력" 클릭 시 2단 패널 오픈
 * - 빈곳 클릭 시 2단 → 1단 순으로 한 단계씩 닫힘
 */
(function () {
  'use strict';

  var WRAP_ID = 'asset-detail-wrap';
  var PANEL_ID = 'asset-detail-panel';
  var PANEL2_ID = 'asset-detail-panel-2';
  var TABLE_BODY_CLASS = 'asset-table-tbody';
  var TRIGGER_COLUMN_INDEX = 2;

  function getCellText(cell) {
    if (!cell) return '';
    var badge = cell.querySelector('.region-badge');
    if (badge) return badge.textContent.trim();
    var osCell = cell.querySelector('.asset-os-cell');
    if (osCell) return osCell.textContent.trim().replace(/\s+/g, ' ').trim();
    return cell.textContent.trim();
  }

  function fillDetailForm(row, setField) {
    var cells = row.querySelectorAll('td');
    if (cells.length < 17) return;
    setField = setField || function (id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val || '';
    };
    setField('detail-server-name', getCellText(cells[2]));
    setField('detail-ip', getCellText(cells[3]));
    setField('detail-os', getCellText(cells[4]));
    setField('detail-os-version', getCellText(cells[5]));
    setField('detail-region', getCellText(cells[7]));
    setField('detail-site', getCellText(cells[8]));
    setField('detail-location', getCellText(cells[11]));
    setField('detail-system', getCellText(cells[12]));
    setField('detail-usage', getCellText(cells[13]));
    setField('detail-irp', getCellText(cells[15]));
    setField('detail-year', getCellText(cells[16]));
  }

  function injectContent() {
    var panelBody = document.getElementById('asset-detail-panel-body');
    var panel2Body = document.getElementById('asset-detail-panel-2-body');
    if (!panelBody || !panel2Body) return;

    var src1 = document.getElementById('asset-detail-panel-content');
    var src2 = document.getElementById('asset-detail-panel-2-content');

    if (src1) {
      if (src1.content && src1.content.cloneNode) {
        panelBody.appendChild(src1.content.cloneNode(true));
      } else {
        panelBody.innerHTML = src1.innerHTML;
      }
    }

    if (src2) {
      if (src2.content && src2.content.cloneNode) {
        panel2Body.appendChild(src2.content.cloneNode(true));
      } else {
        panel2Body.innerHTML = src2.innerHTML;
      }
    }
  }

  function init() {
    var detailWrap = document.getElementById(WRAP_ID);
    if (!detailWrap) return;

    injectContent();

    var detailPanel = document.getElementById(PANEL_ID);
    var detailClose = document.getElementById('asset-detail-close');

    function openDetailPanel(row) {
      /* 다른 서버 행 클릭 시 2단(자산 변경 이력)까지 전부 닫고 해당 서버 1단만 열기 */
      if (detailWrap.classList.contains('is-open-2')) {
        detailWrap.classList.remove('is-open-2');
        var panel2 = document.getElementById(PANEL2_ID);
        if (panel2) panel2.setAttribute('aria-hidden', 'true');
      }

      var wasOpen = detailWrap.classList.contains('is-open');
      if (wasOpen && detailPanel) {
        detailWrap.classList.remove('is-open');
        detailWrap.setAttribute('aria-hidden', 'true');
        detailPanel.style.transition = 'none';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            fillDetailForm(row);
            detailPanel.style.transition = '';
            detailWrap.classList.add('is-open');
            detailWrap.setAttribute('aria-hidden', 'false');
            if (detailPanel) detailPanel.focus();
          });
        });
      } else {
        fillDetailForm(row);
        detailWrap.classList.add('is-open');
        detailWrap.setAttribute('aria-hidden', 'false');
        if (detailPanel) detailPanel.focus();
      }
    }

    function closeDetailPanel() {
      detailWrap.classList.remove('is-open', 'is-open-2');
      detailWrap.setAttribute('aria-hidden', 'true');
      var panel2 = document.getElementById(PANEL2_ID);
      if (panel2) panel2.setAttribute('aria-hidden', 'true');
    }

    function openHistoryPanel() {
      detailWrap.classList.add('is-open-2');
      var panel2 = document.getElementById(PANEL2_ID);
      if (panel2) {
        panel2.setAttribute('aria-hidden', 'false');
        panel2.focus();
      }
    }

    function closeHistoryPanel() {
      detailWrap.classList.remove('is-open-2');
      var panel2 = document.getElementById(PANEL2_ID);
      if (panel2) panel2.setAttribute('aria-hidden', 'true');
    }

    document.addEventListener('click', function (e) {
      var td = e.target.closest('td');
      if (!td || td.cellIndex !== TRIGGER_COLUMN_INDEX) return;
      var tbody = td.closest('tbody');
      if (!tbody || !tbody.classList.contains(TABLE_BODY_CLASS)) return;
      var tr = td.closest('tr');
      if (tr) openDetailPanel(tr);
    });

    if (detailClose) detailClose.addEventListener('click', closeDetailPanel);

    detailWrap.addEventListener('click', function (e) {
      if (e.target.closest('.asset-detail-open-history')) {
        e.stopPropagation();
        openHistoryPanel();
      }
    });

    var detailClose2 = document.getElementById('asset-detail-close-2');
    if (detailClose2) detailClose2.addEventListener('click', closeHistoryPanel);

    document.addEventListener('click', function (e) {
      var panel1 = document.getElementById(PANEL_ID);
      var panel2 = document.getElementById(PANEL2_ID);
      if (panel1 && panel1.contains(e.target)) return;
      if (panel2 && panel2.contains(e.target)) return;
      var openTd = e.target.closest('td');
      if (openTd && openTd.cellIndex === TRIGGER_COLUMN_INDEX) {
        var openTbody = openTd.closest('tbody');
        if (openTbody && openTbody.classList.contains(TABLE_BODY_CLASS)) return;
      }
      if (detailWrap.classList.contains('is-open-2')) {
        closeHistoryPanel();
      } else if (detailWrap.classList.contains('is-open')) {
        closeDetailPanel();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
