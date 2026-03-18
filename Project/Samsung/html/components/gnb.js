/**
 * GNB 공통: 날짜 표시, 매뉴얼·프로필 드롭다운 (모든 페이지에서 로드)
 */
(function () {
  'use strict';

  function formatHeaderDate(date) {
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    var weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return y + '.' + m + '.' + d + ' ' + weekdays[date.getDay()];
  }

  var gnbDate = document.getElementById('gnb-date');
  if (gnbDate) gnbDate.textContent = formatHeaderDate(new Date());

  var btnManual = document.getElementById('btn-manual');
  var manualPopover = document.getElementById('manual-popover');
  var manualClose = document.getElementById('manual-popover-close');
  if (btnManual && manualPopover) {
    function positionManualPopover() {
      var wrap = document.querySelector('.main-content-wrap');
      if (!wrap) return;
      var wrapRect = wrap.getBoundingClientRect();
      var btnRect = btnManual.getBoundingClientRect();
      manualPopover.style.top = (btnRect.bottom - wrapRect.top + 8) + 'px';
      manualPopover.style.right = (wrapRect.right - btnRect.right) + 'px';
    }
    btnManual.addEventListener('click', function () {
      var isHidden = manualPopover.classList.toggle('d-none');
      if (isHidden === false) positionManualPopover();
      var profilePopover = document.getElementById('profile-popover');
      if (profilePopover) profilePopover.classList.add('d-none');
    });
  }
  if (manualClose && manualPopover) {
    manualClose.addEventListener('click', function () { manualPopover.classList.add('d-none'); });
  }
  document.addEventListener('mousedown', function (e) {
    if (!manualPopover || manualPopover.classList.contains('d-none')) return;
    if (btnManual && btnManual.contains(e.target)) return;
    if (manualPopover.contains(e.target)) return;
    manualPopover.classList.add('d-none');
  });

  var btnProfile = document.getElementById('btn-profile');
  var profilePopover = document.getElementById('profile-popover');
  var profileClose = document.getElementById('profile-popover-close');
  if (btnProfile && profilePopover) {
    btnProfile.addEventListener('click', function () {
      profilePopover.classList.toggle('d-none');
      if (manualPopover) manualPopover.classList.add('d-none');
    });
  }
  if (profileClose && profilePopover) {
    profileClose.addEventListener('click', function () { profilePopover.classList.add('d-none'); });
  }
  document.addEventListener('mousedown', function (e) {
    if (!profilePopover || profilePopover.classList.contains('d-none')) return;
    if (btnProfile && btnProfile.contains(e.target)) return;
    if (profilePopover.contains(e.target)) return;
    profilePopover.classList.add('d-none');
  });
})();
