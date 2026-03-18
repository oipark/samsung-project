/**
 * LNB (좌측 사이드바) - Figma 디자인시스템 side menu / folded menu
 * 하단 아이콘 클릭으로 접기(80px) / 펼치기(260px) 토글
 * - 고정 높이(fixed), 메인 영역만 별도 스크롤
 * - 펼쳤을 때 아이콘 왼쪽 정렬 / 접었을 때 호버 시 서브메뉴를 Portal로 옆에 별도 표시
 */
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import {
  IconDashboard,
  IconChevronRight,
  IconChevronDoubleLeft,
  IconDocumentPencil,
  IconShieldSearch,
  IconClipboardList,
  IconCog,
} from './icons'

const MENU_STRUCTURE = [
  { id: 'dashboard', label: '대시보드', icon: IconDashboard, path: '/', children: null },
  {
    id: 'approval',
    label: '전자결재',
    icon: IconDocumentPencil,
    children: [{ label: '기안함' }, { label: '결제함' }],
  },
  {
    id: 'inspection',
    label: '점검 관리',
    icon: IconShieldSearch,
    children: [
      { label: '점검 서버 현황 관리' },
      { label: '점검 계획 관리' },
      { label: '점검 결과 관리' },
      { label: '자산 소유 현황', path: '/asset-status' },
    ],
  },
  {
    id: 'history',
    label: '이력 조회',
    icon: IconClipboardList,
    children: [{ label: '신청서 조회' }],
  },
  { id: 'settings', label: '환경설정', icon: IconCog, children: null },
]

const LNB_EXPANDED_WIDTH = 260
const LNB_COLLAPSED_WIDTH = 80

