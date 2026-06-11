import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './hooks/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#14b8a6', // Original Turquoise
            colorInfo: '#3b82f6',    // Blue
            borderRadius: 8,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
          components: {
            Layout: {
              headerBg: '#0f172a',    // Original Navy
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
    </ThemeProvider>
  );
}

export default App;
