/**
 * 최근 점검 계획 리스트 - Figma Samsung 대시보드 (node 77:4752)
 * 컬럼: 점검명, 점검 유형, 사업장/권역, 권역 상세, 상태, 점검일
 */
import { IconEvent, IconArrowRight } from './icons'
import { Badge, Table } from './ui'

const ROWS = [
  {
    id: 1,
    plan: '3분기 글로벌 보안 감사3분기 글로벌 보안 감사3분기 글로벌 보안 감사',
    type: '전체 대상',
    region: '-',
    regionDetail: '-',
    status: '계획 수립',
    date: '2026-02-20',
  },
  {
    id: 2,
    plan: 'APAC 지역 취약점 점검',
    type: '권역/사업장별 대상',
    region: '국내',
    regionDetail: '수원사업장',
    status: '진행중',
    date: '2026-02-19',
  },
  {
    id: 3,
    plan: '결제 게이트웨이 검토',
    type: '개별 대상',
    region: '국내',
    regionDetail: '구미사업장',
    status: '점검 완료',
    date: '2026-02-18',
  },
  {
    id: 4,
    plan: 'EU 컴플라이언스 스캔 (GDPR)',
    type: '권역/사업장별 대상',
    region: '해외',
    regionDetail: '중남미',
    status: '점검 오류',
    date: '2026-02-16',
  },
  {
    id: 5,
    plan: '레거시 시스템 감사',
    type: '전체 대상',
    region: '-',
    regionDetail: '-',
    status: '계획 수립',
    date: '2026-02-12',
  },
  {
    id: 6,
    plan: '1분기 정기 보안 점검',
    type: '권역/사업장별 대상',
    region: '해외',
    regionDetail: 'APAC',
    status: '진행중',
    date: '2026-02-10',
  },
  {
    id: 7,
    plan: '인프라 장애 대응 점검',
    type: '개별 대상',
    region: '국내',
    regionDetail: '서초사업장',
    status: '점검 완료',
    date: '2026-02-08',
  },
  {
    id: 8,
    plan: '클라우드 설정 검증',
    type: '전체 대상',
    region: '-',
    regionDetail: '-',
    status: '계획 수립',
    date: '2026-02-05',
  },
]

export default function InspectionTable() {
  return (
    <div
      className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-lg bg-white"
      style={{
        border: '1px solid var(--color-border-panel)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(17,17,17,0.1)] px-5">
        <div className="flex items-center gap-3">
          <IconEvent className="h-6 w-6 text-[var(--color-text-primary)]" />
          <span className="text-base font-bold text-[var(--color-text-primary)]">
            최근 점검 계획 리스트
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
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <Table minWidth={800}>
          <Table.Head className="sticky top-0 z-10 bg-[var(--color-bg-subtle)] shadow-[0_1px_0_0_rgba(17,17,17,0.1)]">
            <Table.Row>
              <Table.Th style={{ width: '29%' }}>점검명</Table.Th>
              <Table.Th style={{ width: '17%' }}>점검 유형</Table.Th>
              <Table.Th style={{ width: '12%' }}>사업장/권역</Table.Th>
              <Table.Th style={{ width: '12%' }}>권역 상세</Table.Th>
              <Table.Th style={{ width: '17%' }}>상태</Table.Th>
              <Table.Th style={{ width: '13%' }}>점검일</Table.Th>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {ROWS.map((row) => (
              <Table.Row key={row.id}>
                <Table.Td>
                  <span className="line-clamp-2">{row.plan}</span>
                </Table.Td>
                <Table.Td>{row.type}</Table.Td>
                <Table.Td>{row.region}</Table.Td>
                <Table.Td>{row.regionDetail}</Table.Td>
                <Table.Td>
                  <Badge variant="inspection" status={row.status} />
                </Table.Td>
                <Table.Td>{row.date}</Table.Td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}
