import React from 'react';
import { Tag, Space, Tooltip } from 'antd';

const TeamFormGuide = ({ formPoints }) => {
  // formPoints is usually an array of integers (3, 1, 0) representing W, D, L
  // But sometimes it might be a string like 'WWDLL' from API-Football
  
  if (!formPoints) return null;

  const renderFormBadge = (result, index) => {
    let color = 'default';
    let label = '?';
    let title = 'Unknown';

    if (result === 3 || result === 'W') {
      color = 'success';
      label = 'W';
      title = 'Win';
    } else if (result === 1 || result === 'D') {
      color = 'warning';
      label = 'D';
      title = 'Draw';
    } else if (result === 0 || result === 'L') {
      color = 'error';
      label = 'L';
      title = 'Loss';
    }

    return (
      <Tooltip title={title} key={index}>
        <Tag 
          color={color} 
          style={{ 
            margin: '0 2px', 
            fontWeight: 'bold', 
            width: '24px', 
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontSize: '11px',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          {label}
        </Tag>
      </Tooltip>
    );
  };

  const results = typeof formPoints === 'string' ? formPoints.split('') : formPoints;

  return (
    <Space size={0}>
      {Array.isArray(results) && results.map((r, i) => renderFormBadge(r, i))}
    </Space>
  );
};

export default TeamFormGuide;
