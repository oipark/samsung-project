/**
 * GNB User Popover (My Page) - GNB User Popover.png 시안 100% 픽셀 퍼펙트
 * 프로필 이미지 없음, 세로 나열 사용자 정보, 네이비 메뉴, 언어 드롭다운(한국어/English), 파란 로그아웃 버튼
 */
import { useState, useRef, useEffect } from 'react'

const LANG_OPTIONS = [
  { value: 'ko', label: '한국어', flag: '/manual/Korean_flag.png' },
  { value: 'en', label: 'English', flag: '/manual/American_flag.png' },
]

function IconChevronDown({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function GNBUserPopover({ open, onClose, anchorRef }) {
  const popoverRef = useRef(null)
  const langDropdownRef = useRef(null)
  const [lang, setLang] = useState('ko')
  const [langOpen, setLangOpen] = useState(false)

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

  useEffect(() => {
    if (!langOpen) return
    const handleClickOutsideLang = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutsideLang)
    return () => document.removeEventListener('mousedown', handleClickOutsideLang)
  }, [langOpen])

  if (!open) return null

  const currentLang = LANG_OPTIONS.find((o) => o.value === lang) ?? LANG_OPTIONS[0]

  return (
    <div
      ref={popoverRef}
      className="absolute right-10 top-[calc(60px+12px)] z-50 w-[280px] rounded-xl border-1 border-blue-800 bg-white p-6 shadow-lg"
    >
      {/* 1. 타이틀 영역: My Page(좌) + X(우) */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">My Page</h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="닫기"
        >
          <span className="text-xl leading-none">×</span>
        </button>
      </div>

      {/* 2. 사용자 정보: 세로 나열 (프로필 이미지 없음) */}
      <div className="flex flex-col gap-y-3 border-b border-gray-200 pb-5">
        <div>
          <p className="text-sm text-gray-500">부서명</p>
          <p className="text-base text-gray-900">knox & 개발그룹</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">이름</p>
          <p className="text-base text-gray-900">홍길동</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ID</p>
          <p className="text-base text-gray-900">R02</p>
        </div>
      </div>

      {/* 3. 메뉴 리스트: 네이비 볼드, 구분선 */}
      <div className="">
        <button
          type="button"
          onClick={onClose}
          className="flex w-full cursor-pointer items-center py-3 text-left text-base font-bold text-blue-900 hover:bg-gray-50"
        >
          대시보드 위젯 설정
        </button>

        <div className="relative flex items-center justify-between border-t border-gray-200 py-4" ref={langDropdownRef}>
          <span className="text-base font-bold text-blue-900">언어 변경</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              <img src={currentLang.flag} alt="" className="h-4 w-4 shrink-0 object-contain" />
              <span>{currentLang.label}</span>
              <IconChevronDown className={`shrink-0 text-gray-500 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setLang(opt.value)
                      setLangOpen(false)
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                      lang === opt.value ? 'font-semibold text-blue-900 bg-blue-50' : 'text-gray-900'
                    }`}
                  >
                    <img src={opt.flag} alt="" className="h-4 w-4 shrink-0 object-contain" />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. 로그아웃: 파란 배경 + 흰 텍스트 버튼 */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex w-full cursor-pointer items-center justify-center rounded-md bg-blue-800 px-4 py-2.5 text-base font-bold text-white hover:bg-blue-900"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
