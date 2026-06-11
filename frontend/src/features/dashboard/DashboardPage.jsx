import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Space, Typography, Button, Select, Spin, Alert } from 'antd'
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { ThunderboltOutlined, TeamOutlined, DashboardOutlined, RiseOutlined } from '@ant-design/icons'
import useStore from '../../hooks/useStore'
import DashboardCard from './DashboardCard'

const { Title, Text } = Typography

const sharedCardStyle = {
  borderRadius: '12px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  border: '1px solid #e2e8f0',
  background: '#ffffff'
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { 
    rawMatches, 
    matchOptions, 
    selectedMatch, 
    predictionData, 
    accuracyMetrics,
    isMatchesLoading, 
    isPredicting, 
    fetchUpcomingMatches, 
    runAiPrediction, 
    setSelectedMatch,
    fetchAccuracy,
    error
  } = useStore();

  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // 1. Fetch matches and accuracy on load
  useEffect(() => {
    fetchUpcomingMatches();
    fetchAccuracy();
  }, [fetchUpcomingMatches, fetchAccuracy]);

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
    { name: 'Home Win', value: predictionData.confidence_scores.H, fill: '#14b8a6' },
    { name: 'Draw', value: predictionData.confidence_scores.D, fill: '#94a3b8' },
    { name: 'Away Win', value: predictionData.confidence_scores.A, fill: '#3b82f6' },
  ] : [];

  const topConfidence = predictionData 
    ? Math.max(predictionData.confidence_scores.H, predictionData.confidence_scores.D, predictionData.confidence_scores.A)
    : 0;

  const nextMatchText = predictionData 
    ? `${predictionData.home_team} vs ${predictionData.away_team}`
    : 'TBD';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
            System Analytics
          </Title>
          <Text style={{ color: '#64748b', fontSize: '14px' }}>
            Predictive insights and real-time match data processing
          </Text>
        </div>
        
        {/* ACTION BUTTONS */}
        <Space size="middle">
          <Button 
            type="default" 
            size="large" 
            icon={<TeamOutlined />}
            onClick={() => navigate('/matches')}
            style={{ 
              height: '40px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
            }}
          >
            Match Database
          </Button>
          <Button 
            type="primary" 
            size="large" 
            icon={<ThunderboltOutlined />}
            onClick={() => navigate('/predictions')}
            style={{ 
              background: '#0f172a',
              borderColor: '#0f172a',
              height: '40px',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px'
            }}
          >
            Launch Prediction
          </Button>
        </Space>
      </div>

      {error && (
        <Alert
          message="Connection Error"
          description={`Unable to fetch data from the backend: ${error}. Please make sure your Django backend is running.`}
          type="error"
          showIcon
          style={{ marginBottom: '24px', borderRadius: '8px' }}
        />
      )}

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* MATCH SELECTOR */}
        <Card bordered={false} style={{ ...sharedCardStyle, padding: '8px' }}>
          <Space style={{ width: '100%' }} direction="vertical">
            <Text style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#64748b', textTransform: 'uppercase' }}>
              Select Focus Match
            </Text>
            <Select
              style={{ width: '100%', maxWidth: '400px' }}
              placeholder="Choose a match..."
              options={matchOptions}
              onChange={handleMatchChange}
              value={selectedMatch}
              size="large"
              loading={isMatchesLoading}
              showSearch
            />
          </Space>
        </Card>

        {isPredicting && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Processing neural data..." />
          </div>
        )}

        {!isPredicting && (
          <>
            {/* STAT CARDS */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard 
                  title="Target Match" 
                  value={nextMatchText} 
                  icon={<TeamOutlined />} 
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard 
                  title="Intelligence Confidence" 
                  value={predictionData ? `${topConfidence}%` : 'N/A'} 
                  icon={<ThunderboltOutlined />}
                  gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard 
                  title="AI Success Rate" 
                  value={accuracyMetrics ? `${accuracyMetrics.accuracy_percentage}%` : '0%'} 
                  icon={<RiseOutlined />}
                  gradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard 
                  title="Data Points" 
                  value={rawMatches.length > 0 ? `${rawMatches.length} Matches` : '0'} 
                  icon={<DashboardOutlined />} 
                />
              </Col>
            </Row>

            {/* CHARTS */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Performance Comparison</span>} bordered={false} style={{...sharedCardStyle, height: '380px'}}>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={matchesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Legend iconType="circle" />
                      <Line type="monotone" name={predictionData?.home_team || 'Home'} dataKey="home" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6' }} activeDot={{ r: 6 }} />
                      <Line type="monotone" name={predictionData?.away_team || 'Away'} dataKey="away" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Outcome Probability</span>} bordered={false} style={{...sharedCardStyle, height: '380px'}}>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadialBarChart innerRadius="30%" outerRadius="100%" data={probabilityData} startAngle={180} endAngle={-180}>
                      <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Strategic Data Metrics</span>} bordered={false} style={sharedCardStyle}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={matchesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}> 
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: '#f1f5f9' }}
                      />
                      <Legend iconType="circle" />
                      <Bar name={predictionData?.home_team || 'Home'} dataKey="home" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={32} />
                      <Bar name={predictionData?.away_team || 'Away'} dataKey="away" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
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
