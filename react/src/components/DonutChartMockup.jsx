/**
 * 도넛 차트 영역 - 실제 차트 라이브러리 없이 Tailwind + SVG 목업
 * 디자인 비율 참고하여 stroke-dasharray로 시각적 목업 퍼블리싱
 */
export default function DonutChartMockup() {
  const segments = [
    { pct: 60, color: '#13289f', label: '정상' },
    { pct: 25, color: '#e3ebf9', label: '주의' },
    { pct: 15, color: '#ffd8e0', label: '위험' },
  ]
  const size = 200
  const stroke = 24
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  let offset = 0
  const dashSegments = segments.map(({ pct }) => {
    const len = (pct / 100) * circumference
    const gap = circumference - len
    const dashArray = `${len} ${gap}`
    const dashOffset = -offset
    offset += len
    return { dashArray, dashOffset }
  })

  return (
    <div
      className="flex flex-col items-center justify-center gap-5 rounded-lg bg-white p-5"
      style={{
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 1.75px rgba(0,0,0,0.05)',
        borderRadius: 8,
        minHeight: 320,
      }}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {segments.map(({ color }, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeDasharray={dashSegments[i].dashArray}
              strokeDashoffset={dashSegments[i].dashOffset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-[#111111]">100</span>
          <span className="text-xs text-[#11111199]">전체</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {segments.map(({ color, label, pct }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />
            <span className="text-sm text-[#111111cc]">
              {label} <span className="font-bold text-[#111111]">{pct}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
