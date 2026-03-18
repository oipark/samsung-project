/**
 * 점검계획 관리 페이지 전용 테이블: 행 제한, 체크박스, 상세 버튼
 */
(function () {
  'use strict';

  function initCheckPlanTable() {
    var tbody = document.getElementById('check-plan-tbody');
    var thCheckAll = document.getElementById('check-plan-th-check-all');
    if (!tbody) return;

    function syncThCheckAll() {
      if (!thCheckAll || !tbody) return;
      var rowCbs = tbody.querySelectorAll('.custom-checkbox');
      var checkedCount = 0;
      rowCbs.forEach(function (cb) { if (cb.checked) checkedCount++; });
      thCheckAll.checked = checkedCount === rowCbs.length && rowCbs.length > 0;
      thCheckAll.indeterminate = checkedCount > 0 && checkedCount < rowCbs.length;
    }

    tbody.querySelectorAll('.custom-checkbox').forEach(function (cb) {
      cb.removeEventListener('change', cb._rowChange);
      cb._rowChange = function () {
        var row = this.closest('tr');
        if (row) {
          if (this.checked) row.classList.add('asset-table-row-selected');
          else row.classList.remove('asset-table-row-selected');
        }
        syncThCheckAll();
      };
      cb.addEventListener('change', cb._rowChange);
    });

    if (thCheckAll) {
      thCheckAll.removeEventListener('change', thCheckAll._thChange);
      thCheckAll._thChange = function () {
        var checked = this.checked;
        tbody.querySelectorAll('tr').forEach(function (tr) {
          var cb = tr.querySelector('.custom-checkbox');
          if (cb) {
            cb.checked = checked;
            if (checked) tr.classList.add('asset-table-row-selected');
            else tr.classList.remove('asset-table-row-selected');
          }
        });
      };
      thCheckAll.addEventListener('change', thCheckAll._thChange);
    }

    function applyRowLimit() {
      var sel = document.getElementById('check-plan-pagination-select');
      var infoEl = document.getElementById('check-plan-pagination-info');
      if (!tbody || !sel) return;
      var rows = tbody.querySelectorAll('tr');
      var total = rows.length;
      var limit = Math.max(1, parseInt(sel.value, 10) || 10);
      rows.forEach(function (tr, i) {
        if (i < limit) tr.classList.remove('d-none');
        else tr.classList.add('d-none');
      });
      var shown = Math.min(limit, total);
      if (infoEl) infoEl.textContent = '전체 ' + total + '개 중 1-' + shown + ' 표시';
    }

    var rowLimitSelect = document.getElementById('check-plan-pagination-select');
    if (rowLimitSelect) {
      rowLimitSelect.removeEventListener('change', rowLimitSelect._limitChange);
      rowLimitSelect._limitChange = applyRowLimit;
      rowLimitSelect.addEventListener('change', applyRowLimit);
    }
    applyRowLimit();

    tbody.querySelectorAll('.check-plan-detail-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = this.closest('tr');
        if (row && typeof window.openCheckPlanDetail === 'function') {
          window.openCheckPlanDetail(row);
        } else {
          document.getElementById('check-plan-detail-wrap') && document.getElementById('check-plan-detail-wrap').classList.remove('d-none') && (document.getElementById('check-plan-detail-wrap').setAttribute('aria-hidden', 'false'));
        }
      });
    });
  }

  document.addEventListener('check-plan-table-ready', initCheckPlanTable);
})();
