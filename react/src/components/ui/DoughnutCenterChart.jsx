/**
 * 도넛 차트 + 중앙 텍스트 (Figma 디자인: 등록 서버 현황 / OS별 서버 현황)
 * Chart.js 기반, centerText: { label, value } 로 중앙에 "전체" / "12 대" 표시
 */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

/** 도넛 중앙에 라벨/값 그리는 플러그인 (Figma 스타일) */
function getCenterTextPlugin(centerLabel, centerValue) {
  return {
    id: 'doughnutCenterText',
    afterDraw(chart) {
      if (chart.config.type !== 'doughnut') return
      const { ctx, chartArea } = chart
      if (!chartArea) return
      const centerX = (chartArea.left + chartArea.right) / 2
      const centerY = (chartArea.top + chartArea.bottom) / 2
      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'var(--color-text-primary)'
      ctx.font = '14px Pretendard Variable, Pretendard, sans-serif'
      if (centerLabel) ctx.fillText(centerLabel, centerX, centerY - 12)
      ctx.font = 'bold 24px Pretendard Variable, Pretendard, sans-serif'
      ctx.fillText(centerValue != null ? `${centerValue} 대` : '', centerX, centerY + 10)
      ctx.restore()
    },
  }
}

const DEFAULT_OPTIONS = {
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
}

/**
 * @param {Object} props
 * @param {number[]} props.data - 세그먼트 값 배열
 * @param {string[]} [props.labels] - 라벨 (툴팁용)
 * @param {string[]} props.backgroundColor - 세그먼트 색상 (Figma 컬러)
 * @param {string} props.centerLabel - 중앙 상단 텍스트 (예: '전체')
 * @param {number} props.centerValue - 중앙 하단 숫자 (예: 12)
 * @param {number} [props.size=200] - 캔버스 크기 (px)
 */
export default function DoughnutCenterChart({
  data,
  labels = [],
  backgroundColor,
  centerLabel = '전체',
  centerValue,
  size = 200,
}) {
  const chartData = {
    labels: labels.length ? labels : data.map((_, i) => `항목 ${i + 1}`),
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 2,
      },
    ],
  }

  const plugins = [getCenterTextPlugin(centerLabel, centerValue)]

  return (
    <div className="flex shrink-0 flex-col items-center justify-center" style={{ width: size, height: size }}>
      <Doughnut
        data={chartData}
        options={DEFAULT_OPTIONS}
        plugins={plugins}
      />
    </div>
  )
}
