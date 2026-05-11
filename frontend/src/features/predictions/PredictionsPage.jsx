import React, { useEffect } from 'react';
import { Card, Select, Button, Typography, Row, Col, Spin, Alert, Tag, Space, Badge } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { RadarChartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import useStore from '../../hooks/useStore';

const { Title, Text } = Typography;

// ... the rest of your component starts here ...

const COLORS = { H: '#52c41a', D: '#faad14', A: '#f5222d' };

const PredictionsPage = () => {
  const { 
    matchOptions, 
    selectedMatch, 
    predictionData, 
    isMatchesLoading, 
    isPredicting, 
    error,
    setSelectedMatch, 
    fetchUpcomingMatches, 
    runAiPrediction 
  } = useStore();

  useEffect(() => {
    fetchUpcomingMatches();
  }, [fetchUpcomingMatches]);

  const handlePredict = () => {
    if (selectedMatch) runAiPrediction(selectedMatch);
  };

  // Dynamically inject the actual team names instead of "Home" / "Away"
  const donutData = predictionData ? [
    { name: `${predictionData.home_team} Win`, value: predictionData.confidence_scores.H, color: COLORS.H },
    { name: 'Draw', value: predictionData.confidence_scores.D, color: COLORS.D },
    { name: `${predictionData.away_team} Win`, value: predictionData.confidence_scores.A, color: COLORS.A },
  ] : [];

  // 2. MAP THE DJANGO STATS TO THE RADAR CHART
  const radarData = predictionData ? [
    { subject: 'Possession %', home: predictionData.stats.possession.home, away: predictionData.stats.possession.away },
    { subject: 'Pass Accuracy %', home: predictionData.stats.passes.home, away: predictionData.stats.passes.away },
    { subject: 'Form Points', home: predictionData.stats.form.home, away: predictionData.stats.form.away },
    { subject: 'Shots on Target', home: predictionData.stats.shots.home, away: predictionData.stats.shots.away },
    { subject: 'Goals Scored', home: predictionData.stats.goals.home, away: predictionData.stats.goals.away }
  ] : [];

  // --- FORM GUIDE HELPER ---
  const renderFormBadges = (formString) => {
    // If the backend hasn't sent the form string yet, return a graceful fallback
    if (!formString || typeof formString !== 'string') {
      return <Text type="secondary" style={{ fontSize: '12px' }}>No form data</Text>;
    }

    return (
      <Space size={[0, 8]} wrap style={{ marginTop: '8px' }}>
        {formString.split('').map((result, index) => {
          let color = 'default';
          if (result === 'W') color = 'success'; // Ant Design Green
          if (result === 'D') color = 'warning'; // Ant Design Orange
          if (result === 'L') color = 'error';   // Ant Design Red
          
          return (
            <Tag 
              color={color} 
              key={index} 
              style={{ margin: '0 2px', fontWeight: 'bold', width: '24px', textAlign: 'center' }}
            >
              {result}
            </Tag>
          );
        })}
      </Space>
    );
  };
  
  // --- UNIFIED STYLING VARIABLE ---
  // We apply this to EVERY card so the app looks perfectly cohesive
  const sharedCardStyle = {
    marginBottom: '24px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f0f0f0',
    background: '#ffffff'
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* --- 1. COMMAND CENTER HEADER --- */}
      <div style={{ marginBottom: '32px' }}>
        <Space align="center" style={{ marginBottom: '8px' }}>
          <RadarChartOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
          <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Match Intelligence Matrix
          </Title>
        </Space>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge status="processing" text={<span style={{ color: '#52c41a', fontWeight: 'bold' }}>Live Data Sync</span>} />
          <Text type="secondary">|</Text>
          <Text type="secondary" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>
            Powered by XGBoost & Deep Tactical Analytics
          </Text>
        </div>
      </div>

      {error && <Alert message="System Error" description={error} type="error" showIcon style={{ marginBottom: '24px', borderRadius: '8px' }} />}

      {/* --- 2. COMMAND CENTER CONTROLS --- */}
      <Card 
        bordered={false}
        style={{ 
          ...sharedCardStyle, 
          background: 'linear-gradient(145deg, #ffffff 0%, #f0f5ff 100%)', // Subtle premium gradient for the main control
          borderColor: '#d6e4ff'
        }}
        styles={{ body: { padding: '24px 32px' } }}
      >
        <Row gutter={[24, 16]} align="bottom">
          <Col xs={24} md={18}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
              SELECT TARGET FIXTURE
            </Text>
            <Select
              style={{ width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              placeholder="Search for a Premier League or La Liga fixture..."
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
                background: selectedMatch ? 'linear-gradient(135deg, #1677ff 0%, #531dab 100%)' : '#d9d9d9',
                border: 'none',
                height: '40px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: selectedMatch ? '0 4px 14px 0 rgba(22,119,255,0.39)' : 'none',
                borderRadius: '8px'
              }}
            >
              {isPredicting ? 'Analyzing...' : 'Engage AI'}
            </Button>
          </Col>
        </Row>
      </Card>

      {isPredicting && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Calculating rolling averages and executing AI pipeline..." />
        </div>
      )}

      {predictionData && !isPredicting && (
        <>
          {/* --- 3. PREMIUM HERO BANNER --- */}
          <Card style={sharedCardStyle} bordered={false} styles={{ body: { padding: '32px 24px' } }}>
            <Row align="middle" justify="space-between">
              {/* HOME TEAM */}
              <Col xs={8} style={{ textAlign: 'right' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{predictionData.home_team}</Title>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                  {renderFormBadges(predictionData.home_form_string)}
                </div>
              </Col>

              {/* AI PREDICTION CENTER */}
              <Col xs={8} style={{ textAlign: 'center', borderLeft: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ letterSpacing: '2px', fontSize: '12px', fontWeight: 'bold' }}>
                  AI PREDICTION
                </Text>
                <Title level={1} style={{ 
                  margin: '8px 0', 
                  color: predictionData.prediction === 'Home Win' ? COLORS.H : predictionData.prediction === 'Away Win' ? COLORS.A : COLORS.D 
                }}>
                  {predictionData.prediction.toUpperCase()}
                </Title>
              </Col>

              {/* AWAY TEAM */}
              <Col xs={8} style={{ textAlign: 'left' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{predictionData.away_team}</Title>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-start' }}>
                  {renderFormBadges(predictionData.away_form_string)}
                </div>
              </Col>
            </Row>
          </Card>

          {/* --- 4. FULL ODDS BREAKDOWN --- */}
          <Card title={<span style={{ fontWeight: 'bold' }}>Full Odds Breakdown</span>} bordered={false} style={sharedCardStyle}>
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f6ffed', borderRadius: '12px', border: '1px solid #b7eb8f' }}>
                  <Text style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>HOME WIN</Text>
                  <Title level={2} style={{ margin: '8px 0', color: COLORS.H }}>{predictionData.confidence_scores.H}%</Title>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#fffbe6', borderRadius: '12px', border: '1px solid #ffe58f' }}>
                  <Text style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>DRAW</Text>
                  <Title level={2} style={{ margin: '8px 0', color: COLORS.D }}>{predictionData.confidence_scores.D}%</Title>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#fff1f0', borderRadius: '12px', border: '1px solid #ffa39e' }}>
                  <Text style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>AWAY WIN</Text>
                  <Title level={2} style={{ margin: '8px 0', color: COLORS.A }}>{predictionData.confidence_scores.A}%</Title>
                </div>
              </Col>
            </Row>
          </Card>

          {/* --- 5. CHARTS GRID --- */}
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Card title={<span style={{ fontWeight: 'bold' }}>Algorithm Confidence</span>} bordered={false} style={{...sharedCardStyle, height: '420px'}}>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name} (${value}%)`}
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
              <Card title={<span style={{ fontWeight: 'bold' }}>Tale of the Tape (Tactical Profile)</span>} bordered={false} style={{...sharedCardStyle, height: '420px'}}>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" style={{ fontSize: '12px' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar name={predictionData.home_team} dataKey="home" stroke={COLORS.H} fill={COLORS.H} fillOpacity={0.5} />
                      <Radar name={predictionData.away_team} dataKey="away" stroke={COLORS.A} fill={COLORS.A} fillOpacity={0.5} />
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
    </div>
  );
};

export default PredictionsPage;