export default function LNB({ collapsed = false, onToggle }) {
  const location = useLocation()
  const [subFlyout, setSubFlyout] = useState(null) // { id, top, left, children }
  const leaveTimerRef = useRef(null)

  const isDashboardActive = location.pathname === '/'

  /** 하위 메뉴 중 현재 경로와 일치하는 항목이 있으면 대메뉴 그룹 Active */
  const isParentGroupActive = (item) =>
    item.children?.some((sub) => sub.path && sub.path === location.pathname) ?? false

  const openSubFlyout = (item, ev) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
    if (!item.children?.length) return
    const rect = ev.currentTarget.getBoundingClientRect()
    setSubFlyout({
      id: item.id,
      top: rect.top,
      left: LNB_COLLAPSED_WIDTH,
      children: item.children,
    })
  }

  const closeSubFlyout = () => {
    leaveTimerRef.current = setTimeout(() => setSubFlyout(null), 120)
  }

  const keepSubFlyout = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
  }

  useEffect(() => () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
  }, [])

  return (
    <aside
      className="flex shrink-0 flex-col justify-between border-r border-[rgba(17,17,17,0.1)] bg-white py-5 transition-[width] duration-200 ease-out"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 40,
        width: collapsed ? LNB_COLLAPSED_WIDTH : LNB_EXPANDED_WIDTH,
        paddingLeft: collapsed ? 15 : 20,
        paddingRight: collapsed ? 15 : 16,
      }}
    >
      {/* 상단: 로고 */}
      <div className="flex flex-col shrink-0">
        <div className="flex items-center justify-center pb-4">
          {collapsed ? (
            <span
              className="text-[28px] font-bold leading-none"
              style={{ color: 'var(--color-logo)', fontFamily: 'inherit' }}
            >
              M
            </span>
          ) : (
            <span className="text-xl font-bold uppercase tracking-tight text-[var(--color-primary)]">SAMSUNG</span>
          )}
        </div>
        <div className="border-b border-[#ccc]" />
        <div className="pt-6" />
      </div>

      {/* 메뉴: flex-1 min-h-0, 세로 스크롤 유지 + 스크롤바 숨김 */}
      <nav
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {collapsed ? (
          /* 접힌 상태: 로고·아이콘·버튼 모두 가로 중앙 정렬, 호버 시 서브메뉴 Portal */
          <div className="flex flex-col items-center justify-center gap-2.5">
            {MENU_STRUCTURE.map((item) => {
              const Icon = item.icon
              const isActive = item.id === 'dashboard' ? isDashboardActive : false
              const hasChildren = item.children && item.children.length > 0

              return (
                <div
                  key={item.id}
                  className="flex justify-center"
                  onMouseEnter={(e) => hasChildren && openSubFlyout(item, e)}
                  onMouseLeave={closeSubFlyout}
                >
                  {item.path ? (
                    <NavLink
                      to={item.path}
                      title={item.label}
                      className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[rgba(17,17,17,0.8)] hover:bg-black/5 [&.active]:bg-[var(--color-primary)] [&.active]:text-white"
                      style={{ minWidth: 50, minHeight: 50 }}
                    >
                      <Icon className="h-5 w-5 shrink-0" style={{ color: 'inherit' }} />
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-[rgba(17,17,17,0.8)] hover:bg-black/5"
                      style={{
                        backgroundColor: isActive ? 'var(--color-primary)' : undefined,
                        color: isActive ? '#fff' : undefined,
                        minWidth: 50,
                        minHeight: 50,
                      }}
                      title={item.label}
                    >
                      <Icon className="h-5 w-5 shrink-0" style={{ color: isActive ? '#fff' : 'inherit' }} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* 펼친 상태: 이중 Active — 대메뉴 그룹 강조 + 선택된 하위 메뉴 풀 버튼 */
          <div className="flex flex-col items-stretch gap-2">
            {MENU_STRUCTURE.map((item) => {
              const Icon = item.icon
              const isActive = item.id === 'dashboard' ? isDashboardActive : false
              const hasChildren = item.children && item.children.length > 0
              const parentGroupActive = hasChildren && isParentGroupActive(item)

              return (
                <div
                  key={item.id}
                  className={`flex flex-col gap-1 ${parentGroupActive ? 'rounded-xl bg-[var(--color-primary-10)] p-2' : ''}`}
                >
                  {item.path && !hasChildren ? (
                    <NavLink
                      to={item.path}
                      className={({ isActive: linkActive }) =>
                        `flex min-h-[40px] cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 ${
                          linkActive
                            ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)] font-bold'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-black-10)]'
                        }`
                      }
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5 justify-start">
                        <span className="flex shrink-0 text-current">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-bold">{item.label}</span>
                      </div>
                    </NavLink>
                  ) : (
                    <div
                      className={`flex min-h-[40px] cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 ${
                        isActive
                          ? 'bg-[var(--color-primary-10)] text-[var(--color-primary)] font-bold'
                          : parentGroupActive
                            ? 'text-[var(--color-primary)] font-bold'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-black-10)]'
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2.5 justify-start">
                        <span className="flex shrink-0 text-current">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-bold">{item.label}</span>
                      </div>
                      {hasChildren && (
                        <span className={`shrink-0 ${parentGroupActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                          <IconChevronRight className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                  )}
                  {hasChildren &&
                    item.children.map((sub) =>
                      sub.path ? (
                        <NavLink
                          key={sub.label}
                          to={sub.path}
                          className={({ isActive: subActive }) =>
                            `flex min-h-[36px] cursor-pointer items-center rounded-lg pl-8 pr-4 py-2.5 text-sm font-medium transition-colors ${
                              subActive
                                ? 'bg-[var(--color-primary)] font-bold text-[var(--color-bg-white)]'
                                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-black-10)] hover:text-[var(--color-text-primary)]'
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ) : (
                        <div
                          key={sub.label}
                          className="flex min-h-[36px] cursor-pointer items-center rounded-lg pl-8 pr-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-black-10)] hover:text-[var(--color-text-primary)]"
                        >
                          {sub.label}
                        </div>
                      )
                    )}
                </div>
              )
            })}
          </div>
        )}
      </nav>

      {/* 하단: 접기/펼치기 버튼 */}
      <div className="mt-4 flex shrink-0 justify-center border-t border-[var(--color-border-light)] pt-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-black-10)] hover:text-[var(--color-text-primary)]"
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          <IconChevronDoubleLeft
            className={`h-6 w-6 transition-transform duration-300 ease-out ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* 접힌 상태 서브메뉴: body에 Portal로 렌더 → 이미지 시안 스타일 (연한 배경·둥근 모서리·호버 블루) */}
      {collapsed &&
        subFlyout &&
        createPortal(
          <div
            className="flex min-w-[180px] flex-col gap-1 rounded-xl bg-[#E8EAF6] p-2 shadow-md"
            style={{
              position: 'fixed',
              left: subFlyout.left,
              top: subFlyout.top,
              zIndex: 2147483647,
              isolation: 'isolate',
            }}
            onMouseEnter={keepSubFlyout}
            onMouseLeave={() => setSubFlyout(null)}
          >
            {subFlyout.children.map((sub) =>
              sub.path ? (
                <NavLink
                  key={sub.label}
                  to={sub.path}
                  onClick={() => setSubFlyout(null)}
                  className={({ isActive }) =>
                    `flex w-full cursor-pointer items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-[var(--color-primary)] font-bold text-[var(--color-bg-white)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-white)]'
                    }`
                  }
                >
                  {sub.label}
                </NavLink>
              ) : (
                <button
                  key={sub.label}
                  type="button"
                  className="flex w-full cursor-pointer items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-white)]"
                >
                  {sub.label}
                </button>
              )
            )}
          </div>,
          document.body
        )}
    </aside>
  )
}
