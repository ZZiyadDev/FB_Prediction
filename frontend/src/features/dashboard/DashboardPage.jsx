import { Card, Col, Row, Space } from 'antd'
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import DashboardCard from './DashboardCard'

const matchesData = [
  { name: 'Match 1', goals: 3, expected: 65 },
  { name: 'Match 2', goals: 1, expected: 42 },
  { name: 'Match 3', goals: 4, expected: 80 },
  { name: 'Match 4', goals: 2, expected: 55 },
]

const probabilityData = [
  { name: 'Win', value: 70 },
  { name: 'Draw', value: 20 },
  { name: 'Lose', value: 10 },
]

export default function DashboardPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <DashboardCard title="Next match" value="Team A vs Team B" />
        </Col>
        <Col span={8}>
          <DashboardCard title="Prediction confidence" value="70%" />
        </Col>
        <Col span={8}>
          <DashboardCard title="Upcoming games" value="4" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12} style={{ minHeight: 320 }}>
          <Card title="Goals Over Time" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={matchesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="goals" stroke="#1890ff" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12} style={{ minHeight: 320 }}>
          <Card title="Win Probability" style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart innerRadius="10%" outerRadius="80%" data={probabilityData} startAngle={180} endAngle={-180}>
                <RadialBar minAngle={15} background clockWise dataKey="value" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Match chance summary">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={matchesData}> 
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="expected" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
