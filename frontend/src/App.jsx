import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  )
}

export default App
