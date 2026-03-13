/**
 * Layout - LNB + GNB + 메인 콘텐츠 (Figma Samsung 대시보드 구조)
 * LNB는 고정 높이(fixed), 메인 영역만 별도 스크롤
 * 최상위: 노트북 기준 최소 너비(1440px) 고정, 가로 스크롤, 배경 잘림 방지
 */
import { useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import LNB from './LNB'
import GNB from './GNB'
import ManualListPopover from './ManualListPopover'
import GNBUserPopover from './GNBUserPopover'

const LNB_EXPANDED_WIDTH = 260
const LNB_COLLAPSED_WIDTH = 80

export default function Layout() {
  const [manualOpen, setManualOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [lnbCollapsed, setLnbCollapsed] = useState(false)
  const manualAnchorRef = useRef(null)
  const profileAnchorRef = useRef(null)

  return (
    <div className="h-screen min-h-[900px] w-full overflow-hidden">
      <div className="flex min-h-[900px] h-full min-w-[1440px] bg-[var(--color-bg-base)]">
        <LNB
          collapsed={lnbCollapsed}
          onToggle={() => setLnbCollapsed((c) => !c)}
        />

        <div
          className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[margin-left] duration-200 ease-out"
          style={{ marginLeft: lnbCollapsed ? LNB_COLLAPSED_WIDTH : LNB_EXPANDED_WIDTH }}
        >
          <GNB
            onManualClick={() => {
              setProfileOpen(false)
              setManualOpen((v) => !v)
            }}
            onProfileClick={() => {
              setManualOpen(false)
              setProfileOpen((v) => !v)
            }}
            manualOpen={manualOpen}
            profileOpen={profileOpen}
            manualAnchorRef={manualAnchorRef}
            profileAnchorRef={profileAnchorRef}
          />

          <ManualListPopover
            open={manualOpen}
            onClose={() => setManualOpen(false)}
            anchorRef={manualAnchorRef}
          />
          <GNBUserPopover
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            anchorRef={profileAnchorRef}
          />

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-[30px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
