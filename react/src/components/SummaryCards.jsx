/**
 * 상단 4개 요약 카드 - Figma Samsung 대시보드 (node 76:4551)
 * 전체 서버 현황 / 진행 중인 점검 / 전체 취약점 현황 / 점검 오류 현황
 */
import { IconStorage, IconChecklist, IconStar, IconEmergency } from './icons'

const CARD_STYLE = {
  borderRadius: 8,
  border: '1px solid var(--color-border-card)',
  boxShadow: 'var(--shadow-card)',
  padding: 21,
}

const CARDS = [
  {
    title: '전체 서버 현황',
    value: '1,240',
    items: [
      { label: '국내:', value: '800', dot: 'var(--color-primary)' },
      { label: '해외:', value: '440', dot: '#71dd8c' },
    ],
    icon: IconStorage,
    iconBg: '#e3ebf9',
  },
  {
    title: '진행 중인 점검',
    value: '45',
    items: [
      { label: '전체', value: '30', dot: 'var(--color-primary)' },
      { label: '사업장/권역', value: '10', dot: '#71dd8c' },
      { label: '개별', value: '5', dot: '#ffb55b' },
    ],
    icon: IconChecklist,
    iconBg: '#e3ebf9',
  },
  {
    title: '전체 취약점 현황',
    value: '23.0K',
    items: [
      { label: '양호', value: '22.6K', dot: '#71dd8c' },
      { label: '취약', value: '300', dot: '#ff7b96' },
      { label: '인터뷰', value: '50', dot: '#ffb55b' },
    ],
    icon: IconStar,
    iconBg: '#e3ebf9',
  },
  {
    title: '점검 오류 현황',
    value: '12',
    items: [
      { label: '전체', value: '3', dot: 'var(--color-primary)' },
      { label: '사업장/권역', value: '1', dot: '#71dd8c' },
      { label: '개별', value: '8', dot: '#ffb55b' },
    ],
    icon: IconEmergency,
    iconBg: '#ffd8e0',
    borderColor: 'var(--color-status-red)',
    valueColor: 'var(--color-status-red)',
    iconColor: 'var(--color-status-red)',
  },
]

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card, i) => {
        const Icon = card.icon
        return (
          <div
            key={i}
            className="flex flex-col justify-between bg-white"
            style={{
              ...CARD_STYLE,
              minHeight: 160,
              ...(card.borderColor && { borderColor: card.borderColor }),
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {card.title}
                </span>
                <span
                  className="text-[32px] font-bold leading-none"
                  style={{ color: card.valueColor ?? 'var(--color-primary)' }}
                >
                  {card.value}
                </span>
              </div>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: card.iconBg }}
              >
                <Icon className="h-5 w-5" style={{ color: card.iconColor ?? 'var(--color-primary)' }} />
              </div>
            </div>
            <div
              className="mt-4 flex flex-wrap gap-4 border-t pt-3"
              style={{ borderColor: 'var(--color-f1f5f9)' }}
            >
              {card.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: item.dot }}
                  />
                  <span className="text-sm text-[var(--color-text-primary)]">
                    {item.label}{' '}
                    <span className="font-bold">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
