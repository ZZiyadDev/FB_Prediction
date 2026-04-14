import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { DashboardOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons'
import DashboardPage from '../features/dashboard/DashboardPage'
import MatchesPage from '../features/matches/MatchesPage'
import PredictionsPage from '../features/predictions/PredictionsPage'

const { Header, Content, Sider } = Layout

function Navigation() {
  const location = useLocation()
  const selectedKey = location.pathname === '/matches' ? 'matches' : location.pathname === '/predictions' ? 'predictions' : 'dashboard'

  return (
    <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="matches" icon={<TeamOutlined />}>
        <Link to="/matches">Matches</Link>
      </Menu.Item>
      <Menu.Item key="predictions" icon={<BarChartOutlined />}>
        <Link to="/predictions">Predictions</Link>
      </Menu.Item>
    </Menu>
  )
}

function AppLayout() {
  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: 'white', padding: 16, textAlign: 'center', fontWeight: 'bold' }}>
          Football AI
        </div>
        <Navigation />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <h2>Football Prediction Dashboard</h2>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
