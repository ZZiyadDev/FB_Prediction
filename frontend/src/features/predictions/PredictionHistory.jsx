import React from 'react';
import { Table, Tag, Typography, Avatar, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PredictionHistory = ({ history }) => {
  console.log('PredictionHistory data:', history);

  if (!history || !Array.isArray(history)) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No prediction history available yet.</div>;
  }

  const columns = [
    {
      title: 'Match Date',
      dataIndex: 'match_date',
      key: 'match_date',
      render: (date) => {
        try {
          return date ? new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short'
          }) : 'N/A';
        } catch (e) {
          return 'N/A';
        }
      },
    },
    {
      title: 'Fixture',
      key: 'fixture',
      render: (_, record) => (
        <Space size="middle">
          <div style={{ textAlign: 'right', minWidth: '80px' }}>
            <Text strong>{record?.home_team || 'Unknown'}</Text>
          </div>
          <Avatar src={record?.home_logo} shape="square" size="small" />
          <Text type="secondary">vs</Text>
          <Avatar src={record?.away_logo} shape="square" size="small" />
          <div style={{ textAlign: 'left', minWidth: '80px' }}>
            <Text strong>{record?.away_team || 'Unknown'}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'AI Prediction',
      dataIndex: 'predicted_winner',
      key: 'predicted_winner',
      align: 'center',
      render: (pred) => {
        let color = 'default';
        let label = pred || '?';
        if (pred === 'H') { color = 'cyan'; label = 'Home Win'; }
        if (pred === 'A') { color = 'blue'; label = 'Away Win'; }
        if (pred === 'D') { color = 'purple'; label = 'Draw'; }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Actual Result',
      key: 'actual_result',
      align: 'center',
      render: (_, record) => {
        if (record?.status === 'NS') return <Text type="secondary">-</Text>;
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{record?.score_home ?? '?'} - {record?.score_away ?? '?'}</Text>
            <Tag color="default" style={{ fontSize: '10px' }}>{record?.actual_result || '?'}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'is_correct',
      key: 'is_correct',
      align: 'center',
      render: (isCorrect, record) => {
        if (record?.status === 'NS') {
          return <Tag icon={<ClockCircleOutlined />} color="default">Pending</Tag>;
        }
        if (isCorrect === true) {
          return <Tag icon={<CheckCircleOutlined />} color="success">Correct</Tag>;
        }
        if (isCorrect === false) {
          return <Tag icon={<CloseCircleOutlined />} color="error">Incorrect</Tag>;
        }
        return <Tag color="default">Processing</Tag>;
      },
    },
  ];

  return (
    <Table 
      dataSource={history} 
      columns={columns} 
      rowKey="id"
      pagination={{ pageSize: 5 }}
      size="small"
      bordered={false}
      style={{ marginTop: '24px' }}
    />
  );
};

export default PredictionHistory;
