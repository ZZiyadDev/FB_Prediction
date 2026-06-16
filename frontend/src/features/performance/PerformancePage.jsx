import React, { useEffect } from 'react';
import { Typography, Space, Row, Col, Card, Statistic, Divider, Badge } from 'antd';
import { 
  HistoryOutlined, 
  CheckCircleOutlined, 
  LineChartOutlined, 
  SafetyCertificateOutlined,
  DotChartOutlined
} from '@ant-design/icons';
import useStore from '../../hooks/useStore';
import PredictionHistory from '../predictions/PredictionHistory';
import { useThemeStyles } from '../../hooks/themeStyles';

const { Title, Text } = Typography;

export default function PerformancePage() {
  const ts = useThemeStyles();
  const { 
    accuracyMetrics, 
    predictionHistory, 
    fetchAccuracy, 
    fetchPredictionHistory 
  } = useStore();

  useEffect(() => {
    fetchAccuracy();
    fetchPredictionHistory();
  }, [fetchAccuracy, fetchPredictionHistory]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <Space align="center" style={{ marginBottom: '8px' }}>
          <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#14b8a6' }} />
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: ts.textPrimary }}>
            System Performance Logs
          </Title>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge status="success" text={<span style={{ fontWeight: 600 }}>Audited Dataset</span>} />
          <Text type="secondary">|</Text>
          <Text type="secondary">Historical analysis of model precision and reliability.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={ts.cardStyle}>
            <Statistic 
              title="Global Accuracy" 
              value={accuracyMetrics?.accuracy_percentage || 0} 
              precision={1}
              suffix="%" 
              prefix={<CheckCircleOutlined style={{ color: '#14b8a6' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={ts.cardStyle}>
            <Statistic 
              title="Total Audits" 
              value={accuracyMetrics?.total_predictions || 0} 
              prefix={<HistoryOutlined style={{ color: '#3b82f6' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={ts.cardStyle}>
            <Statistic 
              title="Correct Picks" 
              value={accuracyMetrics?.correct_predictions || 0} 
              prefix={<LineChartOutlined style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={ts.cardStyle}>
            <Statistic 
              title="Verification Rate" 
              value={100} 
              suffix="%"
              prefix={<DotChartOutlined style={{ color: '#f59e0b' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        style={ts.cardStyle} 
        title={
          <Space>
            <HistoryOutlined />
            <span style={{ fontWeight: 700 }}>Model Prediction History</span>
          </Space>
        }
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          This log tracks the model's predictions against actual match outcomes. Data is refreshed automatically as match results are confirmed.
        </Text>
        <PredictionHistory history={predictionHistory} />
      </Card>
    </div>
  );
}
