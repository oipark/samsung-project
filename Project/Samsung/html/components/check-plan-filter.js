/**
 * 점검계획 관리 페이지: 필터 패널(점검명, 진행 상태, 점검 유형, 사업장/권역), 칩/배지 연동, 점검 유형에 따른 사업장/권역 disabled
 */
(function () {
  'use strict';

  var FILTER_KEYS = ['planName', 'status', 'type', 'site'];
  var CHIP_LABELS = { planName: '점검명', status: '진행 상태', type: '점검 유형', site: '사업장/권역' };

  function getCheckPlanFilterState() {
    var planNameEl = document.getElementById('check-plan-filter-planName');
    var statusEl = document.getElementById('check-plan-filter-status');
    var typeEl = document.getElementById('check-plan-filter-type');
    var siteEl = document.getElementById('check-plan-filter-site');
    return {
      planName: (planNameEl && planNameEl.value.trim()) || '',
      status: (statusEl && statusEl.value) || '',
      type: (typeEl && typeEl.value) || '',
      site: (siteEl && siteEl.value) || ''
    };
  }

  function renderCheckPlanFilterChips(state) {
    var container = document.getElementById('check-plan-filter-tags-container');
    if (!container) return;
    state = state || getCheckPlanFilterState();
    container.innerHTML = '';
    FILTER_KEYS.forEach(function (key) {
      var label = CHIP_LABELS[key];
      var value = (state[key] && state[key].trim && state[key].trim()) || (state[key] || '');
      var display = value || '전체';
      var chip = document.createElement('span');
      chip.className = 'filter-chip';
      chip.setAttribute('data-filter-key', key);
      chip.innerHTML = label + ' : <strong class="text-custom-primary">' + display + '</strong><span class="material-symbols-outlined filter-chip-close" aria-label="제거">close</span>';
      container.appendChild(chip);
    });
    updateFilterBadge();
  }

  function applyCheckPlanFilter() {
    console.log('[check-plan-filter] applyCheckPlanFilter()', getCheckPlanFilterState());
  }

  function updateFilterBadge() {
    var container = document.getElementById('check-plan-filter-tags-container');
    var badge = document.getElementById('check-plan-filter-badge');
    if (badge && container) badge.textContent = container.querySelectorAll('.filter-chip').length;
  }

  /** 점검 유형이 "권역/사업장별"이면 사업장/권역 필드 disabled, 아니면 enabled */
  function syncSiteFieldByType() {
    var typeEl = document.getElementById('check-plan-filter-type');
    var siteEl = document.getElementById('check-plan-filter-site');
    if (!typeEl || !siteEl) return;
    var isRegionSite = typeEl.value === '권역/사업장별';
    siteEl.disabled = isRegionSite;
    if (isRegionSite) siteEl.selectedIndex = 0;
    siteEl.classList.toggle('asset-filter-field-disabled', isRegionSite);
  }

  function syncFilterInputSelectedState() {
    var panel = document.getElementById('check-plan-filter-panel');
    if (!panel) return;
    panel.querySelectorAll('.asset-filter-input').forEach(function (el) {
      if (el.disabled) {
        el.classList.remove('is-selected');
        return;
      }
      var hasValue = el.tagName === 'SELECT' ? el.value !== '' : (el.value || '').trim() !== '';
      if (hasValue) el.classList.add('is-selected'); else el.classList.remove('is-selected');
    });
  }

  function openFilterPanel() {
    var panel = document.getElementById('check-plan-filter-panel');
    var trigger = document.getElementById('check-plan-filter-trigger');
    if (panel) panel.classList.remove('d-none');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeFilterPanel() {
    var panel = document.getElementById('check-plan-filter-panel');
    var trigger = document.getElementById('check-plan-filter-trigger');
    if (panel) panel.classList.add('d-none');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function masterResetFilter() {
    var planNameEl = document.getElementById('check-plan-filter-planName');
    var statusEl = document.getElementById('check-plan-filter-status');
    var typeEl = document.getElementById('check-plan-filter-type');
    var siteEl = document.getElementById('check-plan-filter-site');
    if (planNameEl) planNameEl.value = '';
    if (statusEl) statusEl.selectedIndex = 0;
    if (typeEl) typeEl.selectedIndex = 0;
    if (siteEl) {
      siteEl.selectedIndex = 0;
      siteEl.disabled = false;
      siteEl.classList.remove('asset-filter-field-disabled');
    }
    syncSiteFieldByType();
    syncFilterInputSelectedState();
    renderCheckPlanFilterChips(getCheckPlanFilterState());
    applyCheckPlanFilter();
  }

  /* 상태별 현황 포틀릿 접기/펼치기 토글 */
  var portletToggle = document.getElementById('check-status-portlet-toggle');
  var portletWrap = document.getElementById('check-status-portlet-wrap');
  var toggleIcon = portletToggle && portletToggle.querySelector('.check-status-toggle-icon');
  if (portletToggle && portletWrap) {
    portletToggle.addEventListener('click', function () {
      portletWrap.classList.toggle('is-collapsed');
      var isCollapsed = portletWrap.classList.contains('is-collapsed');
      portletToggle.setAttribute('aria-label', isCollapsed ? '포틀릿 펼치기' : '포틀릿 접기');
      if (toggleIcon) toggleIcon.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  /* 필터 패널 토글 */
  var filterTrigger = document.getElementById('check-plan-filter-trigger');
  var filterPanel = document.getElementById('check-plan-filter-panel');
  var panelReset = document.getElementById('check-plan-filter-panel-reset');
  var panelCancel = document.getElementById('check-plan-filter-panel-cancel');
  var panelApply = document.getElementById('check-plan-filter-panel-apply');

  if (filterTrigger && filterPanel) {
    filterTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (filterPanel.classList.contains('d-none')) openFilterPanel();
      else closeFilterPanel();
    });
  }
  if (panelCancel) panelCancel.addEventListener('click', closeFilterPanel);
  if (panelApply) panelApply.addEventListener('click', function () {
    renderCheckPlanFilterChips(getCheckPlanFilterState());
    applyCheckPlanFilter();
    closeFilterPanel();
  });
  if (panelReset) panelReset.addEventListener('click', masterResetFilter);

  document.addEventListener('click', function (e) {
    if (filterPanel && !filterPanel.classList.contains('d-none') && filterTrigger && !filterPanel.contains(e.target) && !filterTrigger.contains(e.target)) {
      closeFilterPanel();
    }
  });

  /* 점검 유형 변경 시 사업장/권역 disabled */
  var typeSelect = document.getElementById('check-plan-filter-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', function () {
      syncSiteFieldByType();
      syncFilterInputSelectedState();
    });
  }

  /* 패널 내 입력 변경 시 is-selected 동기화 */
  if (filterPanel) {
    filterPanel.querySelectorAll('.asset-filter-input').forEach(function (el) {
      el.addEventListener('change', syncFilterInputSelectedState);
      el.addEventListener('input', syncFilterInputSelectedState);
    });
  }

  /* 칩 클릭(닫기) */
  var tagsContainer = document.getElementById('check-plan-filter-tags-container');
  if (tagsContainer) {
    tagsContainer.addEventListener('click', function (e) {
      if (!e.target.closest('.filter-chip-close')) return;
      e.preventDefault();
      e.stopPropagation();
      var chip = e.target.closest('.filter-chip');
      if (chip) chip.remove();
      updateFilterBadge();
      applyCheckPlanFilter();
    });
  }

  var resetBtn = document.getElementById('check-plan-filter-reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', masterResetFilter);

  syncSiteFieldByType();
  syncFilterInputSelectedState();
  updateFilterBadge();
})();
