/**
 * 로그인 페이지 - Figma Samsung 디자인 (node 263:4061)
 * 서버 자동 점검관리 시스템
 */
import { useState } from 'react'

const IMG_LEFT_BG = 'https://www.figma.com/api/mcp/asset/a2bbc7b3-43c7-465f-8d4b-f43d19632784'
const IMG_LOGO_WHITE = 'https://www.figma.com/api/mcp/asset/e5ff8507-aa70-4e9b-bcac-bb101f91cb22'

function Checkbox({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border border-[rgba(17,17,17,0.6)] bg-white"
      />
      <span className="text-base text-[var(--color-text-primary)]" style={{ fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}>
        {label}
      </span>
    </label>
  )
}

export default function Login() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberId, setRememberId] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: 실제 로그인 API 연동
    console.log({ userId, password, rememberId })
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[var(--color-bg-base)] p-4"
      style={{ fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}
    >
      <div className="flex w-full max-w-[965px] gap-4 rounded-[20px] bg-white p-4 shadow-[0px_5px_15px_0px_rgba(200,210,225,0.3)] md:p-[15px]">
        {/* 왼쪽: 브랜딩 영역 */}
        <div className="relative flex h-[640px] w-full max-w-[460px] flex-col items-center justify-center rounded-[15px] p-5">
          <div className="absolute inset-0 overflow-hidden rounded-[15px]">
            <img
              src={IMG_LEFT_BG}
              alt=""
              className="absolute left-[-2%] top-[-20%] h-[128%] w-[122%] max-w-none object-cover"
            />
            <div className="absolute inset-0 rounded-[15px] bg-black/40" />
          </div>
          <div className="relative z-10 flex h-[42px] w-[160px] items-center justify-center">
            <img src={IMG_LOGO_WHITE} alt="Samsung" className="h-full w-full object-contain" />
          </div>
          <p className="relative z-10 mt-2 text-center text-base font-bold leading-normal text-white/70">
            Server Vulnerability Management Portal
          </p>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="flex h-[640px] w-full max-w-[460px] flex-col justify-between rounded-[15px] bg-white p-10">
          <div className="flex w-full flex-col">
            {/* 상단 타이틀 + 구분선 */}
            <div className="flex flex-col items-center gap-8">
              <h1 className="text-center text-xl font-bold text-[var(--color-text-primary)]">
                서버 자동 점검관리 시스템
              </h1>
              <div className="h-px w-full bg-[var(--color-divider)]" />
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="mt-5 flex w-full flex-col gap-5">
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">로그인</h2>

              <input
                type="text"
                placeholder="아이디 입력"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-14 w-full rounded-[5px] border border-[rgba(17,17,17,0.4)] bg-white px-4 text-base text-[var(--color-text-primary)] placeholder:text-[rgba(17,17,17,0.4)]"
              />
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-[5px] border border-[rgba(17,17,17,0.4)] bg-white px-4 text-base text-[var(--color-text-primary)] placeholder:text-[rgba(17,17,17,0.4)]"
              />

              <button
                type="submit"
                className="flex h-[60px] w-full cursor-pointer items-center justify-center rounded-[5px] bg-[var(--color-primary)] font-bold text-lg text-white"
              >
                로그인
              </button>

              <Checkbox
                id="remember"
                checked={rememberId}
                onChange={setRememberId}
                label="아이디 기억하기"
              />
            </form>
          </div>

          {/* 보안 유의 사항 */}
          <div className="text-[14px] leading-5 text-[rgba(17,17,17,0.6)]">
            <p className="mb-1 font-bold">보안 유의 사항</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                본 프로그램은 회사의 업무를 지원하는 프로그램으로, 업무 처리 목적으로 사용해야하며 사적인 용도로 사용할 수 없습니다.
              </li>
              <li>
                이용자는 회사의 보안 규정에 따라 본 프로그램 상의 제반 정보(사진 등)가 유출되지 않도록 보안을 철저히 유지해야 합니다.
              </li>
              <li className="font-bold text-[rgba(17,17,17,0.8)]">
                시스템 관리자는 반드시 OTP인증이 필요합니다.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
