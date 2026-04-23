import React from 'react';
import { Typography } from 'antd';
import MatchList from './MatchList';

export default function MatchesPage() {
  return (
    <div style={{ paddingTop: '20px' }}>
      {/* We removed the wrapping Card because MatchList already has a beautiful one! */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Typography.Paragraph type="secondary" style={{ fontSize: '16px' }}>
          All scheduled and completed matches are listed below. Data is live from your Django API.
        </Typography.Paragraph>
      </div>
      
      {/* Our self-contained super component does all the fetching and displaying */}
      <MatchList />
    </div>
  );
}