import React from 'react'
import { Card, Typography } from 'antd'
import { useThemeStyles } from '../../hooks/themeStyles'

const { Title, Text } = Typography;

export default function DashboardCard({ title, value, icon, gradient }) {
  const ts = useThemeStyles();

  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        background: gradient || ts.dashCardBg,
        border: gradient ? 'none' : `1px solid ${ts.dashCardBorder}`,
        color: gradient ? '#fff' : 'inherit'
      }}
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ 
          color: gradient ? 'rgba(255, 255, 255, 0.9)' : ts.textSecondary, 
          fontSize: '12px', 
          fontWeight: 700, 
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {title}
        </Text>
        {icon && <div style={{ fontSize: '20px', color: gradient ? '#fff' : '#14b8a6', opacity: 0.9 }}>{icon}</div>}
      </div>
      <Title level={3} style={{ margin: 0, color: gradient ? '#fff' : ts.dashCardValueColor, fontWeight: 700 }}>
        {value}
      </Title>
    </Card>
  )
}
