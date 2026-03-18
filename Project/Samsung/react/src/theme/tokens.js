/**
 * 디자인 토큰 (Figma 디자인시스템 Color node 2-363과 동기화)
 * - index.css :root 변수와 1:1 매칭
 */

/** CSS 변수명 (index.css :root와 1:1 매칭) */
export const colors = {
  bgBase: 'var(--color-bg-base)',
  bgWhite: 'var(--color-bg-white)',
  bgSubtle: 'var(--color-bg-subtle)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primaryBg: 'var(--color-primary-bg)',
  primaryBorder: 'var(--color-primary-border)',
  borderPanel: 'var(--color-border-panel)',
  borderCard: 'var(--color-border-card)',
  cardAccent: 'var(--color-card-accent)',
  emergency: 'var(--color-emergency)',
  badgeSuccess: 'var(--color-badge-success)',
  badgeSuccessText: 'var(--color-badge-success-text)',
  f1f5f9: 'var(--color-f1f5f9)',
  divider: 'var(--color-divider)',
  statusPurple: 'var(--color-status-purple)',
  statusIndigo: 'var(--color-status-indigo)',
  statusBlue: 'var(--color-status-blue)',
  statusCyan: 'var(--color-status-cyan)',
  statusGreen: 'var(--color-status-green)',
  statusYellow: 'var(--color-status-yellow)',
  statusOrange: 'var(--color-status-orange)',
  statusRed: 'var(--color-status-red)',
}

/** 점검 계획 스테이터스 (Figma: 점검계획 스테이터스) */
export const BADGE_INSPECTION = {
  '계획 수립': {
    bg: 'rgba(17,17,17,0.1)',
    text: 'rgba(17,17,17,0.6)',
    border: 'rgba(17,17,17,0.1)',
  },
  진행중: {
    bg: 'rgba(216,235,255,0.8)',
    text: '#007aff',
    border: '#7dbbff',
  },
  '점검 완료': {
    bg: 'rgba(213,245,221,0.8)',
    text: '#0a8529',
    border: '#71dd8c',
  },
  '점검 오류': {
    bg: 'rgba(255,216,224,0.8)',
    text: '#e80b38',
    border: '#ff7b96',
  },
}

/** 신청 상황 뱃지 (Figma: 신청상황_18px) */
export const BADGE_APPLICATION = {
  완료: {
    bg: 'rgba(213,245,221,0.8)',
    border: '#71dd8c',
    text: '#0a8529',
  },
  반려: {
    bg: 'rgba(255,216,224,0.8)',
    border: '#ff7b96',
    text: '#e80b38',
  },
  결재중: {
    bg: 'rgba(231,231,254,0.8)',
    border: '#adadfb',
    text: '#5856d6',
  },
  결재완료: {
    bg: 'rgba(231,231,254,0.8)',
    border: '#adadfb',
    text: '#5856d6',
  },
}

/** 테이블 스타일 (공통) */
export const tableStyles = {
  th: 'h-10 px-4 py-2.5 text-left text-sm font-bold text-[var(--color-text-primary)] border-b border-[rgba(17,17,17,0.1)]',
  td: 'px-4 py-3 text-sm text-[var(--color-text-primary)] border-b border-[rgba(17,17,17,0.05)] align-middle',
}

/**
 * 공통 버튼 스타일 (Figma Button/Button-34px, Button-24px node 323-3588)
 * - 1st: Primary (채움), 2nd: Secondary (테두리), 3rd: Tertiary (배경만)
 */
export const buttonStyles = {
  /** 34px 높이 (기본) */
  size34: {
    height: 34,
    paddingX: 12,
    paddingY: 7.5,
    borderRadius: 4,
    fontSize: 14,
    minWidth: 60,
  },
  /** 24px 높이 */
  size24: {
    height: 24,
    paddingX: 10,
    paddingY: 4,
    borderRadius: 4,
    fontSize: 14,
    minWidth: 40,
  },
  /** 1st: Primary - 배경 primary, 텍스트 흰색, Bold */
  primary: {
    bg: 'var(--color-primary)',
    bgHover: 'var(--color-button-primary-hover)',
    color: '#ffffff',
    fontWeight: 700,
    border: 'none',
  },
  /** 2nd: Secondary - 흰 배경, primary 테두리/텍스트 */
  secondary: {
    bg: '#ffffff',
    bgHover: 'var(--color-primary-bg)',
    color: 'var(--color-primary)',
    fontWeight: 400,
    border: '1px solid var(--color-primary)',
  },
  /** 3rd: Tertiary - 연한 배경, primary 텍스트 */
  tertiary: {
    bg: 'var(--color-bg-subtle)',
    bgHover: 'var(--color-black-10)',
    color: 'var(--color-primary)',
    fontWeight: 400,
    border: 'none',
  },
}

/**
 * 체크박스 스타일 (Figma node 330-3591)
 * 1. 일반상태 (default)  2. 체크된상태 (checked)
 * 3. 체크됨 + 비활성 (checked disabled)  4. 비체크 + 비활성 (unchecked disabled)
 */
export const checkboxStyles = {
  /** 공통: 20x20, rounded-md, border-2, transition */
  base: 'h-5 w-5 shrink-0 appearance-none rounded-md border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
  /** 1. 일반상태: 회색 테두리, 흰 배경 */
  default: 'cursor-pointer border-gray-300 bg-white',
  /** 2. 체크된상태: primary 배경/테두리 */
  checked: 'cursor-pointer border-blue-800 bg-blue-800 checked:border-blue-800 checked:bg-blue-800',
  /** 3. 체크됨 + 비활성: primary 연하게, 클릭 불가 */
  checkedDisabled: 'cursor-not-allowed border-blue-300 bg-blue-200',
  /** 4. 비체크 + 비활성: 회색 배경/테두리, 클릭 불가 */
  uncheckedDisabled: 'cursor-not-allowed border-gray-200 bg-gray-100',
}
