import React, { useEffect } from 'react';
import { Card, Select, Button, Typography, Row, Col, Spin, Alert, Tag, Space, Badge } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { RadarChartOutlined, ThunderboltOutlined, TeamOutlined, RiseOutlined } from '@ant-design/icons';
import useStore from '../../hooks/useStore';
import MatchLineup from '../matches/MatchLineup';
import TeamFormGuide from '../matches/TeamFormGuide';
import PredictionHistory from './PredictionHistory';

const { Title, Text } = Typography;

const COLORS = { H: '#14b8a6', D: '#94a3b8', A: '#3b82f6' };

const PredictionsPage = () => {
  const { 
    matchOptions, 
    selectedMatch, 
    predictionData, 
    predictionHistory,
    isMatchesLoading, 
    isPredicting, 
    error,
    setSelectedMatch, 
    fetchUpcomingMatches, 
    runAiPrediction,
    fetchPredictionHistory
  } = useStore();

  useEffect(() => {
    fetchUpcomingMatches();
    fetchPredictionHistory();
  }, [fetchUpcomingMatches, fetchPredictionHistory]);

  const handlePredict = async () => {
    if (selectedMatch) {
      await runAiPrediction(selectedMatch);
      fetchPredictionHistory(); // Refresh history after prediction
    }
  };

  try {
    // Dynamically inject the actual team names instead of "Home" / "Away"
    const donutData = (predictionData && predictionData.confidence_scores) ? [
      { name: `${predictionData.home_team} Win`, value: predictionData.confidence_scores.H || 0, color: COLORS.H },
      { name: 'Draw', value: predictionData.confidence_scores.D || 0, color: COLORS.D },
      { name: `${predictionData.away_team} Win`, value: predictionData.confidence_scores.A || 0, color: COLORS.A },
    ] : [];

    // 2. MAP THE DJANGO STATS TO THE RADAR CHART
    const radarData = (predictionData && predictionData.stats) ? [
      { subject: 'Possession %', home: predictionData.stats.possession?.home || 0, away: predictionData.stats.possession?.away || 0 },
      { subject: 'Pass Accuracy %', home: predictionData.stats.passes?.home || 0, away: predictionData.stats.passes?.away || 0 },
      { subject: 'Form Points', home: predictionData.stats.form?.home || 0, away: predictionData.stats.form?.away || 0 },
      { subject: 'Shots on Target', home: predictionData.stats.shots?.home || 0, away: predictionData.stats.shots?.away || 0 },
      { subject: 'Goals Scored', home: predictionData.stats.goals?.home || 0, away: predictionData.stats.goals?.away || 0 }
    ] : [];

    console.log('PredictionsPage Render:', { 
      matchOptionsCount: matchOptions?.length, 
      predictionData: !!predictionData, 
      historyCount: predictionHistory?.length 
    });

    const sharedCardStyle = {
      marginBottom: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0',
      background: '#ffffff'
    };

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* --- 1. COMMAND CENTER HEADER --- */}
        <div style={{ marginBottom: '32px' }}>
          <Space align="center" style={{ marginBottom: '8px' }}>
            <RadarChartOutlined style={{ fontSize: '32px', color: '#14b8a6' }} />
            <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Predictive Intelligence
            </Title>
          </Space>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Badge status="processing" text={<span style={{ color: '#14b8a6', fontWeight: 'bold' }}>Live Intelligence Feed</span>} />
            <Text type="secondary">|</Text>
            <Text type="secondary" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
              Advanced Neural Processing Layer
            </Text>
          </div>
        </div>

        {error && <Alert message="System Error" description={error} type="error" showIcon style={{ marginBottom: '24px', borderRadius: '8px' }} />}

        {/* --- 2. COMMAND CENTER CONTROLS --- */}
        <Card 
          bordered={false}
          style={{ 
            ...sharedCardStyle, 
            background: '#0f172a',
            borderColor: '#1e293b'
          }}
          styles={{ body: { padding: '24px 32px' } }}
        >
          <Row gutter={[24, 16]} align="bottom">
            <Col xs={24} md={18}>
              <Text style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase' }}>
                Target Fixture Selection
              </Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Select a fixture for analysis..."
                options={matchOptions}
                onChange={setSelectedMatch}
                value={selectedMatch}
                size="large"
                loading={isMatchesLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Col>
            <Col xs={24} md={6}>
              <Button 
                type="primary" 
                size="large" 
                block 
                icon={<ThunderboltOutlined />}
                onClick={handlePredict}
                loading={isPredicting}
                disabled={!selectedMatch}
                style={{ 
                  height: '40px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                {isPredicting ? 'Analyzing...' : 'Execute Analysis'}
              </Button>
            </Col>
          </Row>
        </Card>

        {isPredicting && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="Computing rolling tactical averages..." />
          </div>
        )}

        {predictionData && !isPredicting && (
          <>
            {/* --- 3. HERO BANNER --- */}
            <Card style={sharedCardStyle} bordered={false} styles={{ body: { padding: '32px 24px' } }}>
              <Row align="middle" justify="space-between">
                <Col xs={8} style={{ textAlign: 'right' }}>
                  {predictionData.home_logo && <img src={predictionData.home_logo} width={64} style={{ marginBottom: '12px' }} alt="logo" />}
                  <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{predictionData.home_team}</Title>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <TeamFormGuide formPoints={predictionData.home_form_string} />
                  </div>
                </Col>

                <Col xs={8} style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                  <Text style={{ letterSpacing: '2px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    CORE PREDICTION
                  </Text>
                  <Title level={1} style={{ 
                    margin: '12px 0', 
                    color: predictionData.prediction === 'Home Win' ? COLORS.H : predictionData.prediction === 'Away Win' ? COLORS.A : COLORS.D 
                  }}>
                    {predictionData.prediction?.toUpperCase()}
                  </Title>
                </Col>

                <Col xs={8} style={{ textAlign: 'left' }}>
                  {predictionData.away_logo && <img src={predictionData.away_logo} width={64} style={{ marginBottom: '12px' }} alt="logo" />}
                  <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{predictionData.away_team}</Title>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-start' }}>
                    <TeamFormGuide formPoints={predictionData.away_form_string} />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* --- 4. LINEUPS --- */}
            <Card 
              title={
                <Space>
                  <TeamOutlined style={{ color: '#0f172a' }} />
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Tactical Formations & Lineups</span>
                </Space>
              } 
              bordered={false} 
              style={sharedCardStyle}
            >
              <MatchLineup 
                lineup={predictionData.lineup} 
                homeTeamName={predictionData.home_team} 
                awayTeamName={predictionData.away_team} 
              />
            </Card>

            {/* --- 5. CHARTS GRID --- */}
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Neural Confidence</span>} bordered={false} style={{...sharedCardStyle, height: '420px'}}>
                  <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title={<span style={{ fontWeight: 700, color: '#0f172a' }}>Tactical Performance Matrix</span>} bordered={false} style={{...sharedCardStyle, height: '420px'}}>
                  <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar name={predictionData.home_team} dataKey="home" stroke={COLORS.H} fill={COLORS.H} fillOpacity={0.4} />
                        <Radar name={predictionData.away_team} dataKey="away" stroke={COLORS.A} fill={COLORS.A} fillOpacity={0.4} />
                        <Tooltip />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* --- 6. HISTORY LOGS --- */}
        <Card 
          title={
            <Space>
              <RiseOutlined style={{ color: '#0f172a' }} />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>System Performance Logs</span>
            </Space>
          } 
          bordered={false} 
          style={sharedCardStyle}
        >
          <PredictionHistory history={predictionHistory} />
        </Card>
      </div>
    );
  } catch (err) {
    console.error('PredictionsPage Render Error:', err);
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <Alert
          message="Intelligence Feed Unavailable"
          description={`A critical error occurred while rendering the analysis layer: ${err.message}. Our engineers have been notified.`}
          type="error"
          showIcon
        />
      </div>
    );
  }
};

export default PredictionsPage;
