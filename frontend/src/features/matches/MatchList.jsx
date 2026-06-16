import React, { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Space, Avatar, Card, Typography, Alert, Skeleton, Input, Select, Row, Col } from 'antd';
import useStore from '../../hooks/useStore'; // Ensure this path matches your setup!
import MatchDashboard from './MatchDashboard';
import { useThemeStyles } from '../../hooks/themeStyles';

const { Title, Text } = Typography;
const { Search } = Input;

const MatchList = () => {
  const ts = useThemeStyles();

  // 1. Pull the exact variables from Zustand
  const { rawMatches, isMatchesLoading, fetchUpcomingMatches, error } = useStore();

  const [searchText, setSearchText] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // 2. Call the correct fetch function
  useEffect(() => {
    fetchUpcomingMatches();
  }, [fetchUpcomingMatches]);

  // Derived data for filters
  const leagues = useMemo(() => {
    const uniqueLeagues = Array.from(new Set(rawMatches.map(m => m.league_name).filter(Boolean)));
    return ['All', ...uniqueLeagues];
  }, [rawMatches]);

  // Filtering Logic
  const filteredMatches = useMemo(() => {
    return rawMatches.filter(match => {
      const homeName = match.home_team?.name?.toLowerCase() || '';
      const awayName = match.away_team?.name?.toLowerCase() || '';
      const searchLower = searchText.toLowerCase();
      
      const matchesSearch = homeName.includes(searchLower) || awayName.includes(searchLower);
      const matchesLeague = leagueFilter === 'All' || match.league_name === leagueFilter;
      const matchesStatus = statusFilter === 'All' || 
                           (statusFilter === 'Upcoming' && match.status === 'NS') ||
                           (statusFilter === 'Finished' && match.status !== 'NS');

      return matchesSearch && matchesLeague && matchesStatus;
    });
  }, [rawMatches, searchText, leagueFilter, statusFilter]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'match_date',
      key: 'match_date',
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }) : 'TBD',
    },
    {
      title: 'Home Team',
      key: 'home_team',
      align: 'right',
      render: (_, record) => (
        <Space>
          <span style={{ fontWeight: 500 }}>{record.home_team?.name || 'Unknown'}</span>
          <Avatar src={record.home_team?.logo_url} shape="square" />
        </Space>
      ),
    },
    {
      title: 'Score',
      key: 'score',
      align: 'center',
      render: (_, record) => {
        if (record.status === 'NS') {
          return <Tag color="blue">Upcoming</Tag>;
        }
        return (
          <Tag color="green" style={{ fontSize: '14px', padding: '4px 8px' }}>
            {record.score_home ?? '-'} - {record.score_away ?? '-'}
          </Tag>
        );
      },
    },
    {
      title: 'Away Team',
      key: 'away_team',
      align: 'left',
      render: (_, record) => (
        <Space>
          <Avatar src={record.away_team?.logo_url} shape="square" />
          <span style={{ fontWeight: 500 }}>{record.away_team?.name || 'Unknown'}</span>
        </Space>
      ),
    },
    {
      title: 'League',
      dataIndex: 'league_name', // Ensure your Django serializer actually sends this field!
      key: 'league_name',
      render: (league) => <Tag>{league || 'Unknown'}</Tag>
    },
  ];

  return (
    <Card bordered={false} style={{ boxShadow: ts.cardStyle.boxShadow, background: ts.cardBg, borderColor: ts.cardBorder }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3} style={{ margin: 0, color: ts.textPrimary }}>
          Season Fixtures
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Showing {filteredMatches.length} matches
        </Text>
      </div>

      {/* FILTERS SECTION */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={12}>
          <Search 
            placeholder="Search teams..." 
            allowClear 
            enterButton 
            onSearch={setSearchText} 
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col xs={12} md={6}>
          <Select 
            style={{ width: '100%' }} 
            placeholder="League" 
            value={leagueFilter}
            onChange={setLeagueFilter}
            options={leagues.map(l => ({ label: l, value: l }))}
          />
        </Col>
        <Col xs={12} md={6}>
          <Select 
            style={{ width: '100%' }} 
            placeholder="Status" 
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Status', value: 'All' },
              { label: 'Upcoming', value: 'Upcoming' },
              { label: 'Finished', value: 'Finished' },
            ]}
          />
        </Col>
      </Row>
      
      {error && (
        <Alert
          message="Connection Error"
          description={`Unable to fetch matches: ${error}. Make sure Django is running.`}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      {isMatchesLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Table
          dataSource={filteredMatches}
          columns={columns}
          rowKey="id" 
          pagination={{ pageSize: 10 }} 
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '0 24px 24px 24px' }}>
                <MatchDashboard match={record} />
              </div>
            ),
            rowExpandable: (record) => !!record.lineup || !!record.statistics,
          }}
        />
      )}
    </Card>
  );
};

export default MatchList;