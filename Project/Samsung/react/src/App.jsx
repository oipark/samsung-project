/**
 * 서버 자동 점검 관리 시스템 대시보드
 * Pencil 디자인 파일 기준 Hex/타이포/여백 반영, 컴포넌트 분리
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import DashboardPage from './pages/DashboardPage'
import AssetStatusPage from './pages/AssetStatusPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="asset-status" element={<AssetStatusPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
