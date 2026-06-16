import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Space, Typography, Button, Select, Spin, Alert, Tabs, Badge, Avatar, Divider, Tag } from 'antd';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  ThunderboltOutlined, 
  TeamOutlined, 
  DashboardOutlined, 
  RiseOutlined, 
  RadarChartOutlined, 
  DeploymentUnitOutlined, 
  HistoryOutlined,
  BarChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import useStore from '../../hooks/useStore';
import DashboardCard from './DashboardCard';
import MatchLineup from '../matches/MatchLineup';
import MatchFacts from '../matches/MatchFacts';
import PredictionHistory from '../predictions/PredictionHistory';
import TeamFormGuide from '../matches/TeamFormGuide';
import { useThemeStyles } from '../../hooks/themeStyles';

const { Title, Text } = Typography;

const COLORS = { H: '#14b8a6', D: '#94a3b8', A: '#3b82f6' };

export default function DashboardPage() {
  const ts = useThemeStyles();
  const navigate = useNavigate();
  const { 
    rawMatches, 
    matchOptions, 
    selectedMatch, 
    predictionData, 
    accuracyMetrics,
    predictionHistory,
    isMatchesLoading, 
    isPredicting, 
    fetchUpcomingMatches, 
    runAiPrediction, 
    setSelectedMatch,
    fetchAccuracy,
    fetchPredictionHistory,
    error
  } = useStore();

  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchUpcomingMatches();
    fetchAccuracy();
    fetchPredictionHistory();
  }, [fetchUpcomingMatches, fetchAccuracy, fetchPredictionHistory]);

  // 2. Auto-select logic
  useEffect(() => {
    if (rawMatches.length > 0 && !hasAutoSelected && !selectedMatch) {
      const randomIndex = Math.floor(Math.random() * rawMatches.length);
      const randomMatchId = rawMatches[randomIndex].id;
      setSelectedMatch(randomMatchId);
      runAiPrediction(randomMatchId);
      setHasAutoSelected(true);
    }
  }, [rawMatches, hasAutoSelected, selectedMatch, setSelectedMatch, runAiPrediction]);

  const handleMatchChange = (value) => {
    setSelectedMatch(value);
    if (value) {
      runAiPrediction(value);
    }
  };

  // --- DATA MAPPING FOR CHARTS ---
  const matchesData = (predictionData && predictionData.stats) ? [
    { name: 'Possession', home: predictionData.stats.possession?.home || 0, away: predictionData.stats.possession?.away || 0 },
    { name: 'Passes (%)', home: predictionData.stats.passes?.home || 0, away: predictionData.stats.passes?.away || 0 },
    { name: 'Shots', home: predictionData.stats.shots?.home || 0, away: predictionData.stats.shots?.away || 0 },
    { name: 'Goals', home: predictionData.stats.goals?.home || 0, away: predictionData.stats.goals?.away || 0 }
  ] : [];

  const donutData = (predictionData && predictionData.confidence_scores) ? [
    { name: 'Home Win', value: predictionData.confidence_scores.H || 0, color: COLORS.H },
    { name: 'Draw', value: predictionData.confidence_scores.D || 0, color: COLORS.D },
    { name: 'Away Win', value: predictionData.confidence_scores.A || 0, color: COLORS.A },
  ] : [];

  const radarData = (predictionData && predictionData.stats) ? [
    { subject: 'Possession %', home: predictionData.stats.possession?.home || 0, away: predictionData.stats.possession?.away || 0 },
    { subject: 'Pass Accuracy %', home: predictionData.stats.passes?.home || 0, away: predictionData.stats.passes?.away || 0 },
    { subject: 'Form Points', home: predictionData.stats.form?.home || 0, away: predictionData.stats.form?.away || 0 },
    { subject: 'Shots on Target', home: predictionData.stats.shots?.home || 0, away: predictionData.stats.shots?.away || 0 },
    { subject: 'Goals Scored', home: predictionData.stats.goals?.home || 0, away: predictionData.stats.goals?.away || 0 }
  ] : [];

  const topConfidence = predictionData 
    ? Math.max(predictionData.confidence_scores.H, predictionData.confidence_scores.D, predictionData.confidence_scores.A)
    : 0;

  const nextMatchText = predictionData 
    ? `${predictionData.home_team} vs ${predictionData.away_team}`
    : 'Select Match';

  // --- TABS CONFIGURATION ---
  const detailTabs = [
    {
      key: 'pitch',
      label: <Space><DeploymentUnitOutlined />Tactical Pitch</Space>,
      children: (
        <div style={{ marginTop: '16px' }}>
          <MatchLineup 
            lineup={predictionData?.lineup} 
            homeTeamName={predictionData?.home_team} 
            awayTeamName={predictionData?.away_team} 
          />
        </div>
      ),
    },
    {
      key: 'facts',
      label: <Space><BarChartOutlined />Match Facts</Space>,
      children: (
        <div style={{ marginTop: '16px' }}>
          <MatchFacts statistics={predictionData?.raw_stats} /> 
        </div>
      ),
    },
  ];

  const isFinished = predictionData?.status === 'FT';
  const isCorrect = predictionData?.is_correct;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '32px' }}>
        <Space align="center" style={{ marginBottom: '8px' }}>
          <RadarChartOutlined style={{ fontSize: '32px', color: '#14b8a6' }} />
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: ts.textPrimary, letterSpacing: '-0.5px' }}>
            Intelligence Command Center
          </Title>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge status="processing" text={<span style={{ color: '#14b8a6', fontWeight: 'bold' }}>Live Analysis Engine</span>} />
          <Text type="secondary">|</Text>
          <Text type="secondary" style={{ letterSpacing: '1px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: ts.textSecondary }}>
            Centralized Tactical & Predictive Data
          </Text>
        </div>
      </div>

      {error && <Alert message="Connection Error" description={error} type="error" showIcon style={{ marginBottom: '24px', borderRadius: '8px' }} />}

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* COMMAND CONTROLS */}
        <Card bordered={false} style={ts.commandBarStyle} styles={{ body: { padding: '24px 32px' } }}>
          <Row gutter={[24, 16]} align="bottom">
            <Col xs={24} md={18}>
              <Text style={{ display: 'block', marginBottom: '8px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: ts.textMuted, textTransform: 'uppercase' }}>
                Active Target Selection
              </Text>
              <Select
                style={{ width: '100%' }}
                placeholder="Choose a fixture for immediate analysis..."
                options={matchOptions}
                onChange={handleMatchChange}
                value={selectedMatch}
                size="large"
                loading={isMatchesLoading}
                showSearch
              />
            </Col>
            <Col xs={24} md={6}>
              <Button type="primary" size="large" block icon={<TeamOutlined />} onClick={() => navigate('/matches')} style={{ borderRadius: '8px' }}>
                Fixture Database
              </Button>
            </Col>
          </Row>
        </Card>

        {isPredicting ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" tip="Synthesizing tactical data..." />
          </div>
        ) : (
          <>
            {/* STAT CARDS */}
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard title="Analysis Target" value={nextMatchText} icon={<TeamOutlined />} />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard title="AI Confidence" value={predictionData ? `${topConfidence}%` : 'N/A'} icon={<ThunderboltOutlined />} gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard title="System Accuracy" value={accuracyMetrics ? `${accuracyMetrics.accuracy_percentage}%` : '0%'} icon={<RiseOutlined />} gradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <DashboardCard title="Data Pool" value={rawMatches.length > 0 ? `${rawMatches.length} Matches` : '0'} icon={<DashboardOutlined />} />
              </Col>
            </Row>

            {predictionData && (
              <>
                {/* HERO VERDICT */}
                <Card style={ts.cardStyle} bordered={false} styles={{ body: { padding: '32px 24px' } }}>
                  <Row align="middle" justify="space-between">
                    <Col xs={8} style={{ textAlign: 'right' }}>
                      {predictionData.home_logo && <Avatar src={predictionData.home_logo} size={64} shape="square" style={{ marginBottom: '12px' }} />}
                      <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{predictionData.home_team}</Title>
                      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                        <TeamFormGuide formPoints={predictionData.home_form_string} />
                      </div>
                    </Col>
                    <Col xs={8} style={{ textAlign: 'center', borderLeft: `1px solid ${ts.dividerColor}`, borderRight: `1px solid ${ts.dividerColor}` }}>
                      <Text style={{ letterSpacing: '2px', fontSize: '11px', fontWeight: 700, color: ts.textSecondary, textTransform: 'uppercase' }}>CORE PREDICTION</Text>
                      <Title level={1} style={{ margin: '12px 0', color: predictionData.prediction === 'Home Win' ? COLORS.H : predictionData.prediction === 'Away Win' ? COLORS.A : COLORS.D }}>
                        {predictionData.prediction?.toUpperCase()}
                      </Title>
                      
                      {isFinished && (
                        <div style={{ marginBottom: '16px' }}>
                          <Divider style={{ margin: '12px 0' }} />
                          <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Actual Result</Text>
                          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                            {predictionData.score_home} - {predictionData.score_away}
                          </Title>
                          <Tag 
                            color={isCorrect ? 'success' : 'error'} 
                            icon={isCorrect ? <CheckCircleOutlined /> : <HistoryOutlined />}
                            style={{ marginTop: '8px', borderRadius: '4px', padding: '2px 12px', fontWeight: 700 }}
                          >
                            {isCorrect ? 'VERIFIED CORRECT' : 'INCORRECT'}
                          </Tag>
                        </div>
                      )}

                      {/* NEW: H2H INDICATOR */}
                      <div style={{ marginTop: '16px', borderTop: ts.dashedBorder, paddingTop: '12px' }}>
                         <Text type="secondary" style={{ fontSize: '10px', textTransform: 'uppercase' }}>H2H Advantage</Text>
                         <div style={{ fontWeight: 700, color: ts.textPrimary }}>
                            {predictionData.stats?.h2h_pts > 7 ? 'Significant Home Bias' : 
                             predictionData.stats?.h2h_pts < 3 ? 'Significant Away Bias' : 'Neutral History'}
                         </div>
                      </div>
                    </Col>
                    <Col xs={8} style={{ textAlign: 'left' }}>
                      {predictionData.away_logo && <Avatar src={predictionData.away_logo} size={64} shape="square" style={{ marginBottom: '12px' }} />}
                      <Title level={2} style={{ margin: 0, fontWeight: 700 }}>{predictionData.away_team}</Title>
                      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-start' }}>
                        <TeamFormGuide formPoints={predictionData.away_form_string} />
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* VISUALIZATIONS ROW 1 */}
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title={<span style={{ fontWeight: 700 }}>Neural Probability Distribution</span>} bordered={false} style={{...ts.cardStyle, height: '420px'}}>
                      <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={donutData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
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
                    <Card title={<span style={{ fontWeight: 700 }}>Tactical Matrix Comparison</span>} bordered={false} style={{...ts.cardStyle, height: '420px'}}>
                      <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke={ts.dividerColor} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: ts.textSecondary, fontSize: 12 }} />
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

                {/* RESTORED VISUALIZATIONS ROW 2 */}
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title={<span style={{ fontWeight: 700 }}>Historical Performance Trend</span>} bordered={false} style={{...ts.cardStyle, height: '380px'}}>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={matchesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: ts.textMuted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: ts.textMuted, fontSize: 12 }} />
                          <Tooltip contentStyle={ts.chartTooltipStyle} />
                          <Legend iconType="circle" />
                          <Line type="monotone" name={predictionData.home_team} dataKey="home" stroke={COLORS.H} strokeWidth={3} dot={{ r: 4, fill: COLORS.H }} />
                          <Line type="monotone" name={predictionData.away_team} dataKey="away" stroke={COLORS.A} strokeWidth={3} dot={{ r: 4, fill: COLORS.A }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title={<span style={{ fontWeight: 700 }}>Condition & Fatigue Assessment</span>} bordered={false} style={{...ts.cardStyle, height: '380px'}}>
                       <div style={{ padding: '20px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>DAYS SINCE LAST MATCH (Higher is more rested)</Text>
                          <div style={{ marginTop: '32px' }}>
                             <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                   <Text strong>{predictionData.home_team}</Text>
                                   <Text>{predictionData.stats?.fatigue?.home} Days</Text>
                                </div>
                                <div style={{ height: '8px', background: ts.statBarTrack, borderRadius: '4px', overflow: 'hidden' }}>
                                   <div style={{ 
                                      width: `${Math.min((predictionData.stats?.fatigue?.home / 14) * 100, 100)}%`, 
                                      height: '100%', 
                                      background: COLORS.H,
                                      transition: 'width 1s ease-in-out'
                                   }} />
                                </div>
                             </div>
                             <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                   <Text strong>{predictionData.away_team}</Text>
                                   <Text>{predictionData.stats?.fatigue?.away} Days</Text>
                                </div>
                                <div style={{ height: '8px', background: ts.statBarTrack, borderRadius: '4px', overflow: 'hidden' }}>
                                   <div style={{ 
                                      width: `${Math.min((predictionData.stats?.fatigue?.away / 14) * 100, 100)}%`, 
                                      height: '100%', 
                                      background: COLORS.A,
                                      transition: 'width 1s ease-in-out'
                                   }} />
                                </div>
                             </div>
                          </div>
                          <Text type="secondary" style={{ display: 'block', marginTop: '40px', fontSize: '11px', fontStyle: 'italic' }}>
                             * fatigue level is a critical weight in the AI's neural processing layer.
                          </Text>
                       </div>
                    </Card>
                  </Col>
                </Row>

                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card title={<span style={{ fontWeight: 700 }}>Strategic Data Metrics Comparison</span>} bordered={false} style={ts.cardStyle}>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={matchesData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}> 
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: ts.textMuted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: ts.textMuted, fontSize: 12 }} />
                          <Tooltip contentStyle={ts.chartTooltipStyle} />
                          <Legend iconType="circle" />
                          <Bar name={predictionData.home_team} dataKey="home" fill={COLORS.H} radius={[4, 4, 0, 0]} barSize={32} />
                          <Bar name={predictionData.away_team} dataKey="away" fill={COLORS.A} radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>

                {/* INTERACTIVE DETAILS TABS */}
                <Card bordered={false} style={ts.cardStyle} styles={{ body: { padding: '16px 24px' } }}>
                  <Tabs defaultActiveKey="pitch" items={detailTabs} size="large" />
                </Card>
              </>
            )}
          </>
        )}
      </Space>
    </div>
  );
}
