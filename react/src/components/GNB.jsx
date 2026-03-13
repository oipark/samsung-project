/**
 * GNB (상단 헤더)
 * 디자인 시안: 좌측 타이틀(대시보드) / 우측 정보(날짜 | 매뉴얼 | 프로필), 수직 분리선, Tailwind 픽셀 퍼펙트
 */
import { IconDashboard, IconCalendar, IconInfo, IconProfile, IconChevronDown } from './icons'

function formatHeaderDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const dayName = weekdays[date.getDay()]
  return `${y}.${m}.${d} ${dayName}`
}

export default function GNB({ onManualClick, onProfileClick, manualOpen, profileOpen, manualAnchorRef, profileAnchorRef }) {
  const dateStr = formatHeaderDate(new Date())

  return (
    <header
      className="flex h-[60px] shrink-0 items-center justify-between bg-white px-10 font-sans antialiased"
      style={{
        borderBottom: '1px solid var(--color-border)',
        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* 좌측: 타이틀 영역 */}
      <div className="flex items-center gap-2.5">
        <IconDashboard className="h-5 w-5 shrink-0 text-[var(--color-text-primary)]" aria-hidden />
        <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
          대시보드
        </span>
      </div>

      {/* 우측: 날짜 | 매뉴얼 | 프로필 (justify-end, 수직 분리선) */}
      <div className="flex items-center justify-end gap-0">
        {/* 날짜 */}
        <div className="flex items-center gap-2 pl-0 pr-6">
          <IconCalendar className="h-5 w-5 shrink-0 text-[var(--color-text-primary)]" aria-hidden />
          <span className="text-sm font-medium text-[var(--color-text-muted)]">{dateStr}</span>
        </div>

        <div className="h-5 w-0 shrink-0 border-l border-[var(--color-border)]" aria-hidden />

        {/* 매뉴얼(Manual) 버튼 */}
        <div className="flex items-center pl-6 pr-6">
          <button
            ref={manualAnchorRef}
            type="button"
            onClick={onManualClick}
            className="flex cursor-pointer items-center gap-2.5 rounded-md border border-[var(--color-border)] bg-white px-4 py-2.5 text-left hover:bg-[var(--color-black-10)]"
          >
            <IconInfo className="h-5 w-5 shrink-0 text-[var(--color-text-primary)]" aria-hidden />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">매뉴얼(Manual)</span>
            <IconChevronDown
              size={16}
              className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform ${manualOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        </div>

        <div className="h-5 w-0 shrink-0 border-l border-[var(--color-border)]" aria-hidden />

        {/* 김메니 프로필 */}
        <div className="flex items-center pl-6 pr-0">
          <button
            ref={profileAnchorRef}
            type="button"
            onClick={onProfileClick}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2.5 hover:bg-[var(--color-black-10)]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)]">
              <IconProfile className="h-5 w-5 text-[var(--color-text-primary)]" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">김메니</span>
            <IconChevronDown
              size={16}
              className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform ${profileOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </header>
  )
}
