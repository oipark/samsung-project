/**
 * 대시보드 단일 HTML - GNB/LNB, 팝오버, 필터, 차트
 */
(function () {
  'use strict';

  const CHART_COLORS = ['#13289f', '#5856d6', '#7dbbff', '#1ea5e4', '#e3ebf9', '#71dd8c', '#c9d0d7', '#ffb55b'];
  const DOMESTIC_DATA = { labels: ['수원 사업장', '우면 사업장', '구미 사업장', '광주 사업장', '서초 사업장', '인재개발원', '한국 총괄', '기타'], values: [10, 1, 1, 0, 0, 0, 0, 0], total: 19 };
  const OVERSEAS_DATA = { labels: ['중남미', 'APAC', '유럽', '기타'], values: [5, 3, 2, 2], total: 12 };
  const OS_DATA = { labels: ['Windows', 'Linux', 'Oracle Solaris', 'IBM AIX'], values: [5009, 4, 1, 0.5], colors: ['#13289f', '#1ea5e4', '#e80b38', '#666666'], total: 5014 };

  var chartRegistered = null;
  var chartOS = null;

  function createCenterTextPlugin() {
    return {
      id: 'doughnutCenterText',
      afterDraw: function (chart) {
        if (chart.config.type !== 'doughnut') return;
        var ctx = chart.ctx;
        var chartArea = chart.chartArea;
        if (!chartArea) return;
        var opts = chart.options.plugins && chart.options.plugins.doughnutCenter;
        if (!opts) return;
        var centerX = (chartArea.left + chartArea.right) / 2;
        var centerY = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim() || '#111';
        ctx.font = '14px "Pretendard Variable", Pretendard, sans-serif';
        if (opts.centerLabel) ctx.fillText(opts.centerLabel, centerX, centerY - 12);
        ctx.font = 'bold 24px "Pretendard Variable", Pretendard, sans-serif';
        if (opts.centerValue != null) ctx.fillText(opts.centerValue + ' 대', centerX, centerY + 10);
        ctx.restore();
      }
    };
  }

  function initCharts() {
    if (typeof Chart === 'undefined') return;

    Chart.register(createCenterTextPlugin());

    var registeredCtx = document.getElementById('chart-registered');
    if (registeredCtx) {
      chartRegistered = new Chart(registeredCtx, {
        type: 'doughnut',
        data: {
          labels: DOMESTIC_DATA.labels,
          datasets: [{
            data: DOMESTIC_DATA.values.map(function (v) { return v === 0 ? 0.5 : v; }),
            backgroundColor: CHART_COLORS.slice(0, DOMESTIC_DATA.labels.length),
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 2
          }]
        },
        options: {
          cutout: '70%',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            doughnutCenter: { centerLabel: '전체', centerValue: DOMESTIC_DATA.total }
          }
        }
      });
    }

    var osCtx = document.getElementById('chart-os');
    if (osCtx) {
      chartOS = new Chart(osCtx, {
        type: 'doughnut',
        data: {
          labels: OS_DATA.labels,
          datasets: [{
            data: OS_DATA.values,
            backgroundColor: OS_DATA.colors,
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 2
          }]
        },
        options: {
          cutout: '70%',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            doughnutCenter: { centerLabel: '전체', centerValue: OS_DATA.total }
          }
        }
      });
    }
  }

  function updateRegisteredChart(tab) {
    if (!chartRegistered) return;
    var data = tab === '국내' ? DOMESTIC_DATA : OVERSEAS_DATA;
    chartRegistered.data.labels = data.labels;
    chartRegistered.data.datasets[0].data = data.values.map(function (v) { return v === 0 ? 0.5 : v; });
    chartRegistered.data.datasets[0].backgroundColor = CHART_COLORS.slice(0, data.labels.length);
    chartRegistered.options.plugins.doughnutCenter = { centerLabel: '전체', centerValue: data.total };
    chartRegistered.update();

    var domLeg = document.getElementById('registered-legend-domestic');
    var overLeg = document.getElementById('registered-legend-overseas');
    if (domLeg && overLeg) {
      if (tab === '국내') {
        domLeg.classList.remove('d-none');
        overLeg.classList.add('d-none');
      } else {
        domLeg.classList.add('d-none');
        overLeg.classList.remove('d-none');
      }
    }
  }

  // LNB toggle
  var lnb = document.getElementById('lnb');
  var lnbToggle = document.getElementById('lnb-toggle');
  var app = document.getElementById('app');
  var lnbSubmenu = document.getElementById('lnb-submenu');
  var submenuHideTimer = null;

  if (lnbToggle && lnb && app) {
    lnbToggle.addEventListener('click', function () {
      lnb.classList.toggle('collapsed');
      app.classList.toggle('lnb-collapsed');
      if (lnbSubmenu) { lnbSubmenu.classList.add('d-none'); lnbSubmenu.setAttribute('aria-hidden', 'true'); }
    });
  }

  // 접힌 LNB: 그룹 호버 시 서브메뉴 표시 (Figma 370-2479)
  if (lnb && lnbSubmenu) {
    function showSubmenu(group) {
      var links = group.querySelectorAll(':scope > a');
      if (links.length < 2) return; /* 서브메뉴는 링크가 2개 이상인 그룹만 (대시보드 제외) */
      lnb.querySelectorAll('.lnb-group.submenu-visible').forEach(function (g) { g.classList.remove('submenu-visible'); });
      group.classList.add('submenu-visible');
      lnbSubmenu.innerHTML = '';
      links.forEach(function (a, i) {
        var sub = document.createElement('a');
        sub.href = a.getAttribute('href') || '#';
        sub.textContent = a.textContent.trim();
        sub.className = (a.classList.contains('bg-custom-primary') && a.classList.contains('text-white')) ? 'active' : '';
        lnbSubmenu.appendChild(sub);
      });
      var rect = group.getBoundingClientRect();
      lnbSubmenu.style.top = rect.top + 'px';
      lnbSubmenu.style.left = '80px';
      lnbSubmenu.classList.remove('d-none');
      lnbSubmenu.setAttribute('aria-hidden', 'false');
    }
    function hideSubmenu() {
      submenuHideTimer = setTimeout(function () {
        lnbSubmenu.classList.add('d-none');
        lnbSubmenu.setAttribute('aria-hidden', 'true');
        lnb.querySelectorAll('.lnb-group.submenu-visible').forEach(function (g) { g.classList.remove('submenu-visible'); });
      }, 150);
    }
    var groupsWithChildren = lnb.querySelectorAll('.lnb-group');
    groupsWithChildren.forEach(function (group) {
      if (group.querySelectorAll(':scope > a').length < 2) return; /* 대시보드처럼 링크 1개인 그룹은 서브메뉴 없음 */
      group.addEventListener('mouseenter', function () {
        if (!lnb.classList.contains('collapsed')) return;
        clearTimeout(submenuHideTimer);
        showSubmenu(group);
      });
      group.addEventListener('mouseleave', function (e) {
        if (!lnb.classList.contains('collapsed')) return;
        if (e.relatedTarget && lnbSubmenu.contains(e.relatedTarget)) return;
        hideSubmenu();
      });
    });
    lnbSubmenu.addEventListener('mouseenter', function () { clearTimeout(submenuHideTimer); });
    lnbSubmenu.addEventListener('mouseleave', function () { hideSubmenu(); });
  }

  // My Applications filter tabs — data-filter와 data-status로 필터링, d-none 클래스로 표시/숨김
  var filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  var myAppItems = document.querySelectorAll('.my-app-item[data-status]');
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      myAppItems.forEach(function (item) {
        var status = item.getAttribute('data-status');
        if (filter === '전체' || status === filter) {
          item.classList.remove('d-none');
        } else {
          item.classList.add('d-none');
        }
      });
    });
  });

  // Registered tab (국내/해외)
  var registeredTabs = document.querySelectorAll('.registered-tab');
  registeredTabs.forEach(function (btn) {
    if (!btn.getAttribute('data-tab')) return;
    btn.addEventListener('click', function () {
      var tab = this.getAttribute('data-tab');
      registeredTabs.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      updateRegisteredChart(tab);
    });
  });

  function initTooltips() {
    if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl, { container: 'body' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCharts();
      initTooltips();
    });
  } else {
    initCharts();
    initTooltips();
  }
})();
