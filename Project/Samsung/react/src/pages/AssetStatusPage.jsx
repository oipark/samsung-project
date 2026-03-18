/**
 * 자산 현황 상세 페이지 - Figma Samsung (node-id=318-2793)
 * 메인 페이지 UI: 알림 배너, 3 Grid 요약 카드, 필터 바, 테이블
 */
import { useState } from 'react'
import {
  IconInfo,
  IconClose,
  IconCheck,
  IconFilterList,
  IconRefresh,
  IconExpandLess,
  IconChevronDown,
  IconWindows,
  IconLinux,
  IconDownload,
} from '../components/icons'
import { Button, Checkbox } from '../components/ui'

/* 시안 기준 더미 데이터. 담당자/운영자 형식: 부서/이름/영문이름. 1명 이상인 경우 줄바꿈(\n)으로 구분. */
const TABLE_DATA = [
  { id: 1, serverName: 'DESKTOP-0001', ip: '192.168.4.132', os: 'Window', osVersion: '10', vm: 'No', region: '국내', site: '수원 사업장', dept: '솔루션개발그룹', manager: '솔루션개발그룹/홍길동/H.Gildong\n인프라운영팀/김메니/K.Mani', location: '수원 IDC A동', system: '-', purpose: '개발', operator: '솔루션개발그룹/홍길동/H.Gildong', irp: 'IRP-2024-001', year: '2022', modified: '2026-02-20 14:30' },
  { id: 2, serverName: 'SERVER-8891', ip: '10.0.2.45', os: 'Linux', osVersion: 'Ubuntu 22.04', vm: 'Yes', region: '국내', site: '구미 사업장', dept: '인프라운영팀', manager: '인프라운영팀/김메니/K.Mani', location: '구미 DC 1층', system: 'SAP', purpose: '운영', operator: '인프라운영팀/김메니/K.Mani\n보안팀/이담당/L.Dam', irp: 'IRP-2024-002', year: '2021', modified: '2026-02-19 09:15' },
  { id: 3, serverName: 'LAPTOP-AB12', ip: '172.16.8.100', os: 'Window', osVersion: '11', vm: 'No', region: '국내', site: '서초 사업장', dept: '보안팀', manager: '보안팀/이담당/L.Dam', location: '본사 서버실', system: '-', purpose: '보안', operator: '보안팀/이담당/L.Dam', irp: 'IRP-2023-015', year: '2023', modified: '2026-02-18 16:45' },
  { id: 4, serverName: 'VM-SOLARIS-01', ip: '192.168.10.22', os: 'Solaris', osVersion: '11.4', vm: 'Yes', region: '해외', site: 'APAC', dept: '글로벌인프라', manager: '글로벌인프라/Park.J/Park.J\n글로벌인프라/Chen.W/Chen.W', location: '싱가포르 DC', system: 'Oracle', purpose: 'DB', operator: '글로벌인프라/Park.J/Park.J\n글로벌인프라/Chen.W/Chen.W', irp: 'IRP-2024-010', year: '2020', modified: '2026-02-17 11:20' },
  { id: 5, serverName: 'WORKSTATION-01', ip: '10.10.5.88', os: 'Linux', osVersion: 'RHEL 8', vm: 'No', region: '국내', site: '우면 사업장', dept: '솔루션개발그룹', manager: '솔루션개발그룹/최개발/C.Dev', location: '우면 R&D', system: 'Jenkins', purpose: '빌드', operator: '솔루션개발그룹/최개발/C.Dev', irp: 'IRP-2024-003', year: '2022', modified: '2026-02-16 08:00' },
  { id: 6, serverName: 'DESKTOP-0002', ip: '192.168.4.133', os: 'Window', osVersion: '10', vm: 'No', region: '국내', site: '수원 사업장', dept: 'QA그룹', manager: 'QA그룹/정테스트/J.Test', location: '수원 IDC B동', system: '-', purpose: '테스트', operator: 'QA그룹/정테스트/J.Test', irp: 'IRP-2024-004', year: '2023', modified: '2026-02-15 13:22' },
  { id: 7, serverName: 'SERVER-DB-02', ip: '10.0.3.10', os: 'Linux', osVersion: 'CentOS 7', vm: 'Yes', region: '해외', site: '유럽', dept: '글로벌인프라', manager: '글로벌인프라/Smith.J/Smith.J\n글로벌인프라/Lee.M/Lee.M', location: '암스테르담 DC', system: 'SAP', purpose: 'DB', operator: '글로벌인프라/Smith.J/Smith.J', irp: 'IRP-2023-020', year: '2019', modified: '2026-02-14 10:05' },
  { id: 8, serverName: 'DESKTOP-0003', ip: '172.30.1.50', os: 'Window', osVersion: '11', vm: 'No', region: '국내', site: '인재개발원', dept: 'HR시스템팀', manager: 'HR시스템팀/한인사/H.HR', location: '본사 3층', system: 'HR Portal', purpose: '인사', operator: 'HR시스템팀/한인사/H.HR', irp: 'IRP-2024-005', year: '2024', modified: '2026-02-13 15:40' },
  { id: 9, serverName: 'SERVER-WEB-01', ip: '10.20.1.100', os: 'Linux', osVersion: 'Ubuntu 20.04', vm: 'Yes', region: '국내', site: '수원 사업장', dept: '웹서비스팀', manager: '웹서비스팀/박웹/P.Web', location: '수원 IDC C동', system: 'Nginx', purpose: '웹', operator: '웹서비스팀/박웹/P.Web\n인프라운영팀/서캐시/S.Cache', irp: 'IRP-2024-006', year: '2021', modified: '2026-02-12 11:00' },
  { id: 10, serverName: 'VM-DEV-03', ip: '192.168.20.55', os: 'Window', osVersion: '10', vm: 'Yes', region: '국내', site: '우면 사업장', dept: '솔루션개발그룹', manager: '솔루션개발그룹/조코드/J.Code', location: '우면 개발실', system: 'GitLab', purpose: '개발', operator: '솔루션개발그룹/조코드/J.Code', irp: 'IRP-2024-007', year: '2023', modified: '2026-02-11 09:30' },
  { id: 11, serverName: 'DB-PRD-01', ip: '10.0.5.20', os: 'Linux', osVersion: 'Oracle Linux 8', vm: 'Yes', region: '국내', site: '구미 사업장', dept: '인프라운영팀', manager: '인프라운영팀/최DB/C.DB', location: '구미 DC 2층', system: 'Oracle', purpose: 'DB', operator: '인프라운영팀/최DB/C.DB', irp: 'IRP-2024-008', year: '2020', modified: '2026-02-10 14:15' },
  { id: 12, serverName: 'DESKTOP-0004', ip: '172.16.10.88', os: 'Window', osVersion: '11', vm: 'No', region: '국내', site: '서초 사업장', dept: '기획팀', manager: '기획팀/윤기획/Y.Plan\n기획팀/오교육/O.Edu', location: '본사 5층', system: '-', purpose: '업무', operator: '기획팀/윤기획/Y.Plan\n기획팀/오교육/O.Edu', irp: 'IRP-2024-009', year: '2024', modified: '2026-02-09 16:45' },
  { id: 13, serverName: 'SERVER-API-02', ip: '10.30.2.77', os: 'Linux', osVersion: 'RHEL 9', vm: 'Yes', region: '해외', site: '중남미', dept: '글로벌인프라', manager: '글로벌인프라/Lee.M/Lee.M', location: '상파울루 DC', system: 'Kubernetes', purpose: 'API', operator: '글로벌인프라/Lee.M/Lee.M', irp: 'IRP-2023-025', year: '2022', modified: '2026-02-08 10:20' },
  { id: 14, serverName: 'LAPTOP-SEC-02', ip: '192.168.5.120', os: 'Window', osVersion: '11', vm: 'No', region: '국내', site: '수원 사업장', dept: '보안팀', manager: '보안팀/강보안/K.Sec', location: '수원 보안실', system: 'SIEM', purpose: '보안', operator: '보안팀/강보안/K.Sec', irp: 'IRP-2024-011', year: '2023', modified: '2026-02-07 13:00' },
  { id: 15, serverName: 'VM-SOLARIS-02', ip: '192.168.11.33', os: 'Solaris', osVersion: '11.4', vm: 'Yes', region: '해외', site: 'APAC', dept: '글로벌인프라', manager: '글로벌인프라/Chen.W/Chen.W\n글로벌인프라/Park.J/Park.J\n글로벌인프라/Smith.J/Smith.J', location: '홍콩 DC', system: 'Oracle', purpose: 'DB', operator: '글로벌인프라/Chen.W/Chen.W\n글로벌인프라/Park.J/Park.J', irp: 'IRP-2024-012', year: '2021', modified: '2026-02-06 08:50' },
  { id: 16, serverName: 'WORKSTATION-02', ip: '10.10.6.99', os: 'Linux', osVersion: 'Debian 12', vm: 'No', region: '국내', site: '광주 사업장', dept: '솔루션개발그룹', manager: '솔루션개발그룹/임빌드/L.Build', location: '광주 R&D', system: 'Docker', purpose: '빌드', operator: '솔루션개발그룹/임빌드/L.Build', irp: 'IRP-2024-013', year: '2022', modified: '2026-02-05 11:30' },
  { id: 17, serverName: 'SERVER-CACHE-01', ip: '10.0.8.15', os: 'Linux', osVersion: 'Ubuntu 22.04', vm: 'Yes', region: '국내', site: '수원 사업장', dept: '인프라운영팀', manager: '인프라운영팀/서캐시/S.Cache', location: '수원 IDC A동', system: 'Redis', purpose: '캐시', operator: '인프라운영팀/서캐시/S.Cache', irp: 'IRP-2024-014', year: '2023', modified: '2026-02-04 15:10' },
  { id: 18, serverName: 'DESKTOP-0005', ip: '172.30.2.60', os: 'Window', osVersion: '10', vm: 'No', region: '국내', site: '인재개발원', dept: '교육팀', manager: '교육팀/오교육/O.Edu', location: '본사 2층', system: 'LMS', purpose: '교육', operator: '교육팀/오교육/O.Edu', irp: 'IRP-2024-015', year: '2024', modified: '2026-02-03 09:00' },
]

