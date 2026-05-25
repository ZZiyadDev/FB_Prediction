import { BrowserRouter, Link, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Layout, Menu, Button, Space, Avatar, Dropdown } from 'antd'
import { DashboardOutlined, TeamOutlined, BarChartOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import DashboardPage from '../features/dashboard/DashboardPage'
import MatchesPage from '../features/matches/MatchesPage'
import PredictionsPage from '../features/predictions/PredictionsPage'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import useStore from '../hooks/useStore'

const { Header, Content, Sider } = Layout

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

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
  const { user, logout } = useStore();
  const navigate = Navigate;

  const handleLogout = () => {
    logout();
  };

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: 'white', padding: 16, textAlign: 'center', fontWeight: 'bold' }}>
          Football AI
        </div>
        <Navigation />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Football Prediction Dashboard</h2>
          <Space size="large">
            <span>{user?.username} ({user?.role})</span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
            <Route path="/predictions" element={<ProtectedRoute><PredictionsPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
