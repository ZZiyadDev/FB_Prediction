import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Typography, Space, message, Tabs, Tag } from 'antd';
import { UserOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { authService } from '../../api';

const { Title, Text } = Typography;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await authService.getUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (actionType) => {
    setActionLoading(true);
    try {
      if (actionType === 'fixtures') {
        await authService.fetchFixtures();
        message.success('Fixtures update started in the background');
      } else if (actionType === 'stats') {
        await authService.fetchStatistics();
        message.success('Statistics update started in the background');
      } else if (actionType === 'lineups') {
        await authService.fetchLineups();
        message.success('Lineups update started in the background');
      }
    } catch (error) {
      message.error('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Role', 
      dataIndex: ['profile', 'role'], 
      key: 'role',
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role}
        </Tag>
      )
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Admin Control Panel</Title>
      
      <Tabs defaultActiveKey="1" items={[
        {
          key: '1',
          label: <span><UserOutlined />User Management</span>,
          children: (
            <Card title="Registered Users" extra={<Button icon={<ReloadOutlined />} onClick={fetchUsers} />}>
              <Table dataSource={users} columns={columns} rowKey="id" loading={loadingUsers} />
            </Card>
          )
        },
        {
          key: '2',
          label: <span><DatabaseOutlined />Data Management</span>,
          children: (
            <Card title="System Data Sync">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>Use these actions to update the database with the latest football data from API-Football.</Text>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<DatabaseOutlined />} 
                    onClick={() => handleAction('fixtures')}
                    loading={actionLoading}
                  >
                    Fetch Latest Fixtures
                  </Button>
                  <Button 
                    icon={<DatabaseOutlined />} 
                    onClick={() => handleAction('stats')}
                    loading={actionLoading}
                  >
                    Fetch Match Statistics
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={() => handleAction('lineups')}
                    loading={actionLoading}
                  >
                    Fetch Match Lineups
                  </Button>
                </Space>
              </Space>
            </Card>
          )
        }
      ]} />
    </div>
  );
};

export default AdminPage;
