/**
 * 대시보드 메인 페이지 (기존 Layout 메인 영역)
 */
import SummaryCards from '../components/SummaryCards'
import InspectionTable from '../components/InspectionTable'
import MyApplicationsPanel from '../components/MyApplicationsPanel'
import RegisteredServersPanel from '../components/RegisteredServersPanel'
import OSServersPanel from '../components/OSServersPanel'

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div className="shrink-0">
        <SummaryCards />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-3 lg:items-stretch">
          <div className="flex min-h-0 lg:col-span-2">
            <InspectionTable />
          </div>
          <div className="flex min-h-0">
            <MyApplicationsPanel />
          </div>
        </div>
        <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex min-h-0 w-full lg:col-span-2">
            <RegisteredServersPanel />
          </div>
          <div className="flex min-h-0 w-full">
            <OSServersPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
