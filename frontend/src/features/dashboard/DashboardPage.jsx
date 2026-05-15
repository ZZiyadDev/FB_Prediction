import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Space, Typography, Button, Select, Spin, Alert } from 'antd'
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { ThunderboltOutlined, TeamOutlined, DashboardOutlined, RiseOutlined } from '@ant-design/icons'
import useStore from '../../hooks/useStore'
import DashboardCard from './DashboardCard'

const { Title, Text } = Typography

const sharedCardStyle = {
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
  border: '1px solid #f0f0f0',
  background: '#ffffff'
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { 
    rawMatches, 
    matchOptions, 
    selectedMatch, 
    predictionData, 
    isMatchesLoading, 
    isPredicting, 
    fetchUpcomingMatches, 
    runAiPrediction, 
    setSelectedMatch,
    error
  } = useStore();

  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // 1. Fetch matches on load
  useEffect(() => {
    fetchUpcomingMatches();
  }, [fetchUpcomingMatches]);

  // 2. Auto-select a random match on load
  useEffect(() => {
    if (rawMatches.length > 0 && !hasAutoSelected && !selectedMatch) {
      const randomIndex = Math.floor(Math.random() * rawMatches.length);
      const randomMatchId = rawMatches[randomIndex].id;
      setSelectedMatch(randomMatchId);
      runAiPrediction(randomMatchId);
      setHasAutoSelected(true);
    }
  }, [rawMatches, hasAutoSelected, selectedMatch, setSelectedMatch, runAiPrediction]);

  // 3. Handle manual selection from dropdown
  const handleMatchChange = (value) => {
    setSelectedMatch(value);
    if (value) {
      runAiPrediction(value);
    }
  };

  // Map real data to the charts
  const matchesData = predictionData ? [
    { name: 'Possession', home: predictionData.stats.possession.home, away: predictionData.stats.possession.away },
    { name: 'Passes (%)', home: predictionData.stats.passes.home, away: predictionData.stats.passes.away },
    { name: 'Shots', home: predictionData.stats.shots.home, away: predictionData.stats.shots.away },
    { name: 'Goals', home: predictionData.stats.goals.home, away: predictionData.stats.goals.away }
  ] : [];

  const probabilityData = predictionData ? [
    { name: 'Home Win', value: predictionData.confidence_scores.H, fill: '#52c41a' },
    { name: 'Draw', value: predictionData.confidence_scores.D, fill: '#faad14' },
    { name: 'Away Win', value: predictionData.confidence_scores.A, fill: '#f5222d' },
  ] : [];

  const topConfidence = predictionData 
    ? Math.max(predictionData.confidence_scores.H, predictionData.confidence_scores.D, predictionData.confidence_scores.A)
    : 0;

  const nextMatchText = predictionData 
    ? `${predictionData.home_team} vs ${predictionData.away_team}`
    : 'TBD';

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Space align="center" style={{ marginBottom: '8px' }}>
            <DashboardOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Command Center
            </Title>
          </Space>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Text type="secondary" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>
              System Overview & Navigation
            </Text>
          </div>
        </div>
        
        {/* ACTION BUTTONS */}
        <Space size="middle">
          <Button 
            type="default" 
            size="large" 
            icon={<TeamOutlined />}
            onClick={() => navigate('/matches')}
            style={{ 
              height: '44px',
              fontSize: '15px',
              fontWeight: 'bold',
              borderRadius: '8px',
              borderColor: '#1677ff',
              color: '#1677ff'
            }}
          >
            View Matches
          </Button>
          <Button 
            type="primary" 
            size="large" 
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/predictions')}
            style={{ 
              background: 'linear-gradient(135deg, #1677ff 0%, #531dab 100%)',
              border: 'none',
              height: '44px',
              fontSize: '15px',
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(22,119,255,0.39)',
              borderRadius: '8px'
            }}
          >
            Engage AI Prediction
          </Button>
        </Space>
      </div>

      {error && (
        <Alert
          message="Connection Error"
          description={`Unable to fetch data from the backend: ${error}. Please make sure your Django backend is running (python manage.py runserver).`}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* MATCH SELECTOR (Like in Predictions Page) */}
        <Card bordered={false} style={{ ...sharedCardStyle, padding: '8px' }}>
          <Space style={{ width: '100%' }} direction="vertical">
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
              FEATURED MATCH FOR DASHBOARD DATA
            </Text>
            <Select
              style={{ width: '100%', maxWidth: '400px' }}
              placeholder="Select a match to view stats..."
              options={matchOptions}
              onChange={handleMatchChange}
              value={selectedMatch}
              size="large"
              loading={isMatchesLoading}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Space>
        </Card>

        {isPredicting && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Loading real-time match data..." />
          </div>
        )}

        {!isPredicting && (
          <>
            {/* STAT CARDS */}
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <DashboardCard 
                  title="Featured Match" 
                  value={nextMatchText} 
                  icon={<TeamOutlined />} 
                />
              </Col>
              <Col xs={24} md={8}>
                <DashboardCard 
                  title="Model Confidence (Selected)" 
                  value={predictionData ? `${topConfidence}%` : 'N/A'} 
                  icon={<ThunderboltOutlined />}
                  gradient="linear-gradient(135deg, #1677ff 0%, #531dab 100%)"
                />
              </Col>
              <Col xs={24} md={8}>
                <DashboardCard 
                  title="Upcoming Games" 
                  value={rawMatches.length > 0 ? rawMatches.length : '0'} 
                  icon={<RiseOutlined />} 
                />
              </Col>
            </Row>

            {/* CHARTS */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title={<span style={{ fontWeight: 'bold' }}>Head-to-Head Stats Comparison</span>} bordered={false} style={{...sharedCardStyle, height: '380px'}}>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={matchesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" name={predictionData?.home_team || 'Home'} dataKey="home" stroke="#1677ff" strokeWidth={4} dot={{ r: 6, fill: '#1677ff', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                      <Line type="monotone" name={predictionData?.away_team || 'Away'} dataKey="away" stroke="#f5222d" strokeWidth={4} dot={{ r: 6, fill: '#f5222d', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title={<span style={{ fontWeight: 'bold' }}>Win Probability Distribution</span>} bordered={false} style={{...sharedCardStyle, height: '380px'}}>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadialBarChart innerRadius="30%" outerRadius="100%" data={probabilityData} startAngle={180} endAngle={-180}>
                      <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title={<span style={{ fontWeight: 'bold' }}>Tactical Team Comparison</span>} bordered={false} style={sharedCardStyle}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={matchesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}> 
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: 'rgba(22, 119, 255, 0.05)' }}
                      />
                      <Legend />
                      <Bar name={predictionData?.home_team || 'Home'} dataKey="home" fill="#1677ff" radius={[6, 6, 0, 0]} barSize={40} />
                      <Bar name={predictionData?.away_team || 'Away'} dataKey="away" fill="#f5222d" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Space>
    </div>
  )
}
