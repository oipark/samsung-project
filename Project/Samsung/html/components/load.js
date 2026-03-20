/**
 * 공통 컴포넌트 로더 (병렬 fetch + 순차 DOM 조립 + 스크립트 지연 실행)
 * - LNB, GNB 공통. 자산현황/점검계획 페이지별로 해당 HTML 병렬 fetch 후 주입
 * - DOM 주입 완료 후에만 페이지 전용 스크립트 로드
 * - 개별 컴포넌트 실패 시 해당만 로그하고 나머지 계속 진행
 */
(function () {
  'use strict';

  var COMPONENTS_BASE = 'components/';

  function getBasePath() {
    var script = document.currentScript;
    if (script && script.src) {
      var path = script.src.replace(/\/[^/]+$/, '/');
      try {
        var url = new URL(path);
        return url.pathname.replace(/\/[^/]+$/, '') + '/';
      } catch (e) {}
    }
    return '';
  }

  /**
   * 단일 fetch, 실패 시 콘솔 로그 후 null 반환 (Promise.all 거부 방지)
   */
  function fetchSafe(url, label) {
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(label + ' HTTP ' + r.status);
        return r.text();
      })
      .catch(function (err) {
        console.error('[load.js] ' + (label || url) + ' 로드 실패:', err);
        return null;
      });
  }

  /**
   * script 태그 동적 생성 후 로드 완료 시 resolve
   */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Script load failed: ' + src)); };
      document.body.appendChild(script);
    });
  }

  async function run() {
    var base = getBasePath() || COMPONENTS_BASE;
    if (!base.endsWith('/')) base += '/';

  var hasTable = !!document.getElementById('asset-table-section-placeholder');
  var hasDetail = !!document.getElementById('asset-detail-placeholder');
  var isCheckPlanPage = !!document.getElementById('portlet-group-check-status-placeholder');
  var isCheckResultPage = !!document.getElementById('cr-portlet-placeholder');

    var lnbP = fetchSafe(base + 'lnb.html', 'lnb.html');
    var gnbP = fetchSafe(base + 'gnb.html', 'gnb.html');

    var promises = [lnbP, gnbP];
    var resultKeys = ['lnb', 'gnb'];

    if (isCheckPlanPage) {
      promises.push(
        fetchSafe(base + 'portlets/check-status-portlet.html', 'check-status-portlet.html'),
        fetchSafe(base + 'check-plan-filter-bar.html', 'check-plan-filter-bar.html'),
        fetchSafe(base + 'check-plan-table-section.html', 'check-plan-table-section.html'),
        fetchSafe(base + 'check-plan-tbody-rows.html', 'check-plan-tbody-rows.html'),
        fetchSafe(base + 'check-plan-detail-slide.html', 'check-plan-detail-slide.html')
      );
      resultKeys = ['lnb', 'gnb', 'portlet', 'filterBar', 'tableSection', 'tableBody', 'detailSlide'];
    } else if (isCheckResultPage) {
      promises.push(
        fetchSafe(base + 'portlets/check-result-portlet.html', 'check-result-portlet.html'),
        fetchSafe(base + 'check-result-filter-bar.html', 'check-result-filter-bar.html'),
        fetchSafe(base + 'check-result-table-section.html', 'check-result-table-section.html'),
        fetchSafe(base + 'check-result-tbody-rows.html', 'check-result-tbody-rows.html')
      );
      resultKeys = ['lnb', 'gnb', 'portlet', 'filterBar', 'tableSection', 'tableBody'];
    } else {
      promises.push(
        hasTable ? fetchSafe(base + 'asset-table-section.html', 'asset-table-section.html') : Promise.resolve(null),
        hasTable ? fetchSafe(base + 'asset-table-tbody-rows.html', 'asset-table-tbody-rows.html') : Promise.resolve(null),
        hasDetail ? fetchSafe(base + 'asset-detail-slide.html', 'asset-detail-slide.html') : Promise.resolve(null)
      );
      resultKeys = ['lnb', 'gnb', 'tableSection', 'tableBody', 'detailSlide'];
    }

    var results;
    try {
      results = await Promise.all(promises);
    } catch (e) {
      console.error('[load.js] 병렬 fetch 중 오류:', e);
      results = promises.map(function () { return null; });
    }

    var lnbHtml = results[0];
    var gnbHtml = results[1];

    /* 1. HTML 컴포넌트 DOM 주입 (순서 유지) */
    try {
      var lnbPlaceholder = document.getElementById('lnb-placeholder');
      var gnbPlaceholder = document.getElementById('gnb-placeholder');
      if (lnbPlaceholder && lnbHtml) lnbPlaceholder.innerHTML = lnbHtml;
      if (gnbPlaceholder && gnbHtml) gnbPlaceholder.innerHTML = gnbHtml;

      /* LNB: 현재 페이지에 따라 active 그룹/링크 적용 */
      (function applyLnbActive() {
        var path = window.location.pathname || '';
        var isDashboard = path.endsWith('/') || path.indexOf('index.html') !== -1;
        var isCheckPlan = path.indexOf('check-plan-management') !== -1;
        var isAssetStatus = path.indexOf('asset-status') !== -1;
        var isCheckResult = path.indexOf('check-result-management') !== -1;

        var nav = document.querySelector('#lnb .lnb-nav');
        if (!nav) return;

        var groups = nav.querySelectorAll('.lnb-group[data-lnb-group]');
        groups.forEach(function (g) {
          g.classList.remove('active');
        });
        var dashboardGroup = nav.querySelector('.lnb-group[data-lnb-group="dashboard"]');
        var inspectionGroup = nav.querySelector('.lnb-group[data-lnb-group="inspection"]');
        if (dashboardGroup) {
          var dashboardLink = dashboardGroup.querySelector('a[href*="index.html"]');
          if (dashboardLink) {
            dashboardLink.classList.remove('active', 'bg-custom-primary', 'text-white');
            dashboardLink.classList.add('text-custom-secondary');
          }
        }
        if (inspectionGroup) {
          var header = inspectionGroup.querySelector('.lnb-group-header');
          var chevron = inspectionGroup.querySelector('.lnb-group-chevron');
          if (header) {
            header.classList.remove('text-custom-primary');
            header.classList.add('text-custom-secondary');
          }
          if (chevron) {
            chevron.classList.remove('text-custom-primary');
            chevron.classList.add('text-custom-muted');
          }
          inspectionGroup.querySelectorAll('a[href*="check-plan-management"], a[href*="asset-status"]').forEach(function (a) {
            a.classList.remove('bg-custom-primary', 'text-white');
            a.classList.add('text-custom-muted');
          });
        }

        if (isDashboard && dashboardGroup) {
          dashboardGroup.classList.add('active');
          var link = dashboardGroup.querySelector('a[href*="index.html"]');
          if (link) {
            link.classList.add('active');
            link.classList.remove('text-custom-secondary');
          }
        } else if ((isCheckPlan || isAssetStatus || isCheckResult) && inspectionGroup) {
          inspectionGroup.classList.add('active');
          var header = inspectionGroup.querySelector('.lnb-group-header');
          var chevron = inspectionGroup.querySelector('.lnb-group-chevron');
          if (header) {
            header.classList.remove('text-custom-secondary');
            header.classList.add('text-custom-primary');
          }
          if (chevron) {
            chevron.classList.remove('text-custom-muted');
            chevron.classList.add('text-custom-primary');
          }
          var activeLink = inspectionGroup.querySelector(
            isCheckPlan ? 'a[href*="check-plan-management"]' :
            isCheckResult ? 'a[href*="check-result-management"]' :
            'a[href*="asset-status"]'
          );
          if (activeLink) {
            activeLink.classList.add('bg-custom-primary', 'text-white');
            activeLink.classList.remove('text-custom-muted');
          }
        }
      })();

      var mainContentWrap = document.querySelector('.main-content-wrap');
      if (mainContentWrap && gnbHtml) {
        var first = mainContentWrap.querySelector('[data-gnb-title]');
        var pageTitle = document.querySelector('meta[name="gnb-title"]');
        if (pageTitle && pageTitle.getAttribute('content') && first) {
          first.textContent = pageTitle.getAttribute('content');
        }
      }

      if (isCheckPlanPage) {
        var portletPh = document.getElementById('portlet-group-check-status-placeholder');
        var filterBarPh = document.getElementById('filter-bar-placeholder');
        var tableSectionPh = document.getElementById('table-section-placeholder');
        var modalPh = document.getElementById('modal-placeholder');
        if (portletPh && results[2]) portletPh.innerHTML = results[2];
        if (filterBarPh && results[3]) filterBarPh.innerHTML = results[3];
        if (tableSectionPh && results[4]) {
          tableSectionPh.innerHTML = results[4];
          if (results[5]) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(results[5], 'text/html');
            var tbody = doc.querySelector('tbody');
            var target = document.getElementById('check-plan-tbody');
            if (tbody && target) target.innerHTML = tbody.innerHTML;
          }
        }
        if (modalPh && results[6]) modalPh.innerHTML = results[6];
      } else if (isCheckResultPage) {
        var crPortletPh = document.getElementById('cr-portlet-placeholder');
        var crFilterBarPh = document.getElementById('cr-filter-bar-placeholder');
        var crTableSectionPh = document.getElementById('cr-table-section-placeholder');
        if (crPortletPh && results[2]) crPortletPh.innerHTML = results[2];
        if (crFilterBarPh && results[3]) crFilterBarPh.innerHTML = results[3];
        if (crTableSectionPh && results[4]) {
          crTableSectionPh.innerHTML = results[4];
          if (results[5]) {
            var target = document.getElementById('cr-table-tbody');
            if (target) {
              /* <tbody>를 단독 파싱하면 브라우저가 테이블 컨텍스트 없이 처리해
                 querySelector('tbody')가 null을 반환하므로 <table>로 래핑 후 파싱 */
              var parser = new DOMParser();
              var doc = parser.parseFromString('<table>' + results[5] + '</table>', 'text/html');
              var tbody = doc.querySelector('tbody');
              if (tbody) target.innerHTML = tbody.innerHTML;
            }
          }
        }
      } else {
        if (hasTable && results[2]) {
          var tablePlaceholder = document.getElementById('asset-table-section-placeholder');
          if (tablePlaceholder) {
            tablePlaceholder.innerHTML = results[2];
            if (results[3]) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(results[3], 'text/html');
              var tbody = doc.querySelector('tbody');
              var target = document.getElementById('asset-table-tbody');
              if (tbody && target) target.innerHTML = tbody.innerHTML;
            }
            document.dispatchEvent(new CustomEvent('asset-table-ready'));
          }
        }
        if (hasDetail && results[4]) {
          var detailPlaceholder = document.getElementById('asset-detail-placeholder');
          if (detailPlaceholder) detailPlaceholder.innerHTML = results[4];
        }
      }
    } catch (e) {
      console.error('[load.js] DOM 주입 중 오류:', e);
    }

    /* 2. GNB 공통: 날짜, 매뉴얼/프로필 드롭다운 (모든 페이지) */
    try { await loadScript(base + 'gnb.js'); } catch (e) { console.error('[load.js] gnb.js 로드 실패:', e); }

    /* 3. 페이지별 스크립트 순차 로드 */
    if (isCheckPlanPage) {
      try { await loadScript(base + 'check-plan-table.js'); } catch (e) { console.error('[load.js] check-plan-table.js 로드 실패:', e); }
      document.dispatchEvent(new CustomEvent('check-plan-table-ready'));
      try { await loadScript(base + 'check-plan-filter.js'); } catch (e) { console.error('[load.js] check-plan-filter.js 로드 실패:', e); }
      try { await loadScript(base + 'check-plan-detail-slide.js'); } catch (e) { console.error('[load.js] check-plan-detail-slide.js 로드 실패:', e); }
    } else if (isCheckResultPage) {
      /* 점검 결과 포틀릿 접기/펼치기 */
      (function initCrPortletToggle() {
        var wrap = document.getElementById('cr-portlet-wrap');
        var toggle = document.getElementById('cr-portlet-toggle');
        var icon = toggle && toggle.querySelector('.cr-portlet-toggle-icon');
        if (!wrap || !toggle) return;
        toggle.addEventListener('click', function () {
          wrap.classList.toggle('is-collapsed');
          var collapsed = wrap.classList.contains('is-collapsed');
          toggle.setAttribute('aria-label', collapsed ? '포틀릿 펼치기' : '포틀릿 접기');
          if (icon) icon.textContent = collapsed ? 'expand_more' : 'expand_less';
        });
      })();
      /* 알림 배너 닫기 */
      (function initCrAlert() {
        var btn = document.querySelector('.cr-alert .asset-alert-close');
        if (btn) btn.addEventListener('click', function () {
          var alert = document.querySelector('.cr-alert');
          if (alert) alert.style.display = 'none';
        });
      })();
      /* 전체 체크박스 */
      (function initCrCheckAll() {
        var all = document.getElementById('cr-check-all');
        if (!all) return;
        all.addEventListener('change', function () {
          document.querySelectorAll('.cr-row-check').forEach(function (cb) { cb.checked = all.checked; });
        });
      })();
      /* Bootstrap 툴팁 초기화 (동적 주입 후 실행) */
      (function initCrTooltips() {
        if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
          new bootstrap.Tooltip(el, { container: 'body' });
        });
      })();
      /* 페이지당 행 수 필터링 (check-plan 동일 방식) */
      (function initCrRowLimit() {
        var tbody = document.getElementById('cr-table-tbody');
        var sel = document.getElementById('cr-pagination-select');
        var infoEl = document.getElementById('cr-pagination-info');
        if (!tbody || !sel) return;
        function applyRowLimit() {
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
        sel.addEventListener('change', applyRowLimit);
        applyRowLimit();
      })();
    } else {
      try {
        if (hasDetail) await loadScript(base + 'asset-detail-slide.js');
      } catch (e) {
        console.error('[load.js] asset-detail-slide.js 로드 실패:', e);
      }
      try {
        await loadScript('script.js');
      } catch (e) {
        console.error('[load.js] script.js 로드 실패:', e);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { run(); });
  } else {
    run();
  }
})();
