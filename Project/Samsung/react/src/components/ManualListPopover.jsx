/**
 * Manual List Popover - Figma 227:3223
 * 매뉴얼 클릭 시 노출, 내부 네모박스는 모두 버튼
 *
 * 매뉴얼 이미지 추가 방법:
 * 1. 이미지 파일을 프로젝트의 public/manual/ 폴더에 넣기 (예: public/manual/guide.png)
 * 2. 사용 시: <img src="/manual/파일명.확장자" alt="설명" className="..." />
 * 3. 또는 src/assets/ 에 넣고: import guideImg from '@/assets/manual/guide.png' 후 src={guideImg}
 */
import { useRef, useEffect } from 'react'
import { IconClose, IconWindows, IconLinux, IconDocumentPencil, M3Icon } from './icons'

const POPOVER_STYLE = {
  width: 300,
  padding: 20,
  borderRadius: 8,
  boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
  border: '1px solid var(--color-primary)',
}

const BTN_OUTLINE = 'flex h-6 min-h-[24px] cursor-pointer items-center justify-center gap-1.5 rounded px-2.5 text-xs font-normal border border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary-bg)]'
const BTN_PRIMARY = 'flex h-6 min-h-[24px] cursor-pointer items-center justify-center gap-1.5 rounded px-2.5 text-xs font-bold border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:opacity-90'

function ManualBtn({ primary, children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={primary ? BTN_PRIMARY : `${BTN_OUTLINE} ${className}`}
    >
      {children}
    </button>
  )
}

export default function ManualListPopover({ open, onClose, anchorRef }) {
  const popoverRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose, anchorRef])

  if (!open) return null

  const noop = () => {}

  return (
    <div
      ref={popoverRef}
      className="absolute right-10 top-[68px] z-50 flex flex-col gap-5 rounded-lg bg-white"
      style={POPOVER_STYLE}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">Manual List</span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[var(--color-text-muted)] hover:bg-black/5 hover:text-[var(--color-text-primary)]"
          aria-label="닫기"
        >
          <IconClose className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="flex flex-col gap-0">
        {/* 1. 사용자 메뉴얼 (이미지: public/manual/ 폴더에 넣고 src="/manual/파일명" 사용) */}
        <div className="border-b border-[rgba(17,17,17,0.2)] pb-5">
          <p className="mb-2.5 text-center text-sm font-bold leading-5 text-[rgba(17,17,17,0.8)]">
            사용자 메뉴얼 (User Manual)
          </p>
          {/* 매뉴얼 이미지 추가: public/manual/ 에 이미지 넣고 아래 src 만 수정 */}
          <div className="mb-2.5 flex justify-center">
            <img
              src="/manual/user-manual.png"
              alt="사용자 메뉴얼"
              className="max-h-20 w-full rounded object-contain object-center"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div className="flex gap-2.5">
            <ManualBtn onClick={noop} className="flex-1"><img src="/manual/Korean_flag.png" alt="한국어" className="h-4 w-4" />한국어</ManualBtn>
            <ManualBtn onClick={noop} className="flex-1"><img src="/manual/American_flag.png" alt="English" className="h-4 w-4" />English</ManualBtn>
          </div>
        </div>

        {/* 2. 테니엄 에이전트 */}
        <div className="border-b border-[rgba(17,17,17,0.2)] py-3 pb-5">
          <p className="mb-2.5 text-center text-sm font-bold leading-5 text-[rgba(17,17,17,0.8)]">
            테니엄 에이전트 (Tanium Agent)
          </p>
          <div className="flex flex-col gap-2.5">
            <ManualBtn primary onClick={noop}>
              <M3Icon icon="install_desktop" size={16} />
              설치 가이드 Install Guide
            </ManualBtn>
            <div className="flex gap-2.5">
              <ManualBtn onClick={noop} className="flex-1">
                <img src="/manual/Window_logo.png" alt="Windows" className="h-4 w-4" />
                Windows
              </ManualBtn>
              <ManualBtn onClick={noop} className="flex-1">
                <img src="/manual/Linux_logo.png" alt="linux" className="h-4 w-4" />
                Linux
              </ManualBtn>
            </div>
            <div className="flex gap-2.5">
              <ManualBtn onClick={noop} className="flex-1">
                <img src="/manual/Oracle_logo.png" alt="oracle_solaris" className="h-4 w-4" />
                Solaris
              </ManualBtn>
              <ManualBtn onClick={noop} className="flex-1">
                <img src="/manual/AIX_logo.png" alt="aix" className="h-4 w-4" />
                AIX
              </ManualBtn>
            </div>
          </div>
        </div>

        {/* 3. 서버 보안 점검 체크리스트 */}
        <div className="border-b border-[rgba(17,17,17,0.2)] py-3 pb-5">
          <p className="mb-2.5 text-center text-sm font-bold leading-5 text-[rgba(17,17,17,0.8)]">
            서버 보안 점검 체크리스트
            <br />
            (Server Security Checklist)
          </p>
          <div className="flex gap-2.5">
            <ManualBtn onClick={noop} className="flex-1"><img src="/manual/Korean_flag.png" alt="한국어" className="h-4 w-4" />한국어</ManualBtn>
            <ManualBtn onClick={noop} className="flex-1"><img src="/manual/American_flag.png" alt="English" className="h-4 w-4" />English</ManualBtn>
          </div>
        </div>

        {/* 4. 보안 담당자 메뉴얼 */}
        <div className="border-b border-[rgba(17,17,17,0.2)] py-3 pb-5">
          <p className="mb-2.5 text-center text-sm font-bold leading-5 text-[rgba(17,17,17,0.8)]">
            보안 담당자 메뉴얼
            <br />
            (Manual for Security Manager)
          </p>
          <div className="flex gap-2.5 w-full">
            <ManualBtn onClick={noop} className="flex-1"><img src="/manual/Korean_flag.png" alt="한국어" className="h-4 w-4" />한국어</ManualBtn>
            <ManualBtn onClick={noop} className="flex-1"><img src="/manual/American_flag.png" alt="English" className="h-4 w-4" />English</ManualBtn>
          </div>
        </div>

        {/* 5. 주요 Q&A */}
        <div className="pt-3 pb-2">
          <p className="mb-2.5 text-center text-sm font-bold leading-5 text-[rgba(17,17,17,0.8)] whitespace-pre-wrap">
            주요 Q&A (Major Q&A) - Mosaic
          </p>
          <ManualBtn onClick={noop} className="h-[42px] w-full justify-center gap-1.5 px-2.5">
            <IconDocumentPencil className="h-4 w-4 shrink-0" />
            <span className="text-left">
              전사 보안 점검 상세 가이드
              <br />
              Security Diagnosis Detailed Guide
            </span>
          </ManualBtn>
        </div>
      </div>
    </div>
  )
}
