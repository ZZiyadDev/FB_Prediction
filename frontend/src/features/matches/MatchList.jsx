import React, { useEffect } from 'react';
import { Table, Tag, Space, Avatar, Card, Typography } from 'antd';
import useStore from '../../hooks/useStore'; // Ensure this path matches your setup!

const { Title } = Typography;

const MatchList = () => {
  const { matches, loading, loadMatches } = useStore();

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

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
      dataIndex: 'league_name',
      key: 'league_name',
      render: (league) => <Tag>{league || 'Unknown'}</Tag>
    },
  ];

  return (
    <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Title level={3} style={{ marginTop: 0, marginBottom: '24px' }}>
        Season Fixtures
      </Title>
      <Table
        dataSource={matches}
        columns={columns}
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }} 
      />
    </Card>
  );
};

export default MatchList;