function OsIcon({ os, className = 'h-4 w-4' }) {
  if (os === 'Window' || os === 'Windows') return <IconWindows className={className} style={{ color: '#13289f' }} />
  if (os === 'Linux') return <IconLinux className={className} style={{ color: '#1ea5e4' }} />
  if (os === 'Solaris') {
    return (
      <span className={className} style={{ display: 'inline-flex', color: '#e80b38' }}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><ellipse cx="12" cy="12" rx="8" ry="4" /></svg>
      </span>
    )
  }
  return <span className={`${className} rounded bg-gray-300`} style={{ width: 16, height: 16, display: 'inline-block' }} />
}

function RegionBadge({ region }) {
  const isDomestic = region === '국내'
  return (
    <span
      className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
        isDomestic ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      {region}
    </span>
  )
}

const TOTAL_COUNT = 158
const MAX_VISIBLE_PAGES = 10
const ROWS_OPTIONS = [10, 25, 50, 100]

function getVisiblePageNumbers(currentPage, totalPages) {
  const start = Math.floor((currentPage - 1) / MAX_VISIBLE_PAGES) * MAX_VISIBLE_PAGES + 1
  const end = Math.min(start + MAX_VISIBLE_PAGES - 1, totalPages)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function AssetStatusPage() {
  const [bannerVisible, setBannerVisible] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isFiltered] = useState(true) // 필터 적용 여부 (실제로는 필터 조건에서 파생)

  const allChecked = TABLE_DATA.length > 0 && selectedIds.size === TABLE_DATA.length
  const totalPages = Math.max(1, Math.ceil(TOTAL_COUNT / rowsPerPage))
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages
  const startRow = (currentPage - 1) * rowsPerPage + 1
  const endRow = Math.min(currentPage * rowsPerPage, TOTAL_COUNT)

  const handleRowsPerPageChange = (e) => {
    const value = Number(e.target.value)
    setRowsPerPage(value)
    setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil(TOTAL_COUNT / value))))
  }

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    if (allChecked) setSelectedIds(new Set())
    else setSelectedIds(new Set(TABLE_DATA.map((r) => r.id)))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
      {/* 1. 상단 알림 배너 */}
      {bannerVisible && (
        <div className="flex shrink-0 items-center justify-between gap-4 rounded-lg border px-4 py-3 bg-[var(--color-badge-success)] border-[var(--color-status-green)]">
          <div className="flex items-center gap-2 text-[var(--color-badge-success-text)]">
            <IconInfo className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">
              등록한 사업부/법인별IP 대역에 따라 에이전트 설치 시 자동 등록되며, Agent 삭제 시 2주 뒤 서버 현황에서 삭제됩니다.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBannerVisible(false)}
            className="flex cursor-pointer items-center justify-center rounded p-1 text-[var(--color-badge-success-text)] hover:opacity-80"
            aria-label="닫기"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* 2. 상단 요약 위젯 (Container 시안: 1개 흰색 박스 내 3구역 + 세로 구분선) */}
      <div className="shrink-0 rounded-lg border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          {/* 구역 1: 지역별 자산 현황 */}
          <div className="flex flex-col gap-3 px-4">
            <span className="text-sm font-bold text-gray-800">지역별 자산 현황</span>
            <div className="flex gap-2">
              {/* 전체 (Active) */}
              <div className="relative flex flex-1 flex-col rounded-md border border-blue-700 bg-blue-50 p-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs text-gray-500">전체</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                    <IconCheck className="h-3 w-3" />
                  </span>
                </div>
                <span className="mt-1 text-2xl font-bold text-blue-800">500</span>
              </div>
              {/* 국내 */}
              <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  국내
                </span>
                <span className="mt-1 text-2xl font-bold text-gray-900">420</span>
              </div>
              {/* 해외 */}
              <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  해외
                </span>
                <span className="mt-1 text-2xl font-bold text-gray-900">80</span>
              </div>
            </div>
          </div>

          {/* 구역 2: OS별 자산 현황 */}
          <div className="flex flex-col gap-3 px-4">
            <span className="text-sm font-bold text-gray-800">OS별 자산 현황</span>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                <span className="flex items-center justify-between text-xs text-gray-500">
                  Window
                  <IconWindows className="h-4 w-4 shrink-0" style={{ color: '#13289f' }} />
                </span>
                <span className="mt-1 text-2xl font-bold text-gray-900">200</span>
              </div>
              <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                <span className="flex items-center justify-between text-xs text-gray-500">
                  Linux
                  <IconLinux className="h-4 w-4 shrink-0 text-gray-800" />
                </span>
                <span className="mt-1 text-2xl font-bold text-gray-900">200</span>
              </div>
              <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                <span className="flex items-center justify-between text-xs text-gray-500">
                  Solaris
                  <span className="inline-flex h-4 w-4 items-center justify-center" style={{ color: '#e80b38' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><ellipse cx="12" cy="12" rx="8" ry="4" /></svg>
                  </span>
                </span>
                <span className="mt-1 text-2xl font-bold text-gray-900">150</span>
              </div>
              <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                <span className="flex items-center justify-between text-xs text-gray-500">
                  기타 OS
                  <IconChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                </span>
                <span className="mt-1 text-2xl font-bold text-gray-900">50</span>
              </div>
            </div>
          </div>

          {/* 구역 3: 환경별 자산 현황 + 우측 Chevron Up */}
          <div className="flex items-center gap-2 px-4">
            <div className="flex flex-1 flex-col gap-3">
              <span className="text-sm font-bold text-gray-800">환경별 자산 현황</span>
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                  <span className="text-xs text-gray-500">PRD</span>
                  <span className="mt-1 text-2xl font-bold text-gray-900">250</span>
                </div>
                <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                  <span className="text-xs text-gray-500">DEV</span>
                  <span className="mt-1 text-2xl font-bold text-gray-900">200</span>
                </div>
                <div className="flex flex-1 flex-col rounded-md border border-gray-100 bg-[#F8F9FA] p-3">
                  <span className="text-xs text-gray-500">STG</span>
                  <span className="mt-1 text-2xl font-bold text-gray-900">50</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="flex shrink-0 cursor-pointer items-center justify-center rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="위젯 접기/펼치기"
            >
              <IconExpandLess className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. 필터 바 — 필터 영역 / 필터링된 영역 구분 */}
      <div className="relative shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* 필터 영역: 흰 배경, primary border */}
            <div className="flex items-center rounded-lg border px-4 py-3 bg-[var(--color-bg-white)] border-[var(--color-primary-border)]">
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className="flex cursor-pointer items-center gap-1.5 font-bold text-[var(--color-primary)]"
              >
                <IconFilterList className="h-5 w-5" />
                Filter
                <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 text-xs font-bold text-[var(--color-bg-white)]">2</span>
              </button>
            </div>
            {/* 필터링된 영역: primary 5% 배경, primary 40% border */}
            <div className="flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 bg-[var(--color-primary-5)] border-[var(--color-primary-40)]">
              {/* 개별 칩: border primary 100% */}
              <span className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm bg-[var(--color-bg-white)] border-[var(--color-primary)]">
                <span className="text-[var(--color-text-secondary)]">국내/해외: </span>
                <span className="font-medium text-[var(--color-primary)]">전체</span>
                <button type="button" className="cursor-pointer rounded p-0.5 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" aria-label="제거">×</button>
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm bg-[var(--color-bg-white)] border-[var(--color-primary)]">
                <span className="text-[var(--color-text-secondary)]">OS: </span>
                <span className="font-medium text-[var(--color-primary)]">Window</span>
                <button type="button" className="cursor-pointer rounded p-0.5 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]" aria-label="제거">×</button>
              </span>
            </div>
          </div>
          {/* 우측: 필터 초기화 */}
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
          >
            <IconRefresh className="h-4 w-4" />
            필터 초기화
          </button>
        </div>
        {/* 필터 모달 껍데기 (다음 단계 구현) */}
        {isFilterOpen && (
          <div className="absolute left-4 top-full z-20 mt-2 h-48 w-96 rounded-lg border border-[var(--color-primary-border)] bg-[var(--color-bg-white)] shadow-lg" role="dialog" aria-label="필터 옵션">
            {/* 모달 내부는 추후 구현 */}
          </div>
        )}
      </div>

      {/* 테이블 카드 전용 높이 제한 래퍼 — 남은 높이만 차지, 스크롤 없음 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* 상단 버튼·테이블·페이징 감싸는 흰색 카드 — overflow-auto 금지, flex-1 flex flex-col min-h-0 overflow-hidden */}
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* 테이블 상단: 건수 + 버튼 3개 */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-4 py-3">
          <span className="text-sm font-medium text-gray-700">전체 158건</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary">세부 정보 수정</Button>
            <Button variant="primary">자산정보 동기화</Button>
            <Button variant="tertiary" icon={<IconDownload className="h-5 w-5" />}>다운로드</Button>
          </div>
        </div>

        {/* 테이블 직계 부모 — 여기만 스크롤: flex-1 overflow-auto min-h-0 */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-max whitespace-nowrap text-left text-[14px]">
            <thead className="sticky top-0 z-10 bg-gray-50 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
                <tr className="h-[40px] border-b border-gray-200 bg-gray-50">
                  <th className="w-12 px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">
                    <Checkbox
                      checked={allChecked}
                      onChange={toggleAll}
                      aria-label="전체 선택"
                    />
                  </th>
<th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">순번</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">서버명</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">IP</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">OS</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">OS버전</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">VM여부</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">국내/해외</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">사업장/권역</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">사업부/법인</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">담당자</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">서버 위치</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">연계 시스템</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">용도</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">운영자</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">IRP 코드</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">도입년도</th>
                <th className="px-3 py-0 text-[14px] font-semibold text-black bg-gray-50">수정일시</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_DATA.map((row, rowIndex) => {
                  const isSelected = selectedIds.has(row.id)
                  const rowClassName = [
                    'h-[56px] border-b border-gray-200 transition-colors',
                    isSelected
                      ? 'bg-[#eef2ff] hover:bg-blue-100'
                      : rowIndex % 2 === 0
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-white hover:bg-gray-100',
                  ].join(' ')
                  return (
                  <tr key={row.id} className={rowClassName}>
                    <td className="px-3 py-0">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`행 ${row.id} 선택`}
                      />
                    </td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.id}</td>
                    <td className="px-3 py-0">
                      <button type="button" className="cursor-pointer text-[14px] font-medium text-blue-600 hover:underline">
                        {row.serverName}
                      </button>
                    </td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.ip}</td>
                    <td className="px-3 py-0">
                      <span className="inline-flex items-center gap-1.5">
                        <OsIcon os={row.os} />
                        <span className="text-[14px] text-black">{row.os}</span>
                      </span>
                    </td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.osVersion}</td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.vm}</td>
                    <td className="px-3 py-0">
                      <RegionBadge region={row.region} />
                    </td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.site}</td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.dept}</td>
                    <td className="relative max-w-[200px] cursor-pointer px-3 py-0 group">
                      <div className="line-clamp-2 break-keep whitespace-normal text-[14px] text-black">
                        {row.manager}
                      </div>
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-sm -translate-x-1/2 rounded-md bg-[#112a9e] px-4 py-2 text-[14px] text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:visible group-hover:opacity-100 invisible whitespace-pre-line"
                      >
                        {row.manager}
                        <span
                          className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#112a9e]"
                          aria-hidden
                        />
                      </div>
                    </td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.location}</td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.system}</td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.purpose}</td>
                    <td className="relative max-w-[200px] cursor-pointer px-3 py-0 group">
                      <div className="line-clamp-2 break-keep whitespace-normal text-[14px] text-black">
                        {row.operator}
                      </div>
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-sm -translate-x-1/2 rounded-md bg-[#112a9e] px-4 py-2 text-[14px] text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:visible group-hover:opacity-100 invisible whitespace-pre-line"
                      >
                        {row.operator}
                        <span
                          className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#112a9e]"
                          aria-hidden
                        />
                      </div>
                    </td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.irp}</td>
                    <td className="px-3 py-0 text-[14px] text-black">{row.year}</td>
                    <td className="px-3 py-0 text-[14px]">
                      {(() => {
                        const [datePart, timePart] = String(row.modified).split(/\s+/)
                        const time = timePart && timePart.length === 5 ? `${timePart}:00` : timePart || '--:--:--'
                        return (
                          <>
                            <span className="block text-black">{datePart || '--'}</span>
                            <span className="block text-gray-600">{time}</span>
                          </>
                        )
                      })()}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
        </div>

          {/* 3. 하단 풋터/페이징 영역 — 테이블 스크롤 밖, shrink-0으로 스크롤에 말리지 않음 */}
          <div className="flex shrink-0 w-full items-center justify-between border-t border-gray-200 px-4 py-4">
          {/* 좌측: Rows 드롭다운 & 정보 텍스트 */}
          <div className="flex items-center gap-4">
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="페이지당 행 수"
            >
              {ROWS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} rows
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              전체 {TOTAL_COUNT}개 중 {startRow}-{endRow} 표시
              {isFiltered && ' (필터됨)'}
            </span>
          </div>

          {/* 우측: 페이지네이션 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={isFirstPage}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-gray-300"
              aria-label="맨 처음"
            >
              <span className="font-semibold">«</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={isFirstPage}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-gray-300"
              aria-label="이전"
            >
              <span className="font-semibold">‹</span>
            </button>
            <div className="flex items-center gap-1">
              {visiblePages.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    currentPage === num
                      ? 'bg-blue-800 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={`${num}페이지`}
                  aria-current={currentPage === num ? 'page' : undefined}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={isLastPage}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-gray-300"
              aria-label="다음"
            >
              <span className="font-semibold">›</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={isLastPage}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-gray-300"
              aria-label="맨 끝"
            >
              <span className="font-semibold">»</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
