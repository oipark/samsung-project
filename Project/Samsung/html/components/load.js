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
  var isCheckTargetPage = !!document.getElementById('ct-portlet-placeholder');

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
    } else if (isCheckTargetPage) {
      promises.push(
        fetchSafe(base + 'portlets/check-target-portlet.html', 'check-target-portlet.html'),
        fetchSafe(base + 'check-target-filter-bar.html', 'check-target-filter-bar.html'),
        fetchSafe(base + 'check-target-table-section.html', 'check-target-table-section.html'),
        fetchSafe(base + 'check-target-tbody-rows.html', 'check-target-tbody-rows.html'),
        fetchSafe(base + 'check-result-detail-slide.html', 'check-result-detail-slide.html')
      );
      resultKeys = ['lnb', 'gnb', 'portlet', 'filterBar', 'tableSection', 'tableBody', 'detailSlide'];
    } else if (isCheckResultPage) {
      promises.push(
        fetchSafe(base + 'portlets/check-result-portlet.html', 'check-result-portlet.html'),
        fetchSafe(base + 'check-result-filter-bar.html', 'check-result-filter-bar.html'),
        fetchSafe(base + 'check-result-table-section.html', 'check-result-table-section.html'),
        fetchSafe(base + 'check-result-tbody-rows.html', 'check-result-tbody-rows.html'),
        fetchSafe(base + 'check-result-detail-slide.html', 'check-result-detail-slide.html')
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

      /* LNB: 현재 페이지에 따라 active 그룹/링크 적용 */
      (function applyLnbActive() {
        var path = window.location.pathname || '';
        var isDashboard = path.endsWith('/') || path.indexOf('index.html') !== -1;
        var isCheckPlan = path.indexOf('check-plan-management') !== -1;
        var isAssetStatus = path.indexOf('asset-status') !== -1;
        var isCheckResult = path.indexOf('check-result-management') !== -1;
        var isCheckTarget = path.indexOf('check-target-management') !== -1;

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
        } else if ((isCheckPlan || isAssetStatus || isCheckResult || isCheckTarget) && inspectionGroup) {
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
            (isCheckResult || isCheckTarget) ? 'a[href*="check-result-management"]' :
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
        if (!isCheckTargetPage && pageTitle && pageTitle.getAttribute('content') && first) {
          first.textContent = pageTitle.getAttribute('content');
        }
      }

      /* 점검 대상별 관리: GNB 제목 대신 브레드크럼 + 뒤로(시안) */
      if (isCheckTargetPage) {
        var gnbDef = document.getElementById('gnb-title-default');
        var gnbCrumb = document.getElementById('gnb-breadcrumb-nav');
        var gnbInsp = document.getElementById('gnb-ct-inspection-name');
        var gnbBack = document.getElementById('gnb-ct-back-btn');
        if (gnbDef) gnbDef.classList.add('d-none');
        if (gnbCrumb) {
          gnbCrumb.classList.remove('d-none');
          gnbCrumb.classList.add('d-flex', 'align-items-center', 'gap-2', 'min-w-0', 'flex-grow-1');
        }
        if (gnbInsp) {
          var p = new URLSearchParams(window.location.search);
          /* get()은 이미 디코딩된 값. 쿼리 없을 때는 목록에서 네비게이션 시 저장한 제목 사용 */
          var iname = (p.get('inspection') || '').trim();
          if (!iname) {
            try {
              iname = (sessionStorage.getItem('ctInspectionTitle') || '').trim();
            } catch (e) {
              iname = '';
            }
          }
          if (iname) {
            try {
              sessionStorage.setItem('ctInspectionTitle', iname);
            } catch (e2) { /* ignore */ }
          }
          gnbInsp.textContent = iname || '점검';
        }
        if (gnbBack) {
          gnbBack.addEventListener('click', function () {
            if (window.history.length > 1) window.history.back();
            else window.location.href = 'check-result-management.html';
          });
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
      } else if (isCheckTargetPage) {
        var ctPortletPh = document.getElementById('ct-portlet-placeholder');
        var ctFilterBarPh = document.getElementById('ct-filter-bar-placeholder');
        var ctTableSectionPh = document.getElementById('ct-table-section-placeholder');
        var crDetailPh2 = document.getElementById('cr-detail-placeholder');
        if (ctPortletPh && results[2]) ctPortletPh.innerHTML = results[2];
        if (ctFilterBarPh && results[3]) ctFilterBarPh.innerHTML = results[3];
        if (ctTableSectionPh && results[4]) {
          ctTableSectionPh.innerHTML = results[4];
          if (results[5]) {
            var parser = new DOMParser();
            var doc = parser.parseFromString('<table>' + results[5] + '</table>', 'text/html');
            var tbody = doc.querySelector('tbody');
            var target2 = document.getElementById('ct-table-tbody');
            if (tbody && target2) target2.innerHTML = tbody.innerHTML;
          }
        }
        if (crDetailPh2 && results[6]) crDetailPh2.innerHTML = results[6];
      } else if (isCheckResultPage) {
        var crPortletPh = document.getElementById('cr-portlet-placeholder');
        var crFilterBarPh = document.getElementById('cr-filter-bar-placeholder');
        var crTableSectionPh = document.getElementById('cr-table-section-placeholder');
        var crDetailPh = document.getElementById('cr-detail-placeholder');
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
        if (crDetailPh && results[6]) crDetailPh.innerHTML = results[6];
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
    } else if (isCheckTargetPage) {
      /* 점검 대상별 관리: 포틀릿 접기/펼치기 */
      (function initCtPortletToggle() {
        var wrap = document.getElementById('ct-portlet-wrap');
        var toggle = document.getElementById('ct-portlet-toggle');
        var icon = toggle && toggle.querySelector('.cr-portlet-toggle-icon');
        if (!wrap || !toggle) return;
        toggle.addEventListener('click', function () {
          wrap.classList.toggle('is-collapsed');
          var collapsed = wrap.classList.contains('is-collapsed');
          toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
          toggle.setAttribute('aria-label', collapsed ? '요약 포틀릿 펼치기' : '요약 포틀릿 접기');
          if (icon) icon.textContent = collapsed ? 'expand_more' : 'expand_less';
        });
      })();
      /* 전체 체크박스 */
      (function initCtCheckAll() {
        var all = document.getElementById('ct-check-all');
        if (!all) return;
        all.addEventListener('change', function () {
          document.querySelectorAll('.ct-row-check').forEach(function (cb) { cb.checked = all.checked; });
        });
      })();
      /* §10 필터 바 + 칩 — Figma 475:5624 패널(라디오 세그먼트·2열) */
      (function initCtFilter() {
        var trigger = document.getElementById('ct-filter-trigger');
        var panel = document.getElementById('ct-filter-panel');
        var resetBar = document.getElementById('ct-filter-reset-btn');
        var cancelBtn = document.getElementById('ct-fp-cancel');
        var applyBtn = document.getElementById('ct-fp-apply');
        var fpReset = document.getElementById('ct-fp-reset');
        var container = document.getElementById('ct-filter-tags-container');
        var badge = document.getElementById('ct-filter-badge');
        if (!trigger || !panel || !container) return;

        function esc(s) {
          if (!s) return '';
          return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        }

        function updateCtBadge() {
          if (badge) badge.textContent = String(container.querySelectorAll('.filter-chip').length);
        }

        function chipHtml(key, icon, label, value) {
          return (
            '<span class="filter-chip cr-master-chip" data-ct-chip="' + esc(key) + '">' +
            '<span class="material-symbols-outlined cr-master-chip-icon">' + icon + '</span>' +
            label + '&nbsp;:&nbsp;<strong class="text-custom-primary">' + esc(value) + '</strong>' +
            '<button type="button" class="btn-close-chip" data-ct-clear="' + esc(key) + '" aria-label="' + esc(label) + ' 필터 제거">' +
            '<span class="material-symbols-outlined">close</span></button></span>'
          );
        }

        function radioCheckedValue(name) {
          var el = document.querySelector('#ct-filter-panel input[name="' + name + '"]:checked');
          return el ? el.value : '';
        }

        function setRadioValue(name, value) {
          document.querySelectorAll('#ct-filter-panel input[name="' + name + '"]').forEach(function (r) {
            r.checked = r.value === value;
          });
        }

        var osSel = document.getElementById('ct-fp-os');
        function syncCtOsSelectBorder() {
          if (!osSel) return;
          if (osSel.value) osSel.classList.add('ct-fp-select--primary-border');
          else osSel.classList.remove('ct-fp-select--primary-border');
        }

        function resetCtPanelForm() {
          setRadioValue('ct-fp-region', '');
          setRadioValue('ct-fp-result', '');
          if (osSel) osSel.value = 'Window';
          ['ct-fp-server', 'ct-fp-ip', 'ct-fp-osver'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.value = '';
          });
          syncCtOsSelectBorder();
        }

        function renderCtChipsFromPanel() {
          var region = radioCheckedValue('ct-fp-region');
          var res = radioCheckedValue('ct-fp-result');
          var osEl = document.getElementById('ct-fp-os');
          var os = osEl ? osEl.value : '';
          var serverEl = document.getElementById('ct-fp-server');
          var ipEl = document.getElementById('ct-fp-ip');
          var osverEl = document.getElementById('ct-fp-osver');
          var server = serverEl ? serverEl.value.trim() : '';
          var ip = ipEl ? ipEl.value.trim() : '';
          var osver = osverEl ? osverEl.value.trim() : '';

          var regionLabel = !region ? '전체' : region;
          var osLabel = !os ? '전체' : os;
          var html = '';
          html += chipHtml('region', 'public', '국내/해외', regionLabel);
          html += chipHtml('os', 'computer', 'OS', osLabel);
          if (res) {
            var resMap = { pass: 'Pass', fail: 'Fail' };
            html += chipHtml('result', 'fact_check', '점검 결과', resMap[res] || res);
          }
          if (server) html += chipHtml('server', 'dns', '서버명', server);
          if (ip) html += chipHtml('ip', 'lan', 'IP', ip);
          if (osver) html += chipHtml('osver', 'memory', 'OS 버전', osver);
          container.innerHTML = html;
          container.querySelectorAll('.btn-close-chip').forEach(function (btn) {
            btn.addEventListener('click', onChipClose);
          });
          updateCtBadge();
        }

        function onChipClose(e) {
          var btn = e.currentTarget;
          var key = btn.getAttribute('data-ct-clear');
          if (key === 'region') setRadioValue('ct-fp-region', '');
          else if (key === 'os') {
            var el2 = document.getElementById('ct-fp-os');
            if (el2) {
              el2.value = '';
              el2.classList.remove('ct-fp-select--primary-border');
            }
          } else if (key === 'result') setRadioValue('ct-fp-result', '');
          else if (key === 'server') {
            var s = document.getElementById('ct-fp-server');
            if (s) s.value = '';
          } else if (key === 'ip') {
            var ip = document.getElementById('ct-fp-ip');
            if (ip) ip.value = '';
          } else if (key === 'osver') {
            var ov = document.getElementById('ct-fp-osver');
            if (ov) ov.value = '';
          }
          btn.closest('.filter-chip')?.remove();
          updateCtBadge();
        }

        container.querySelectorAll('.btn-close-chip').forEach(function (btn) {
          btn.addEventListener('click', onChipClose);
        });
        updateCtBadge();

        trigger.addEventListener('click', function () {
          panel.classList.toggle('d-none');
          trigger.setAttribute('aria-expanded', panel.classList.contains('d-none') ? 'false' : 'true');
        });
        if (cancelBtn) cancelBtn.addEventListener('click', function () {
          panel.classList.add('d-none');
          trigger.setAttribute('aria-expanded', 'false');
        });
        if (fpReset) fpReset.addEventListener('click', function () {
          resetCtPanelForm();
        });
        if (applyBtn) applyBtn.addEventListener('click', function () {
          renderCtChipsFromPanel();
          panel.classList.add('d-none');
          trigger.setAttribute('aria-expanded', 'false');
        });
        if (resetBar) resetBar.addEventListener('click', function () {
          resetCtPanelForm();
          renderCtChipsFromPanel();
        });

        if (osSel) osSel.addEventListener('change', syncCtOsSelectBorder);
        syncCtOsSelectBorder();
      })();
      /* §8.3 페이지당 행 수 */
      (function initCtRowLimit() {
        var tbody = document.getElementById('ct-table-tbody');
        var sel = document.getElementById('ct-pagination-select');
        var infoEl = document.getElementById('ct-pagination-info');
        var countStrong = document.getElementById('ct-table-total-count');
        if (!tbody || !sel) return;
        function applyRowLimit() {
          var rows = tbody.querySelectorAll('tr');
          var rowCount = rows.length;
          var declared = tbody.getAttribute('data-ct-total');
          var totalAll = declared && !isNaN(parseInt(declared, 10)) ? parseInt(declared, 10) : rowCount;
          var limit = Math.max(1, parseInt(sel.value, 10) || 10);
          rows.forEach(function (tr, i) {
            if (i < limit) tr.classList.remove('d-none');
            else tr.classList.add('d-none');
          });
          var visibleCap = Math.min(limit, rowCount);
          if (countStrong) countStrong.textContent = String(totalAll);
          if (infoEl) {
            infoEl.textContent = '전체 ' + totalAll + '개 중 1-' + visibleCap + ' 표시';
          }
        }
        sel.addEventListener('change', applyRowLimit);
        applyRowLimit();
      })();
      /* 점검 결과 상세 슬라이드 JS (check-target 페이지에서도 동일 팝업 재사용) */
      try {
        await loadScript(base + 'check-result-detail-slide.js');
      } catch (e) { console.error('[load.js] check-result-detail-slide.js 로드 실패:', e); }
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
          toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
          toggle.setAttribute('aria-label', collapsed ? '요약 포틀릿 펼치기' : '요약 포틀릿 접기');
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

      /* check-result-filter.js 로드 */
      try {
        await loadScript(base + 'check-result-filter.js');
      } catch (e) {
        console.error('[load.js] check-result-filter.js 로드 실패:', e);
      }
      try {
        await loadScript(base + 'check-result-detail-slide.js');
      } catch (e) {
        console.error('[load.js] check-result-detail-slide.js 로드 실패:', e);
      }
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
