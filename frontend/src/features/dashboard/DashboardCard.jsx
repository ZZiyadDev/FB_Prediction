import { Card } from 'antd'

export default function DashboardCard({ title, value }) {
  return (
    <Card size="small">
      <div style={{ color: '#888', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </Card>
  )
}
