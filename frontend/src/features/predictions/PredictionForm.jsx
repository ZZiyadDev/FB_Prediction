import React from 'react';
import { Card, Select, Button, Row, Col } from 'antd';

const PredictionForm = ({ upcomingMatches, onMatchSelect, onPredict, loading }) => {
  return (
    <Card style={{ marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Row gutter={16} align="middle">
        <Col span={18}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select an upcoming match..."
            options={upcomingMatches}
            onChange={onMatchSelect}
            size="large"
          />
        </Col>
        <Col span={6}>
          <Button 
            type="primary" 
            size="large" 
            block 
            onClick={onPredict}
            disabled={loading}
          >
            Ask AI
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PredictionForm;