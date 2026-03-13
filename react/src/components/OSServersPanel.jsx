/**
 * OS별 서버 현황 - Figma Samsung 대시보드 (node 197:3353)
 * Chart.js 도넛 + 2단 레이아웃(차트 | OS별 리스트)
 */
import { IconAccountTree, IconArrowRight, IconWindows, IconLinux } from './icons'
import DoughnutCenterChart from './ui/DoughnutCenterChart'

const OS_LIST = [
  { name: 'Windows', count: 5009, color: '#13289f', Icon: IconWindows },
  { name: 'Linux', count: 4, color: '#1ea5e4', Icon: IconLinux },
  { name: 'Oracle Solaris', count: 1, color: '#e80b38', Icon: null },
  { name: 'IBM AIX', count: 0, color: '#666666', Icon: null },
]

/* Figma Color: Primary, Status Cyan/Red, Black 60% - hex for Chart.js canvas */
const OS_CHART_COLORS = ['#13289f', '#1ea5e4', '#e80b38', '#666666']

export default function OSServersPanel() {
  const total = OS_LIST.reduce((sum, r) => sum + r.count, 0)
  const chartData = OS_LIST.map((r) => (r.count === 0 ? 0.5 : r.count))
  const chartLabels = OS_LIST.map((r) => r.name)

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-white"
      style={{
        border: '1px solid var(--color-border-panel)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(17,17,17,0.1)] px-5">
        <div className="flex items-center gap-3">
          <IconAccountTree className="h-6 w-6 text-[var(--color-text-primary)]" />
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            OS별 서버 현황
          </span>
        </div>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-black-10)] hover:text-[var(--color-text-primary)]"
          aria-label="더보기"
        >
          <IconArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-5">
        <div className="flex gap-6">
          <DoughnutCenterChart
            data={chartData}
            labels={chartLabels}
            backgroundColor={OS_CHART_COLORS}
            centerLabel="전체"
            centerValue={total}
            size={200}
          />
          <div className="flex min-w-[200px] flex-1 flex-col gap-3">
            {OS_LIST.map((row, i) => {
              const Icon = row.Icon
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-4 w-1 shrink-0 rounded-full"
                      style={{ background: row.color }}
                    />
                    {Icon ? (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                        <Icon className="h-5 w-5" style={{ color: row.color }} />
                      </span>
                    ) : (
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border-2"
                        style={{ borderColor: row.color, width: 20, height: 20 }}
                      />
                    )}
                    <span className="min-w-0 truncate text-sm text-gray-700">{row.name}</span>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-[var(--color-primary)]">
                    {row.count}
                    <span className="ml-0.5 font-normal text-gray-500">대</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
