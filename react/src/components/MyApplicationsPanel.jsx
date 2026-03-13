/**
 * 나의 신청 현황 - 시안 기반 (나의신청현황.png)
 * 기간 드롭다운, 상태 필터 탭(전체/결재중/반려/완료), 스크롤 가능 리스트 카드
 */
import { useState, useRef, useEffect } from 'react'
import { IconAssignmentAdd, IconArrowRight, IconChevronDown } from './icons'
import { BADGE_APPLICATION } from '../theme/tokens'

const PERIOD_OPTIONS = [
  { value: 'week', label: '주(Week)' },
  { value: 'month', label: '월(Month)' },
  { value: 'year', label: '년(Year)' },
]

const FILTER_KEYS = ['전체', '결재중', '반려', '완료']

const MOCK_ITEMS = [
  { id: 1, category: '소유권 변경 신청', title: 'DESKTOP-2342 서버 권한 이전 신청', status: '완료', date: '2026-02-13' },
  { id: 2, category: '자산 이관 신청', title: 'SERVER-8891 호스트 소유권 변경 요청', status: '결재중', date: '2026-02-12' },
  { id: 3, category: '소유권 변경 신청', title: 'LAPTOP-AB12 사용자 권한 이전', status: '반려', date: '2026-02-11' },
  { id: 4, category: '점검 계획 신청', title: '2026년 1분기 정기 점검 계획 승인 요청', status: '결재중', date: '2026-02-10' },
  { id: 5, category: '자산 등록 신청', title: '신규 서버 3대 자산 등록 요청', status: '완료', date: '2026-02-09' },
  { id: 6, category: '소유권 변경 신청', title: 'WORKSTATION-01 담당자 변경 신청', status: '결재중', date: '2026-02-08' },
]

function StatusBadge({ status }) {
  const style = BADGE_APPLICATION[status] || BADGE_APPLICATION.완료
  if (!style) return null
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
        color: style.text,
      }}
    >
      {status}
    </span>
  )
}

export default function MyApplicationsPanel() {
  const [period, setPeriod] = useState('month')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('전체')
  const periodRef = useRef(null)

  const filteredItems =
    activeFilter === '전체'
      ? MOCK_ITEMS
      : MOCK_ITEMS.filter((item) => item.status === activeFilter)

  const counts = {
    전체: MOCK_ITEMS.length,
    결재중: MOCK_ITEMS.filter((i) => i.status === '결재중').length,
    반려: MOCK_ITEMS.filter((i) => i.status === '반려').length,
    완료: MOCK_ITEMS.filter((i) => i.status === '완료').length,
  }

  useEffect(() => {
    if (!periodOpen) return
    const handleClickOutside = (e) => {
      if (periodRef.current && !periodRef.current.contains(e.target)) setPeriodOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [periodOpen])

  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? '월(Month)'

  return (
    <div
      className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg bg-white"
      style={{
        border: '1px solid var(--color-border-panel)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* 헤더: 타이틀 + 기간 드롭다운 + 화살표 */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5">
        <div className="flex items-center gap-3">
          <IconAssignmentAdd className="h-6 w-6 shrink-0 text-[var(--color-primary)]" aria-hidden />
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            나의 신청 현황
          </span>
          <div className="relative" ref={periodRef}>
            <button
              type="button"
              onClick={() => setPeriodOpen((o) => !o)}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-black-10)]"
            >
              <span>{periodLabel}</span>
              <IconChevronDown size={16} className="text-[var(--color-text-muted)]" />
            </button>
            {periodOpen && (
              <div
                className="absolute left-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-md"
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPeriod(opt.value)
                      setPeriodOpen(false)
                    }}
                    className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-black-10)]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-black-10)] hover:text-[var(--color-text-primary)]"
          aria-label="더보기"
        >
          <IconArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* 필터 탭: 전체 / 결재중 / 반려 / 완료 (알약형) */}
      <div className="flex shrink-0 flex-wrap gap-2 px-5 pt-4 pb-3">
        {FILTER_KEYS.map((key) => {
          const isActive = activeFilter === key
          const count = counts[key] ?? 0
          const tabBg =
            key === '전체'
              ? 'rgba(17,17,17,0.06)'
              : key === '결재중'
                ? 'rgba(231,231,254,0.8)'
                : key === '반려'
                  ? 'rgba(255,216,224,0.8)'
                  : 'rgba(213,245,221,0.8)'
          const countColor =
            key === '전체'
              ? 'var(--color-text-primary)'
              : key === '결재중'
                ? 'var(--color-status-indigo)'
                : key === '반려'
                  ? 'var(--color-status-red)'
                  : 'var(--color-status-green)'

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--color-primary)' : tabBg,
                color: isActive ? '#fff' : 'var(--color-text-primary)',
              }}
            >
              <span>{key}</span>
              <span
                className="ml-1.5 font-bold"
                style={isActive ? { color: '#fff' } : { color: countColor }}
              >
                {count}건
              </span>
            </button>
          )
        })}
      </div>

      {/* 리스트 카드 영역 (스크롤) */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
        <div className="flex flex-col gap-3">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-[var(--color-text-muted)]">
              해당 상태의 신청 내역이 없습니다.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 transition-colors hover:bg-[var(--color-f1f5f9)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--color-text-muted)]">{item.category}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {item.title}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={item.status} />
                  <span className="text-xs text-[var(--color-text-muted)]">{item.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
