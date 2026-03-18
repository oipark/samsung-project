/**
 * 뱃지 컴포넌트 - Figma 디자인 시스템 (점검계획 스테이터스 / 신청상황_18px)
 * @param variant 'inspection' | 'application'
 * @param status variant에 따른 상태 키 (예: '진행중', '완료')
 * @param children 표시 텍스트 (없으면 status 사용)
 */
import { BADGE_INSPECTION, BADGE_APPLICATION } from '../../theme/tokens'

const VARIANT_MAP = {
  inspection: BADGE_INSPECTION,
  application: BADGE_APPLICATION,
}

const SIZE_CLASS = {
  sm: 'rounded border px-1.5 py-0.5 text-[10px] font-bold',
  md: 'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs',
}

export default function Badge({
  variant = 'inspection',
  status,
  size = 'md',
  children,
  className = '',
}) {
  const stylesMap = VARIANT_MAP[variant]
  const style = stylesMap?.[status] ?? stylesMap?.[Object.keys(stylesMap)[0]] ?? {
    bg: 'rgba(17,17,17,0.1)',
    text: 'rgba(17,17,17,0.6)',
    border: 'rgba(17,17,17,0.1)',
  }
  const label = children ?? status

  return (
    <span
      className={`${SIZE_CLASS[size]} ${className}`}
      style={{
        background: style.bg,
        borderColor: style.border,
        color: style.text,
      }}
    >
      {label}
    </span>
  )
}
