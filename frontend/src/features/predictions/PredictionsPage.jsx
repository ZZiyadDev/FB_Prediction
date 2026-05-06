import React, { useEffect } from 'react';
import { Card, Select, Button, Typography, Row, Col, Spin, Alert, Tag, Space } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
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
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0 }}>
          <RobotOutlined style={{ color: '#1890ff', marginRight: '12px' }} /> 
          AI Match Intelligence
        </Title>
        <Text type="secondary">Powered by XGBoost & Deep Tactical Analytics</Text>
      </div>

      {error && <Alert message="System Error" description={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

      <Card bordered={false} style={{ marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} md={18}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select a fixture to analyze..."
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
            >
              Engage AI
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
          {/* HERO PREDICTION CARD */}
          {/* HOME TEAM SIDE */}
<div style={{ textAlign: 'center' }}>
  <Title level={3} style={{ margin: 0 }}>{predictionData.home_team}</Title>
  {/* Inject the Form Guide Here! */}
  {renderFormBadges(predictionData.home_form_string)}
</div>

{/* ... (Score or VS graphic in the middle) ... */}

{/* AWAY TEAM SIDE */}
<div style={{ textAlign: 'center' }}>
  <Title level={3} style={{ margin: 0 }}>{predictionData.away_team}</Title>
  {/* Inject the Form Guide Here! */}
  {renderFormBadges(predictionData.away_form_string)}
</div>

          {/* SPLIT VIEW: DONUT CHART & RADAR CHART */}
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Card title="Algorithm Confidence" bordered={false} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                
                {/* FIX: Add this explicit height wrapper */}
                <div style={{ height: '350px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name} (${value}%)`}
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Tale of the Tape (Tactical Profile)" bordered={false} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                
                {/* FIX: Add this explicit height wrapper */}
                <div style={{ height: '350px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" style={{ fontSize: '12px' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      
                      {/* Home Team Polygon */}
                      <Radar 
                        name={predictionData.home_team} 
                        dataKey="home" 
                        stroke={COLORS.H} 
                        fill={COLORS.H} 
                        fillOpacity={0.5} 
                      />
                      
                      {/* Away Team Polygon */}
                      <Radar 
                        name={predictionData.away_team} 
                        dataKey="away" 
                        stroke={COLORS.A} 
                        fill={COLORS.A} 
                        fillOpacity={0.5} 
                      />
                      
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