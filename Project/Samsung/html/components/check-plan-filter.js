/**
 * 점검계획 관리 페이지: 상태별 포틀릿 클릭 필터, 필터 바 태그/초기화 연동
 */
(function () {
  'use strict';

  function applyCheckPlanFilter() {
    console.log('[check-plan-filter] applyCheckPlanFilter()');
  }

  function updateFilterBadge() {
    var container = document.getElementById('check-plan-filter-tags-container');
    var badge = document.getElementById('check-plan-filter-badge');
    if (badge && container) badge.textContent = container.querySelectorAll('.filter-chip').length;
  }

  function masterResetFilter() {
    var container = document.getElementById('check-plan-filter-tags-container');
    if (!container) return;
    container.innerHTML = '<span class="filter-chip">사업장 : <strong class="text-custom-primary">전체</strong><span class="material-symbols-outlined filter-chip-close" aria-label="제거">close</span></span>' +
      '<span class="filter-chip">담당부서 : <strong class="text-custom-primary">전체</strong><span class="material-symbols-outlined filter-chip-close" aria-label="제거">close</span></span>' +
      '<span class="filter-chip">OS별 : <strong class="text-custom-primary">전체</strong><span class="material-symbols-outlined filter-chip-close" aria-label="제거">close</span></span>';
    applyCheckPlanFilter();
    updateFilterBadge();
  }

  /* 상태별 현황 포틀릿 접기/펼치기 토글 */
  var portletToggle = document.getElementById('check-status-portlet-toggle');
  var portletWrap = document.getElementById('check-status-portlet-wrap');
  if (portletToggle && portletWrap) {
    portletToggle.addEventListener('click', function () {
      portletWrap.classList.toggle('collapsed');
      portletToggle.setAttribute('aria-label', portletWrap.classList.contains('collapsed') ? '포틀릿 펼치기' : '포틀릿 접기');
    });
  }

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

  updateFilterBadge();
})();
