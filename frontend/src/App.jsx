import { ConfigProvider, theme } from 'antd';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider, useTheme } from './hooks/ThemeContext';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#14b8a6',
          colorInfo: '#3b82f6',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Layout: {
            headerBg: '#0f172a',
            siderBg: '#0f172a',
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkItemSelectedBg: '#14b8a6',
          },
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
