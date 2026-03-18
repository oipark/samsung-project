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
          document.dispatchEvent(new CustomEvent('check-plan-table-ready'));
        }
        if (modalPh && results[6]) modalPh.innerHTML = results[6];

        var checkPlanLink = document.querySelector('a[href*="check-plan-management.html"]');
        var assetStatusLink = document.querySelector('a[href*="asset-status.html"]');
        if (checkPlanLink) {
          checkPlanLink.classList.add('bg-custom-primary', 'text-white');
          checkPlanLink.classList.remove('text-custom-muted');
        }
        if (assetStatusLink) assetStatusLink.classList.remove('bg-custom-primary', 'text-white');
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
      try { await loadScript(base + 'check-plan-filter.js'); } catch (e) { console.error('[load.js] check-plan-filter.js 로드 실패:', e); }
      try { await loadScript(base + 'check-plan-detail-slide.js'); } catch (e) { console.error('[load.js] check-plan-detail-slide.js 로드 실패:', e); }
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
