/**
 * 등록 서버 현황 - Figma Samsung 대시보드 (node 197:3245)
 * Chart.js 도넛 + 국내/해외 탭, 2단 레이아웃(차트 | 리스트)
 */
import { useState } from 'react'
import { IconEvent, IconArrowRight } from './icons'
import DoughnutCenterChart from './ui/DoughnutCenterChart'

const CHART_COLORS = [
  '#13289f', /* Figma Primary 100% */
  '#5856d6', /* Figma Status Indigo */
  '#7dbbff',
  '#1ea5e4',
  '#e3ebf9',
  '#71dd8c',
  '#c9d0d7',
  '#ffb55b',
]

const DOMESTIC_LIST = [
  { name: '수원 사업장', count: 10 },
  { name: '우면 사업장', count: 1 },
  { name: '구미 사업장', count: 1 },
  { name: '광주 사업장', count: 0 },
  { name: '서초 사업장', count: 0 },
  { name: '인재개발원', count: 0 },
  { name: '한국 총괄', count: 0 },
  { name: '기타', count: 0 },
]

const OVERSEAS_LIST = [
  { name: '중남미', count: 5 },
  { name: 'APAC', count: 3 },
  { name: '유럽', count: 2 },
  { name: '기타', count: 2 },
]

export default function RegisteredServersPanel() {
  const [tab, setTab] = useState('국내')
  const list = tab === '국내' ? DOMESTIC_LIST : OVERSEAS_LIST
  const total = list.reduce((sum, r) => sum + r.count, 0)
  const chartData = list.map((r) => (r.count === 0 ? 0.5 : r.count))
  const chartLabels = list.map((r) => r.name)

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
          <IconEvent className="h-6 w-6 text-[var(--color-text-primary)]" />
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            등록 서버 현황
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

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="mb-4 flex shrink-0 justify-center">
          <div className="inline-flex rounded-full bg-gray-200 p-0.5">
            {['국내', '해외'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-6">
          <DoughnutCenterChart
            data={chartData}
            labels={chartLabels}
            backgroundColor={CHART_COLORS.slice(0, list.length)}
            centerLabel="전체"
            centerValue={total}
            size={200}
          />
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-3">
            {list.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-4 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-4 w-1 shrink-0 rounded-full"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="truncate text-sm text-gray-700">{row.name}</span>
                </div>
                <span className="shrink-0 text-sm font-bold text-[var(--color-primary)]">
                  {row.count}
                  <span className="ml-0.5 font-normal text-gray-500">대</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
