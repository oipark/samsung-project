/* check-result-detail-slide.js
   1단 점검 결과 상세 슬라이드 + 2단 예외 처리 신청 슬라이드 로직
   ─────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── CCE 더미 데이터 ───────────────────────────────────────────── */
  const CCE_DATA = [
    {
      id: 'CCE-37166-6', name: 'Administrator 계정 이름 변경',
      action: '-', result: 'fail', risk: 'high',
      recommend: 'Administrator 외의 다른 계정 이름으로 변경하여 사용',
      standard: '양호: Administrator 외의 다른 계정 이름으로 변경하여 사용하는 경우\n취약: Administrator 계정 이름을 변경하지 않고 사용하는 경우',
      detail: '명령 프롬프트에서 확인 시작 → 실행 → cmd → net user 명령어 실행 후 Administrator 계정의 존재 유무 확인',
      remedy: 'wmic UserAccount where Name="administrator" call Rename Name="변경할 계정명" 명령어 입력'
    },
    {
      id: 'CCE-37166-7', name: 'Guest 계정 비활성화',
      action: 'NO', result: 'fail', risk: 'medium',
      recommend: 'Guest 계정을 비활성화하여 무단 접근 방지',
      standard: '양호: Guest 계정이 비활성화된 경우\n취약: Guest 계정이 활성화된 경우',
      detail: '제어판 → 사용자 계정 → Guest 계정 상태 확인',
      remedy: '제어판 → 사용자 계정 → Guest 계정 비활성화'
    },
    {
      id: 'CCE-37166-8', name: '로컬 Administrators 그룹 구성원',
      action: 'NO', result: 'fail', risk: 'high',
      recommend: '로컬 Administrators 그룹 구성원 최소화',
      standard: '양호: 로컬 Administrators 그룹에 불필요한 계정이 없는 경우\n취약: 불필요한 계정이 포함된 경우',
      detail: 'lusrmgr.msc → Administrators 그룹 구성원 확인',
      remedy: '불필요한 계정 Administrators 그룹에서 제거'
    },
    {
      id: 'CCE-37166-9', name: '패스워드 최소 길이',
      action: 'YES', result: 'pass', risk: 'medium',
      recommend: '패스워드 최소 길이 8자 이상 설정',
      standard: '양호: 패스워드 최소 길이가 8자 이상인 경우\n취약: 8자 미만인 경우',
      detail: '로컬 보안 정책 → 계정 정책 → 패스워드 정책 → 최소 암호 길이 확인',
      remedy: '로컬 보안 정책에서 최소 암호 길이를 8자 이상으로 설정'
    },
    {
      id: 'CCE-37170-2', name: '패스워드 복잡성 설정',
      action: '-', result: 'fail', risk: 'high',
      recommend: '패스워드 복잡성 요구 사항 활성화',
      standard: '양호: 패스워드 복잡성 요구 사항이 활성화된 경우\n취약: 비활성화된 경우',
      detail: '로컬 보안 정책 → 계정 정책 → 패스워드 정책 → 복잡성 요구 사항 확인',
      remedy: '로컬 보안 정책에서 패스워드 복잡성 요구 사항 활성화'
    },
    {
      id: 'CCE-37170-3', name: 'Windows 방화벽 활성화',
      action: '-', result: 'pass', risk: 'low',
      recommend: 'Windows 방화벽 활성화 유지',
      standard: '양호: 방화벽이 활성화된 경우\n취약: 방화벽이 비활성화된 경우',
      detail: '제어판 → Windows Defender 방화벽 → 현재 상태 확인',
      remedy: '제어판 → Windows Defender 방화벽 → 방화벽 활성화'
    },
    {
      id: 'CCE-37170-4', name: '패스워드 만료 기간',
      action: '-', result: 'fail', risk: 'medium',
      recommend: '패스워드 만료 기간 90일 이하로 설정',
      standard: '양호: 패스워드 만료 기간이 90일 이하인 경우\n취약: 90일 초과 또는 만료 없음',
      detail: '로컬 보안 정책 → 계정 정책 → 패스워드 정책 → 최대 암호 사용 기간 확인',
      remedy: '최대 암호 사용 기간을 90일 이하로 설정'
    },
    {
      id: 'CCE-37171-1', name: '패스워드 입력 실패 횟수 제한',
      action: '-', result: 'na', risk: 'medium',
      recommend: '패스워드 입력 실패 횟수 5회 이하로 제한',
      standard: '양호: 패스워드 입력 실패 횟수가 5회 이하인 경우\n취약: 5회 초과 또는 제한 없음',
      detail: '로컬 보안 정책 → 계정 정책 → 계정 잠금 정책 확인',
      remedy: '계정 잠금 임계값을 5회 이하로 설정'
    },
    {
      id: 'CCE-37172-1', name: '불필요한 서비스 비활성화',
      action: '-', result: 'fail', risk: 'medium',
      recommend: '운영에 불필요한 서비스는 중지 및 비활성화',
      standard: '양호: 불필요한 서비스가 모두 비활성화된 경우\n취약: 불필요한 서비스가 활성화된 경우',
      detail: '서비스 관리자(services.msc)에서 실행 중인 서비스 목록 확인',
      remedy: '불필요한 서비스 중지 후 시작 유형을 "사용 안 함"으로 변경'
    },
    {
      id: 'CCE-37172-2', name: '원격 데스크톱 접근 제한',
      action: 'YES', result: 'pass', risk: 'high',
      recommend: '원격 데스크톱(RDP) 접근 IP 및 계정 제한',
      standard: '양호: 허가된 IP에서만 RDP 접근이 허용된 경우\n취약: 모든 IP에서 RDP 접근이 허용된 경우',
      detail: '방화벽 설정 및 그룹 정책에서 RDP 허용 IP 확인',
      remedy: '방화벽 규칙을 통해 허가된 IP 대역만 3389 포트 허용'
    },
    {
      id: 'CCE-37173-1', name: '이벤트 로그 설정',
      action: '-', result: 'fail', risk: 'low',
      recommend: '보안·시스템 이벤트 로그 크기 및 보존 기간 적절 설정',
      standard: '양호: 보안 이벤트 로그 크기가 32MB 이상인 경우\n취약: 32MB 미만인 경우',
      detail: '이벤트 뷰어 → Windows 로그 → 보안 로그 속성 확인',
      remedy: '이벤트 뷰어에서 보안 로그 최대 크기를 32MB 이상으로 설정'
    },
    {
      id: 'CCE-37173-2', name: '감사 정책 설정',
      action: '-', result: 'fail', risk: 'medium',
      recommend: '로그인·객체 접근 등 주요 감사 정책 활성화',
      standard: '양호: 로그온 감사 및 계정 관리 감사가 활성화된 경우\n취약: 감사 정책이 비활성화된 경우',
      detail: '로컬 보안 정책 → 로컬 정책 → 감사 정책 확인',
      remedy: '로컬 보안 정책에서 "로그온 감사" 및 "계정 관리 감사"를 성공/실패 모두 활성화'
    },
    {
      id: 'CCE-37174-1', name: '공유 폴더 접근 제한',
      action: 'NO', result: 'fail', risk: 'high',
      recommend: '불필요한 공유 폴더 제거 및 접근 권한 최소화',
      standard: '양호: 필요한 공유 폴더에만 최소 권한이 부여된 경우\n취약: Everyone 그룹에 공유 폴더 접근 권한이 부여된 경우',
      detail: '컴퓨터 관리 → 공유 폴더 → 공유 목록 확인',
      remedy: '불필요한 공유 폴더 제거 및 Everyone 그룹 권한 삭제'
    },
    {
      id: 'CCE-37174-2', name: '익명 계정 접근 제한',
      action: '-', result: 'fail', risk: 'high',
      recommend: '익명(Anonymous) 계정의 시스템 접근 제한',
      standard: '양호: 익명 계정의 SAM 계정 및 공유 열거가 제한된 경우\n취약: 익명 계정 접근이 허용된 경우',
      detail: '로컬 보안 정책 → 보안 옵션 → 익명 연결 관련 설정 확인',
      remedy: '네트워크 액세스: SAM 계정 및 공유의 익명 열거 허용 안 함'
    },
    {
      id: 'CCE-37175-1', name: '화면 보호기 잠금 설정',
      action: '-', result: 'fail', risk: 'low',
      recommend: '화면 보호기 10분 이내 실행 및 잠금 설정',
      standard: '양호: 화면 보호기가 10분 이내로 설정되고 잠금이 활성화된 경우\n취약: 화면 보호기 잠금이 비활성화된 경우',
      detail: '제어판 → 개인 설정 → 화면 보호기 설정 확인',
      remedy: '화면 보호기 대기 시간 10분 이내 설정 및 "다시 시작할 때 로그온 화면 표시" 체크'
    },
    {
      id: 'CCE-37175-2', name: '자동 로그인 비활성화',
      action: 'YES', result: 'pass', risk: 'medium',
      recommend: '시스템 시작 시 자동 로그인 기능 비활성화',
      standard: '양호: 자동 로그인이 비활성화된 경우\n취약: 자동 로그인이 활성화된 경우',
      detail: '레지스트리 HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon 확인',
      remedy: 'AutoAdminLogon 레지스트리 값을 0으로 설정'
    },
    {
      id: 'CCE-37176-1', name: 'SMB 서명 활성화',
      action: '-', result: 'fail', risk: 'high',
      recommend: 'SMB 패킷 서명(SMB Signing) 활성화로 중간자 공격 방지',
      standard: '양호: SMB 서버 서명이 필수로 설정된 경우\n취약: SMB 서명이 비활성화된 경우',
      detail: '로컬 보안 정책 → 보안 옵션 → "Microsoft 네트워크 서버: 통신에 디지털 서명" 설정 확인',
      remedy: '"Microsoft 네트워크 서버: 통신에 디지털 서명(항상)"을 "사용"으로 설정'
    },
    {
      id: 'CCE-37176-2', name: 'NetBIOS over TCP/IP 비활성화',
      action: '-', result: 'na', risk: 'low',
      recommend: '불필요한 NetBIOS over TCP/IP 비활성화',
      standard: '양호: NetBIOS over TCP/IP가 비활성화된 경우\n취약: 활성화된 경우',
      detail: '네트워크 어댑터 속성 → TCP/IP → 고급 → WINS 탭에서 NetBIOS 설정 확인',
      remedy: 'NetBIOS over TCP/IP를 "비활성화"로 설정'
    }
  ];

  /* ── 상태 ───────────────────────────────────────────────────────── */
  let currentRowData = null;   // 메인 테이블에서 클릭한 행 데이터
  let selectedCceId = null;    // 현재 선택된 CCE row
  let checkedCceIds = new Set(); // 체크박스로 선택된 CCE ID 목록
  let cceFilter = { id: '', result: '' };

  /* ── 뱃지 헬퍼 ─────────────────────────────────────────────────── */
  function resultBadge(val) {
    if (!val || val === 'na') return '<span class="cr-result-badge cr-result-na">N/A</span>';
    if (val === 'pass') return '<span class="cr-result-badge cr-result-pass">양호</span>';
    return '<span class="cr-result-badge cr-result-fail">취약</span>';
  }
  function riskBadge(val) {
    if (!val) return '';
    const map = { high: ['cr-risk-high', 'High'], medium: ['cr-risk-medium', 'Medium'], low: ['cr-risk-low', 'Low'] };
    const [cls, label] = map[val] || ['cr-result-na', val];
    return `<span class="cr-result-badge ${cls}">${label}</span>`;
  }

  /* ── CCE 테이블 렌더링 ─────────────────────────────────────────── */
  function getFilteredData() {
    return CCE_DATA.filter(d => {
      if (cceFilter.id && !d.id.toLowerCase().includes(cceFilter.id.toLowerCase())) return false;
      if (cceFilter.result && d.result !== cceFilter.result) return false;
      return true;
    });
  }

  function renderCceTable() {
    const tbody = document.getElementById('cr-cce-tbody');
    const totalEl = document.getElementById('cr-cce-total-count');
    if (!tbody) return;

    const data = getFilteredData();
    if (totalEl) totalEl.textContent = data.length;

    tbody.innerHTML = data.map(d => {
      const active = d.id === selectedCceId ? ' is-active' : '';
      const checked = checkedCceIds.has(d.id) ? ' checked' : '';

      /* 조치여부: 취약(fail)→ YES/NO(레드+볼드), 양호·N/A → '-'(볼드) */
      const actionLabel = d.result === 'fail'
        ? (d.action === 'YES' ? 'YES' : 'NO')   // `-`도 아직 미조치이므로 NO
        : '-';
      const actionHtml = d.result === 'fail'
        ? `<span class="cr-action-val-fail">${actionLabel}</span>`
        : `<span class="cr-action-val">-</span>`;

      return `
        <tr class="cr-cce-tr${active}" data-cce-id="${d.id}">
          <td class="asset-table-td cr-cce-th-cb" style="text-align:center;">
            <label class="custom-checkbox-wrap" aria-label="${d.id} 선택">
              <input type="checkbox" class="custom-checkbox cr-cce-checkbox"
                     data-cce-id="${d.id}"${checked} />
              <span class="custom-checkbox-box"></span>
            </label>
          </td>
          <td class="asset-table-td cr-cce-td-id">${d.id}</td>
          <td class="asset-table-td cr-cce-td-name">${d.name}</td>
          <td class="asset-table-td">${actionHtml}</td>
          <td class="asset-table-td">${resultBadge(d.result)}</td>
        </tr>`;
    }).join('');

    /* 행 클릭 → 우측 상세 업데이트 + 체크박스 자동 토글 */
    tbody.querySelectorAll('.cr-cce-tr').forEach(tr => {
      tr.addEventListener('click', e => {
        if (e.target.type === 'checkbox') return;
        const id = tr.dataset.cceId;
        /* 체크박스 토글 */
        const cb = tr.querySelector('.cr-cce-checkbox');
        if (cb) {
          cb.checked = !cb.checked;
          if (cb.checked) checkedCceIds.add(id);
          else checkedCceIds.delete(id);
          updateAllCheckbox();
          updateExceptionTargetCount();
        }
        selectCceRow(id);
      });
    });

    /* 체크박스 개별 이벤트 */
    tbody.querySelectorAll('.cr-cce-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.dataset.cceId;
        if (cb.checked) checkedCceIds.add(id);
        else checkedCceIds.delete(id);
        updateAllCheckbox();
        updateExceptionTargetCount();
      });
    });

    updateAllCheckbox();
  }

  function updateAllCheckbox() {
    const allCb = document.getElementById('cr-cce-check-all');
    if (!allCb) return;
    const filtered = getFilteredData();
    const checkedCount = filtered.filter(d => checkedCceIds.has(d.id)).length;
    allCb.indeterminate = checkedCount > 0 && checkedCount < filtered.length;
    allCb.checked = filtered.length > 0 && checkedCount === filtered.length;
  }

  /* ── CCE 행 선택 → 우측 패널 업데이트 ─────────────────────────── */
  function selectCceRow(id) {
    selectedCceId = id;
    const cce = CCE_DATA.find(d => d.id === id);
    if (!cce) return;

    /* 활성 row 스타일 */
    document.querySelectorAll('.cr-cce-tr').forEach(r =>
      r.classList.toggle('is-active', r.dataset.cceId === id)
    );

    /* 빈 상태 숨기고 상세 보이기 */
    document.getElementById('cr-detail-empty')?.classList.add('d-none');
    document.getElementById('cr-cce-detail-section')?.classList.remove('d-none');

    /* 상세 정보 채우기 */
    setText('cce-d-id', cce.id);
    setText('cce-d-name', cce.name);
    setText('cce-d-recommend', cce.recommend);
    setText('cce-d-standard', cce.standard);
    setText('cce-d-detail', cce.detail);
    setText('cce-d-remedy', cce.remedy);

    const resultBadgeEl = document.getElementById('cce-d-result-badge');
    if (resultBadgeEl) resultBadgeEl.innerHTML = resultBadge(cce.result);
    const riskBadgeEl = document.getElementById('cce-d-risk-badge');
    if (riskBadgeEl) riskBadgeEl.innerHTML = riskBadge(cce.risk);

    /* 담당자 조치 폼: 취약일 때만 표시 */
    const actionSection = document.getElementById('cr-action-section');
    if (actionSection) {
      if (cce.result === 'fail') {
        actionSection.classList.remove('d-none');
        resetActionForm();
      } else {
        actionSection.classList.add('d-none');
      }
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '-';
  }

  function resetActionForm() {
    const fields = ['cr-action-manager', 'cr-action-date', 'cr-action-reason', 'cr-action-memo'];
    fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.querySelectorAll('input[name="cr-action-status"]').forEach(r => r.checked = false);
    /* 사유 필드: 초기 상태로 복원 (활성화) */
    setReasonFieldState(false);
  }

  /* 사유 필드 활성/비활성 통합 처리 */
  function setReasonFieldState(disabled) {
    const reasonTextarea = document.getElementById('cr-action-reason');
    const reasonField    = document.getElementById('cr-reason-field');
    if (!reasonTextarea || !reasonField) return;

    if (disabled) {
      reasonTextarea.disabled = true;
      reasonTextarea.removeAttribute('required');
      reasonTextarea.value = '';
      reasonTextarea.placeholder = '사유를 입력하세요.';
      reasonField.classList.add('is-disabled');
    } else {
      reasonTextarea.disabled = false;
      reasonTextarea.placeholder = '사유를 입력하세요.';
      reasonField.classList.remove('is-disabled');
    }
  }

  /* ── CCE Filter ─────────────────────────────────────────────────── */
  function renderFilterChips() {
    const container = document.getElementById('cr-cce-filter-chips');
    const badge = document.getElementById('cr-cce-filter-badge');
    if (!container) return;

    let count = 0;
    let html = '';
    if (cceFilter.id) {
      count++;
      html += `<span class="cr-cce-filter-chip">
        <span class="material-symbols-outlined" style="font-size:13px;">search</span>
        검색: ${cceFilter.id}
        <button class="cr-cce-filter-chip-close" data-clear="id" aria-label="검색 필터 제거">
          <span class="material-symbols-outlined">close</span>
        </button>
      </span>`;
    }
    if (cceFilter.result) {
      count++;
      const label = { pass: '양호', fail: '취약', na: 'N/A' }[cceFilter.result] || cceFilter.result;
      html += `<span class="cr-cce-filter-chip">
        <span class="material-symbols-outlined" style="font-size:13px;">filter_alt</span>
        점검결과: ${label}
        <button class="cr-cce-filter-chip-close" data-clear="result" aria-label="결과 필터 제거">
          <span class="material-symbols-outlined">close</span>
        </button>
      </span>`;
    }
    container.innerHTML = html;
    if (badge) badge.textContent = count;

    container.querySelectorAll('.cr-cce-filter-chip-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.clear;
        cceFilter[key] = '';
        renderFilterChips();
        renderCceTable();
      });
    });
  }

  function applyFilter() {
    const idEl = document.getElementById('cr-fp-id');
    const resultEl = document.getElementById('cr-fp-result');
    cceFilter.id = idEl ? idEl.value.trim() : '';
    cceFilter.result = resultEl ? resultEl.value : '';
    renderFilterChips();
    renderCceTable();
    closeCceFilterPanel();
  }

  function resetFilter() {
    cceFilter = { id: '', result: '' };
    const idEl = document.getElementById('cr-fp-id');
    const resultEl = document.getElementById('cr-fp-result');
    if (idEl) idEl.value = '';
    if (resultEl) resultEl.value = '';
    renderFilterChips();
    renderCceTable();
  }

  function openCceFilterPanel() {
    const panel = document.getElementById('cr-cce-filter-panel');
    const trigger = document.getElementById('cr-cce-filter-trigger');
    if (panel) panel.classList.remove('d-none');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeCceFilterPanel() {
    const panel = document.getElementById('cr-cce-filter-panel');
    const trigger = document.getElementById('cr-cce-filter-trigger');
    if (panel) panel.classList.add('d-none');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  /* ── 1단 슬라이드 열기 / 닫기 ─────────────────────────────────── */
  function fillPanelData(rowData) {
    currentRowData = rowData || {};
    const { srvName = 'seemoon-virtual-machine', ip = '12.123.123.100',
            os = 'Windows', osVer = 'Server 2020', date = '2025-12-26 13:48:12' } = currentRowData;
    setText('cr-srv-name', srvName);
    setText('cr-srv-ip', ip);
    setText('cr-srv-os', os);
    setText('cr-srv-os-ver', osVer);
    setText('cr-srv-date', date);

    /* 예외 신청 패널에 서버 정보 복사 */
    const excSrv = document.getElementById('cr-exc-srv-name');
    const excIp  = document.getElementById('cr-exc-srv-ip');
    if (excSrv) excSrv.value = srvName;
    if (excIp)  excIp.value  = ip;

    /* CCE 테이블 초기화 & 렌더 */
    selectedCceId = null;
    checkedCceIds = new Set();
    cceFilter = { id: '', result: '' };
    renderFilterChips();
    renderCceTable();

    /* 우측 리셋 */
    document.getElementById('cr-detail-empty')?.classList.remove('d-none');
    document.getElementById('cr-cce-detail-section')?.classList.add('d-none');
    document.getElementById('cr-action-section')?.classList.add('d-none');
  }

  function openPanel(rowData) {
    const wrap  = document.getElementById('cr-detail-wrap');
    const panel = document.getElementById('cr-detail-panel');
    if (!wrap) return;

    const wasOpen = wrap.classList.contains('is-open');

    if (wasOpen && panel) {
      /* 다른 서버 클릭: 패널을 순간 닫고 데이터 채운 뒤 재오픈 (transition 없이 즉시) */
      closeExceptionPanel();
      wrap.classList.remove('is-open');
      wrap.setAttribute('aria-hidden', 'true');
      panel.style.transition = 'none';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fillPanelData(rowData);
          panel.style.transition = '';
          wrap.classList.add('is-open');
          wrap.setAttribute('aria-hidden', 'false');
          panel.focus();
        });
      });
    } else {
      fillPanelData(rowData);
      wrap.classList.add('is-open');
      wrap.setAttribute('aria-hidden', 'false');
      panel?.focus();
    }
  }

  function closePanel() {
    const wrap = document.getElementById('cr-detail-wrap');
    if (!wrap) return;
    closeExceptionPanel();
    wrap.classList.remove('is-open');
    wrap.setAttribute('aria-hidden', 'true');
  }

  /* ── 2단 예외 신청 슬라이드 ─────────────────────────────────────── */
  function openExceptionPanel() {
    const wrap = document.getElementById('cr-detail-wrap');
    const panel = document.getElementById('cr-exception-panel');
    if (!wrap || !panel) return;

    /* 선택된 CCE 항목을 예외 대상 테이블에 반영 */
    renderExceptionTargets();

    /* Flatpickr for 예외 기간 */
    const periodInput = document.getElementById('cr-exc-period');
    if (periodInput && window.flatpickr && !periodInput._flatpickr) {
      flatpickr(periodInput, {
        mode: 'range',
        showMonths: 2,
        dateFormat: 'Y-m-d',
        locale: window.flatpickr.l10ns && window.flatpickr.l10ns.ko ? 'ko' : 'default',
        disableMobile: true,
        onClose(dates, dateStr) {
          if (dates.length === 2) periodInput.value = dateStr;
        },
        onReady(_sd, _ds, fp) {
          if (fp.calendarContainer.querySelector('.flatpickr-custom-footer')) return;
          const footer = document.createElement('div');
          footer.className = 'flatpickr-custom-footer';
          footer.innerHTML =
            '<button type="button" class="flatpickr-footer-cancel">닫기</button>' +
            '<button type="button" class="flatpickr-footer-save">저장</button>';
          footer.querySelector('.flatpickr-footer-cancel').addEventListener('click', () => fp.close());
          footer.querySelector('.flatpickr-footer-save').addEventListener('click', () => fp.close());
          fp.calendarContainer.appendChild(footer);
        }
      });
    }

    wrap.classList.add('is-open-2');
    panel.setAttribute('aria-hidden', 'false');
    panel.focus();
  }

  function closeExceptionPanel() {
    const wrap = document.getElementById('cr-detail-wrap');
    const panel = document.getElementById('cr-exception-panel');
    if (!wrap || !panel) return;
    closeExcSubmitModals();
    wrap.classList.remove('is-open-2');
    panel.setAttribute('aria-hidden', 'true');
  }

  /* ── 예외 신청 상신: 2단 확인 모달 ─────────────────────────────── */
  let excSubmitModalTitle = '';

  function closeExcSubmitModals() {
    const host = document.getElementById('cr-exc-modal-host');
    const confirmEl = document.getElementById('cr-exc-modal-confirm');
    const doneEl = document.getElementById('cr-exc-modal-done');
    excSubmitModalTitle = '';
    confirmEl?.classList.add('d-none');
    doneEl?.classList.add('d-none');
    if (host) {
      host.classList.add('d-none');
      host.setAttribute('aria-hidden', 'true');
    }
  }

  function openExcSubmitConfirmModal(docTitle) {
    excSubmitModalTitle = docTitle;
    const host = document.getElementById('cr-exc-modal-host');
    const confirmEl = document.getElementById('cr-exc-modal-confirm');
    const doneEl = document.getElementById('cr-exc-modal-done');
    const titleEl = document.getElementById('cr-exc-modal-confirm-title');
    if (!host || !confirmEl || !titleEl) return;
    doneEl?.classList.add('d-none');
    titleEl.textContent = docTitle;
    confirmEl.classList.remove('d-none');
    host.classList.remove('d-none');
    host.setAttribute('aria-hidden', 'false');
    document.getElementById('cr-exc-modal-confirm-ok')?.focus();
  }

  function openExcSubmitDoneModal(docTitle) {
    const confirmEl = document.getElementById('cr-exc-modal-confirm');
    const doneEl = document.getElementById('cr-exc-modal-done');
    const titleEl = document.getElementById('cr-exc-modal-done-title');
    if (!doneEl || !titleEl) return;
    confirmEl?.classList.add('d-none');
    titleEl.textContent = docTitle;
    doneEl.classList.remove('d-none');
    document.getElementById('cr-exc-modal-done-ok')?.focus();
  }

  function finishExcSubmitSuccess() {
    closeExcSubmitModals();
    closeExceptionPanel();
  }

  /* ── 예외 대상 테이블 렌더링 ────────────────────────────────────── */
  function renderExceptionTargets() {
    const tbody = document.getElementById('cr-exc-target-tbody');
    const totalEl = document.getElementById('cr-exc-target-total');
    if (!tbody) return;

    const targets = CCE_DATA.filter(d => checkedCceIds.has(d.id));
    if (totalEl) totalEl.textContent = targets.length;

    if (targets.length === 0) {
      tbody.innerHTML = `<tr class="cr-exc-tr">
        <td class="cr-exc-td cr-exc-td-empty" colspan="5">
          좌측 목록에서 체크박스로 CCE 항목을 선택하세요.
        </td></tr>`;
      return;
    }

    tbody.innerHTML = targets.map((d, i) => `
      <tr class="cr-exc-tr">
        <td class="cr-exc-td">${i + 1}</td>
        <td class="cr-exc-td">${d.id}</td>
        <td class="cr-exc-td">${d.name}</td>
        <td class="cr-exc-td">${resultBadge(d.result)}</td>
        <td class="cr-exc-td">${riskBadge(d.risk)}</td>
      </tr>`).join('');
  }

  function updateExceptionTargetCount() {
    const totalEl = document.getElementById('cr-exc-target-total');
    if (totalEl) totalEl.textContent = checkedCceIds.size;
  }

  /* ── 조치 여부 라디오 → 사유 필드 활성/비활성 처리 ─────────────── */
  function initRadioRequiredLogic() {
    document.querySelectorAll('input[name="cr-action-status"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        if (radio.value === '조치') {
          /* 조치 선택 시: 사유 비활성화 */
          setReasonFieldState(true);
        } else {
          /* 미조치 선택 시: 사유 활성화 + 필수 */
          setReasonFieldState(false);
          const reasonTextarea = document.getElementById('cr-action-reason');
          if (reasonTextarea) {
            reasonTextarea.setAttribute('required', '');
            reasonTextarea.placeholder = '미조치 사유를 반드시 입력하세요. (필수)';
          }
        }
      });
    });
  }

  /* ── 초기화 ─────────────────────────────────────────────────────── */
  function init() {
    /* overlay / close 버튼 */
    document.getElementById('cr-detail-overlay')?.addEventListener('click', closePanel);
    document.getElementById('cr-detail-close')?.addEventListener('click', closePanel);

    /* 예외 신청 버튼 */
    document.getElementById('cr-exception-btn')?.addEventListener('click', openExceptionPanel);
    document.getElementById('cr-exception-close')?.addEventListener('click', closeExceptionPanel);
    document.getElementById('cr-exc-cancel')?.addEventListener('click', closeExceptionPanel);

    /* 예외 신청 상신 → 검증 후 1단계 확인 모달 */
    document.getElementById('cr-exc-submit')?.addEventListener('click', () => {
      const reason = document.getElementById('cr-exc-reason')?.value?.trim();
      const docTitle = document.getElementById('cr-exc-doc-title')?.value?.trim();
      const period = document.getElementById('cr-exc-period')?.value?.trim();
      if (!docTitle) { alert('문서 제목을 입력하세요.'); return; }
      if (!period) { alert('예외 기간을 선택하세요.'); return; }
      if (!reason) { alert('신청 사유를 입력하세요.'); return; }
      openExcSubmitConfirmModal(docTitle);
    });

    document.getElementById('cr-exc-modal-confirm-cancel')?.addEventListener('click', closeExcSubmitModals);
    document.getElementById('cr-exc-modal-confirm-ok')?.addEventListener('click', () => {
      if (excSubmitModalTitle) openExcSubmitDoneModal(excSubmitModalTitle);
    });
    document.getElementById('cr-exc-modal-done-ok')?.addEventListener('click', finishExcSubmitSuccess);
    document.getElementById('cr-exc-modal-backdrop')?.addEventListener('click', () => {
      const confirmEl = document.getElementById('cr-exc-modal-confirm');
      const doneEl = document.getElementById('cr-exc-modal-done');
      if (confirmEl && !confirmEl.classList.contains('d-none')) closeExcSubmitModals();
      else if (doneEl && !doneEl.classList.contains('d-none')) finishExcSubmitSuccess();
    });

    /* CCE Filter 토글 */
    document.getElementById('cr-cce-filter-trigger')?.addEventListener('click', () => {
      const panel = document.getElementById('cr-cce-filter-panel');
      if (panel?.classList.contains('d-none')) openCceFilterPanel();
      else closeCceFilterPanel();
    });
    document.getElementById('cr-cce-filter-reset')?.addEventListener('click', resetFilter);
    document.getElementById('cr-fp-apply')?.addEventListener('click', applyFilter);
    document.getElementById('cr-fp-reset')?.addEventListener('click', () => {
      const idEl = document.getElementById('cr-fp-id');
      const resultEl = document.getElementById('cr-fp-result');
      if (idEl) idEl.value = '';
      if (resultEl) resultEl.value = '';
    });
    document.getElementById('cr-fp-cancel')?.addEventListener('click', closeCceFilterPanel);

    /* 전체 선택 체크박스 */
    document.getElementById('cr-cce-check-all')?.addEventListener('change', e => {
      const checked = e.target.checked;
      const filtered = getFilteredData();
      filtered.forEach(d => {
        if (checked) checkedCceIds.add(d.id);
        else checkedCceIds.delete(d.id);
      });
      renderCceTable();
      updateExceptionTargetCount();
    });

    /* ESC 키 닫기 */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const wrap = document.getElementById('cr-detail-wrap');
      if (!wrap?.classList.contains('is-open')) return;
      const modalHost = document.getElementById('cr-exc-modal-host');
      if (modalHost && !modalHost.classList.contains('d-none')) {
        const doneEl = document.getElementById('cr-exc-modal-done');
        if (doneEl && !doneEl.classList.contains('d-none')) finishExcSubmitSuccess();
        else closeExcSubmitModals();
        return;
      }
      if (wrap.classList.contains('is-open-2')) closeExceptionPanel();
      else closePanel();
    });

    /* 조치 여부 라디오 */
    initRadioRequiredLogic();

    /* 조치 일자 Flatpickr (단일 날짜, 피그마 433-4293) */
    const actionDateEl = document.getElementById('cr-action-date');
    if (actionDateEl && typeof flatpickr !== 'undefined') {
      const locale = (window.flatpickr?.l10ns?.ko) ? 'ko' : 'default';
      flatpickr(actionDateEl, {
        dateFormat: 'Y-m-d',
        locale,
        disableMobile: true,
        onReady(_sd, _ds, fp) {
          const footer = document.createElement('div');
          footer.className = 'flatpickr-custom-footer';
          footer.innerHTML =
            '<button type="button" class="flatpickr-footer-cancel">닫기</button>' +
            '<button type="button" class="flatpickr-footer-save">저장</button>';
          footer.querySelector('.flatpickr-footer-cancel').addEventListener('click', () => {
            fp.clear();
            fp.close();
          });
          footer.querySelector('.flatpickr-footer-save').addEventListener('click', () => {
            fp.close();
          });
          fp.calendarContainer.appendChild(footer);
        }
      });
    }

    /* 조치 저장 */
    document.getElementById('cr-action-save-btn')?.addEventListener('click', () => {
      const radios = document.querySelectorAll('input[name="cr-action-status"]');
      const selected = [...radios].find(r => r.checked);
      if (!selected) { alert('조치 여부를 선택하세요.'); return; }
      if (selected.value === '미조치') {
        const reason = document.getElementById('cr-action-reason')?.value?.trim();
        if (!reason) { alert('미조치 사유를 입력하세요.'); return; }
      }
      alert('저장되었습니다.');
    });

    /* 점검 결과 목록(#cr-table-tbody)의 점검명 링크 → 점검 대상별 관리 (GNB 브레드크럼 제목 = 클릭한 점검명) */
    document.addEventListener('click', e => {
      const tbody = document.getElementById('cr-table-tbody');
      const nameBtn = e.target.closest('#cr-table-tbody .cr-name-link');
      if (!tbody || !nameBtn || !tbody.contains(nameBtn)) return;
      const td = nameBtn.closest('td.cr-td-name');
      if (!td || !tbody.contains(td)) return;
      e.preventDefault();
      const name = (nameBtn.dataset.inspection || nameBtn.textContent || '').trim();
      if (!name) return;
      try {
        sessionStorage.setItem('ctInspectionTitle', name);
      } catch (err) { /* ignore */ }
      const q = new URLSearchParams({ inspection: name });
      window.location.href = 'check-target-management.html?' + q.toString();
    });

    /* 점검 대상별 관리 테이블 행 클릭 이벤트 (ct-td-name) → 팝업 열기 */
    document.addEventListener('click', e => {
      const td = e.target.closest('td.ct-td-name');
      if (!td) return;
      const tr = td.closest('tr');
      if (!tr) return;
      const btn = td.querySelector('.cr-name-link');
      const rowData = {
        srvName: btn ? (btn.dataset.srv || btn.textContent.trim()) : 'seemoon-virtual-machine',
        ip:      btn ? (btn.dataset.ip  || '12.123.123.100')          : '12.123.123.100',
        os:      btn ? (btn.dataset.os  || 'Windows')                  : 'Windows',
        osVer:   btn ? (btn.dataset.osVer || 'Server 2020')            : 'Server 2020',
        date:    btn ? (btn.dataset.date  || '2025-12-26 13:48:12')    : '2025-12-26 13:48:12'
      };
      openPanel(rowData);
    });
  }

  /* DOM 준비 후 init */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 외부 접근용 */
  window.crDetailSlide = { open: openPanel, close: closePanel };

})();
