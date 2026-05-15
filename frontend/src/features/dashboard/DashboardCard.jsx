import React from 'react'
import { Card, Typography } from 'antd'

const { Title, Text } = Typography;

export default function DashboardCard({ title, value, icon, gradient }) {
  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        background: gradient || '#ffffff',
        border: gradient ? 'none' : '1px solid #f0f0f0',
        color: gradient ? '#fff' : 'inherit'
      }}
      styles={{ body: { padding: '24px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ 
          color: gradient ? 'rgba(255, 255, 255, 0.8)' : '#8c8c8c', 
          fontSize: '14px', 
          fontWeight: 600, 
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          {title}
        </Text>
        {icon && <div style={{ fontSize: '24px', color: gradient ? '#fff' : '#1677ff', opacity: 0.8 }}>{icon}</div>}
      </div>
      <Title level={2} style={{ margin: 0, color: gradient ? '#fff' : 'inherit', fontWeight: 800 }}>
        {value}
      </Title>
    </Card>
  )
}
