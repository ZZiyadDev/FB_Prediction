import React from 'react';
import { Tabs, Card, Space, Avatar, Typography } from 'antd';
import MatchFacts from './MatchFacts';
import MatchLineup from './MatchLineup';
import TeamFormGuide from './TeamFormGuide';

const { Title, Text } = Typography;

const MatchDashboard = ({ match }) => {
  const items = [
    {
      key: 'facts',
      label: 'Match Facts',
      children: <MatchFacts statistics={match.statistics} />,
    },
    {
      key: 'lineup',
      label: 'Lineups',
      children: (
        <MatchLineup 
          lineup={match.lineup} 
          homeTeamName={match.home_team?.name} 
          awayTeamName={match.away_team?.name} 
        />
      ),
    },
  ];

  return (
    <Card 
      bordered={false} 
      style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      {/* Dashboard Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '20px',
        background: 'linear-gradient(135deg, #fff 0%, #f0fdfa 100%)', // Light teal tint
        borderRadius: '8px'
      }}>
        <Space size={32} align="center">
          <div style={{ textAlign: 'center' }}>
            <Avatar size={64} src={match.home_team?.logo_url} shape="square" />
            <Text strong style={{ display: 'block', marginTop: '8px', fontSize: '14px' }}>
              {match.home_team?.name}
            </Text>
            <div style={{ marginTop: '8px' }}>
              <TeamFormGuide formPoints={match.home_form_points} />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, color: '#14b8a6' }}>
              {match.score_home ?? '-'} : {match.score_away ?? '-'}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {match.status === 'NS' ? 'Upcoming' : 'Final Result'}
            </Text>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Avatar size={64} src={match.away_team?.logo_url} shape="square" />
            <Text strong style={{ display: 'block', marginTop: '8px', fontSize: '14px' }}>
              {match.away_team?.name}
            </Text>
            <div style={{ marginTop: '8px' }}>
              <TeamFormGuide formPoints={match.away_form_points} />
            </div>
          </div>
        </Space>
      </div>

      {/* Content Tabs */}
      <Tabs 
        defaultActiveKey="facts" 
        items={items} 
        type="card" 
        className="match-dashboard-tabs"
        tabBarStyle={{ marginBottom: '24px' }}
      />
    </Card>
  );
};

export default MatchDashboard;
