/**
 * LNB / GNB / 자산 상세 슬라이드 공통 컴포넌트 로더
 * - components/lnb.html, components/gnb.html 을 placeholder에 주입
 * - #asset-detail-placeholder 가 있으면 components/asset-detail-slide.html 주입 후 asset-detail-slide.js 로드
 * - 마지막에 script.js 로드 (대시보드용)
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

  function loadComponents() {
    var base = getBasePath() || COMPONENTS_BASE;
    if (!base.endsWith('/')) base += '/';

    return Promise.all([
      fetch(base + 'lnb.html').then(function (r) { return r.text(); }),
      fetch(base + 'gnb.html').then(function (r) { return r.text(); })
    ]).then(function (results) {
      var lnbPlaceholder = document.getElementById('lnb-placeholder');
      var gnbPlaceholder = document.getElementById('gnb-placeholder');
      if (lnbPlaceholder) lnbPlaceholder.innerHTML = results[0];
      if (gnbPlaceholder) gnbPlaceholder.innerHTML = results[1];
      return base;
    });
  }

  function loadAssetDetailSlide(base) {
    var placeholder = document.getElementById('asset-detail-placeholder');
    if (!placeholder) return Promise.resolve();
    return fetch(base + 'asset-detail-slide.html').then(function (r) { return r.text(); }).then(function (html) {
      placeholder.innerHTML = html;
      return new Promise(function (resolve) {
        var script = document.createElement('script');
        script.src = base + 'asset-detail-slide.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    });
  }

  function loadMainScript() {
    var script = document.createElement('script');
    script.src = 'script.js';
    script.async = false;
    document.body.appendChild(script);
  }

  function run() {
    var base = getBasePath() || COMPONENTS_BASE;
    if (!base.endsWith('/')) base += '/';

    loadComponents()
      .then(function (basePath) {
        var mainContentWrap = document.querySelector('.main-content-wrap');
        if (mainContentWrap) {
          var first = mainContentWrap.querySelector('[data-gnb-title]');
          var pageTitle = document.querySelector('meta[name="gnb-title"]');
          if (pageTitle && pageTitle.getAttribute('content') && first) {
            first.textContent = pageTitle.getAttribute('content');
          }
        }
        return loadAssetDetailSlide(basePath || base);
      })
      .then(function () {
        loadMainScript();
      })
      .catch(function (err) {
        console.error('Components load failed:', err);
        loadMainScript();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
