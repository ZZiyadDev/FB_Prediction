import { BrowserRouter, Link, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { Layout, Menu, Space, Avatar, Dropdown, Switch } from 'antd'
import { DashboardOutlined, TeamOutlined, LogoutOutlined, UserOutlined, SettingOutlined, LineChartOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import DashboardPage from '../features/dashboard/DashboardPage'
import MatchesPage from '../features/matches/MatchesPage'
import PerformancePage from '../features/performance/PerformancePage'
import AdminPage from '../features/admin/AdminPage'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import useStore from '../hooks/useStore'
import { useTheme } from '../hooks/ThemeContext'
import { useThemeStyles } from '../hooks/themeStyles'

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
  const { user } = useStore();
  const location = useLocation()
  const selectedKey = location.pathname === '/matches' ? 'matches' : 
                     location.pathname === '/performance' ? 'performance' :
                     location.pathname === '/admin' ? 'admin' : 'dashboard'

  return (
    <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="matches" icon={<TeamOutlined />}>
        <Link to="/matches">Matches</Link>
      </Menu.Item>
      <Menu.Item key="performance" icon={<LineChartOutlined />}>
        <Link to="/performance">Performance</Link>
      </Menu.Item>
      {user?.role === 'ADMIN' && (
        <Menu.Item key="admin" icon={<SettingOutlined />}>
          <Link to="/admin">Admin Panel</Link>
        </Menu.Item>
      )}
    </Menu>
  )
}

function AppLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const ts = useThemeStyles();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <div style={{ color: '#14b8a6', padding: '24px 16px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>
          FOOTBALL AI
        </div>
        <Navigation />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: '#0f172a' 
        }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 600 }}>Command Center</h2>
          <Space size="middle">
            {/* Theme toggle switch */}
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{ 
                backgroundColor: isDarkMode ? '#14b8a6' : '#94a3b8',
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              <span style={{ color: '#14b8a6', marginRight: '8px' }}>●</span>
              {user?.username} <span style={{ opacity: 0.5, marginLeft: '4px' }}>({user?.role})</span>
            </span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar 
                icon={<UserOutlined />} 
                style={{ cursor: 'pointer', backgroundColor: '#14b8a6' }} 
              />
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: '0', 
          padding: '0', 
          minHeight: 280, 
          background: ts.contentBg,
          transition: 'background-color 0.3s ease',
        }}>
          <div style={{ padding: '32px' }}>
            <Routes>
              <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
              <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
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
