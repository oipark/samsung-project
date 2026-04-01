/**
 * check-result-management 페이지 필터 로직
 * - 점검명(패널 텍스트 입력), 점검일(패널 Flatpickr range)
 * - 필터 적용 시 복합 마스터 칩 생성
 */
(function () {
  'use strict';

  /* ── 적용된 상태 (chips에 반영된 값) ─────────────────────── */
  var currentFilters = {
    name:      '전체',
    dateRange: '전체'
  };

  /* ── 패널 입력 스테이징 (적용 전 임시 값) ────────────────── */
  var stagingDate = '전체';

  var fpInstance = null;

  function $(id) { return document.getElementById(id); }

  function fmtDate(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  /* ── 날짜 버튼 텍스트 업데이트 ───────────────────────────── */
  function updateDateBtnText(val) {
    var el = $('cr-date-select-text');
    if (!el) return;
    var isEmpty = !val || val === '전체';
    el.textContent = isEmpty ? '날짜 선택' : val;
    el.classList.toggle('cr-date-placeholder', isEmpty);
  }

  /* ── 마스터 칩 렌더링 ────────────────────────────────────── */
  function renderAllChips() {
    var container = $('cr-filter-tags-container');
    if (!container) return;
    container.innerHTML = '';

    var hasName = currentFilters.name !== '전체';
    var hasDate = currentFilters.dateRange !== '전체';

    /* 점검명 칩 */
    if (hasName) {
      var nameChip = document.createElement('span');
      nameChip.className = 'filter-chip cr-master-chip';
      nameChip.setAttribute('data-filter-key', 'name');
      nameChip.innerHTML =
        '<span class="material-symbols-outlined cr-master-chip-icon">info</span>' +
        '점검명&nbsp;:&nbsp;<strong class="text-custom-primary">' + currentFilters.name + '</strong>' +
        '<button type="button" class="btn-close-chip" aria-label="점검명 필터 초기화">' +
          '<span class="material-symbols-outlined">close</span>' +
        '</button>';
      nameChip.querySelector('.btn-close-chip').addEventListener('click', function () {
        currentFilters.name = '전체';
        var nameEl = $('cr-filter-name');
        if (nameEl) nameEl.value = '';
        renderAllChips();
      });
      container.appendChild(nameChip);
    }

    /* 점검일 칩 */
    if (hasDate) {
      var dateChip = document.createElement('span');
      dateChip.className = 'filter-chip cr-master-chip';
      dateChip.setAttribute('data-filter-key', 'date');
      dateChip.innerHTML =
        '<span class="material-symbols-outlined cr-master-chip-icon">calendar_month</span>' +
        '점검일&nbsp;:&nbsp;<strong class="text-custom-primary">' + currentFilters.dateRange + '</strong>' +
        '<button type="button" class="btn-close-chip" aria-label="점검일 필터 초기화">' +
          '<span class="material-symbols-outlined">close</span>' +
        '</button>';
      dateChip.querySelector('.btn-close-chip').addEventListener('click', function () {
        currentFilters.dateRange = '전체';
        stagingDate = '전체';
        if (fpInstance) fpInstance.clear();
        updateDateBtnText('전체');
        renderAllChips();
      });
      container.appendChild(dateChip);
    }

    updateBadge();
  }

  function updateBadge() {
    var badge     = $('cr-filter-badge');
    var container = $('cr-filter-tags-container');
    if (badge && container) badge.textContent = container.querySelectorAll('.filter-chip').length;
  }

  /* ── 패널 인풋을 currentFilters 기준으로 복원 ────────────── */
  function syncPanelToApplied() {
    var nameEl = $('cr-filter-name');
    if (nameEl) nameEl.value = currentFilters.name !== '전체' ? currentFilters.name : '';
    stagingDate = currentFilters.dateRange;
    updateDateBtnText(currentFilters.dateRange);
    if (fpInstance) {
      fpInstance.clear();
      if (currentFilters.dateRange !== '전체') {
        var parts = currentFilters.dateRange.split(' ~ ');
        if (parts.length === 2) fpInstance.setDate([parts[0], parts[1]]);
      }
    }
  }

  /* ── 전체 초기화 ─────────────────────────────────────────── */
  function resetAllFilters() {
    currentFilters.name      = '전체';
    currentFilters.dateRange = '전체';
    stagingDate               = '전체';
    var nameEl = $('cr-filter-name');
    if (nameEl) nameEl.value = '';
    if (fpInstance) fpInstance.clear();
    updateDateBtnText('전체');
    renderAllChips();
  }

  /* ── 패널 열기 / 닫기 ───────────────────────────────────── */
  function openPanel() {
    var panel   = $('cr-filter-panel');
    var trigger = $('cr-filter-trigger');
    if (panel)   panel.classList.remove('d-none');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    syncPanelToApplied();
  }

  function closePanel() {
    var panel   = $('cr-filter-panel');
    var trigger = $('cr-filter-trigger');
    if (panel)   panel.classList.add('d-none');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    /* 열린 캘린더도 닫기 */
    if (fpInstance) fpInstance.close();
  }

  /* ── 초기화 ─────────────────────────────────────────────── */
  function init() {
    var trigger  = $('cr-filter-trigger');
    var panel    = $('cr-filter-panel');
    var dateBtn  = $('cr-panel-date-btn');
    var nameEl   = $('cr-filter-name');

    /* Flatpickr — 패널 내 날짜 선택 버튼 */
    if (dateBtn && typeof flatpickr !== 'undefined') {
      var locale = (typeof flatpickr.l10ns !== 'undefined' && flatpickr.l10ns.ko) ? 'ko' : 'default';
      fpInstance = flatpickr(dateBtn, {
        mode:       'range',
        showMonths: 2,
        dateFormat: 'Y-m-d',
        locale:     locale,
        appendTo:   document.body,
        disableMobile: true,
        onReady: function (_sd, _ds, fp) {
          if (fp.calendarContainer.querySelector('.flatpickr-custom-footer')) return;
          var footer = document.createElement('div');
          footer.className = 'flatpickr-custom-footer';
          footer.innerHTML =
            '<button type="button" class="flatpickr-footer-cancel">닫기</button>' +
            '<button type="button" class="flatpickr-footer-save">저장</button>';
          footer.querySelector('.flatpickr-footer-cancel').addEventListener('click', function () {
            fp.close();
          });
          footer.querySelector('.flatpickr-footer-save').addEventListener('click', function () {
            fp.close();
          });
          fp.calendarContainer.appendChild(footer);
        },
        onChange: function (selectedDates) {
          if (selectedDates.length === 2) {
            stagingDate = fmtDate(selectedDates[0]) + ' ~ ' + fmtDate(selectedDates[1]);
            updateDateBtnText(stagingDate);
          }
        },
        onValueUpdate: function (selectedDates) {
          if (selectedDates.length === 0) {
            stagingDate = '전체';
            updateDateBtnText('전체');
          }
        }
      });
    }

    /* 필터 패널 트리거 */
    if (trigger && panel) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.contains('d-none') ? openPanel() : closePanel();
      });
    }

    /* 필터 적용 */
    var panelApply = $('cr-filter-panel-apply');
    if (panelApply) {
      panelApply.addEventListener('click', function () {
        currentFilters.name      = (nameEl && nameEl.value.trim()) || '전체';
        currentFilters.dateRange = stagingDate;
        renderAllChips();
        closePanel();
      });
    }

    /* 취소 — 인풋 복원 후 닫기 */
    var panelCancel = $('cr-filter-panel-cancel');
    if (panelCancel) {
      panelCancel.addEventListener('click', function () {
        syncPanelToApplied();
        closePanel();
      });
    }

    /* 패널 내 필터 초기화 */
    var panelReset = $('cr-filter-panel-reset');
    if (panelReset) {
      panelReset.addEventListener('click', function () {
        if (nameEl) nameEl.value = '';
        if (fpInstance) fpInstance.clear();
        stagingDate               = '전체';
        currentFilters.name      = '전체';
        currentFilters.dateRange = '전체';
        updateDateBtnText('전체');
        renderAllChips();
      });
    }

    /* 전체 초기화 버튼 (필터 바) */
    var resetBtn = $('cr-filter-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);

    /* 패널 외부 클릭 시 닫기 (Flatpickr 캘린더 예외 처리) */
    document.addEventListener('click', function (e) {
      if (!panel || panel.classList.contains('d-none')) return;
      if (trigger && trigger.contains(e.target)) return;
      if (panel.contains(e.target)) return;
      var openCal = document.querySelector('.flatpickr-calendar.open');
      if (openCal && openCal.contains(e.target)) return;
      closePanel();
    });

    /* 초기 상태 */
    updateDateBtnText('전체');
    renderAllChips();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
