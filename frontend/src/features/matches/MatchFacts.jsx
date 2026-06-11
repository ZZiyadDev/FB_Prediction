import React from 'react';
import { Tabs, Empty } from 'antd';
import StatBar from './StatBar';

const MatchFacts = ({ statistics }) => {
  if (!statistics) {
    return <Empty description="No statistics available for this match" />;
  }

  const items = [
    {
      key: '1',
      label: 'Summary',
      children: (
        <div style={{ padding: '20px 0' }}>
          <StatBar 
            label="Possession" 
            homeValue={statistics.home_possession} 
            awayValue={statistics.away_possession} 
            isPercentage={true} 
          />
          <StatBar 
            label="Total Shots" 
            homeValue={statistics.home_total_shots} 
            awayValue={statistics.away_total_shots} 
          />
          <StatBar 
            label="Shots on Target" 
            homeValue={statistics.home_shots_on_target} 
            awayValue={statistics.away_shots_on_target} 
          />
          <StatBar 
            label="Total Passes" 
            homeValue={statistics.home_total_passes} 
            awayValue={statistics.away_total_passes} 
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Attack',
      children: (
        <div style={{ padding: '20px 0' }}>
          <StatBar 
            label="Shots Inside Box" 
            homeValue={statistics.home_shots_inside_box} 
            awayValue={statistics.away_shots_inside_box} 
          />
          <StatBar 
            label="Shots Outside Box" 
            homeValue={statistics.home_shots_outside_box} 
            awayValue={statistics.away_shots_outside_box} 
          />
          <StatBar 
            label="Corners" 
            homeValue={statistics.home_corners} 
            awayValue={statistics.away_corners} 
          />
          <StatBar 
            label="Offsides" 
            homeValue={statistics.home_offsides} 
            awayValue={statistics.away_offsides} 
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Defence',
      children: (
        <div style={{ padding: '20px 0' }}>
          <StatBar 
            label="Blocked Shots" 
            homeValue={statistics.home_blocked_shots} 
            awayValue={statistics.away_blocked_shots} 
          />
          <StatBar 
            label="Goalkeeper Saves" 
            homeValue={statistics.home_goalkeeper_saves} 
            awayValue={statistics.away_goalkeeper_saves} 
          />
          <StatBar 
            label="Fouls" 
            homeValue={statistics.home_fouls} 
            awayValue={statistics.away_fouls} 
          />
          <StatBar 
            label="Yellow Cards" 
            homeValue={statistics.home_yellow_cards} 
            awayValue={statistics.away_yellow_cards} 
          />
          <StatBar 
            label="Red Cards" 
            homeValue={statistics.home_red_cards} 
            awayValue={statistics.away_red_cards} 
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Passing',
      children: (
        <div style={{ padding: '20px 0' }}>
          <StatBar 
            label="Total Passes" 
            homeValue={statistics.home_total_passes} 
            awayValue={statistics.away_total_passes} 
          />
          <StatBar 
            label="Accurate Passes" 
            homeValue={statistics.home_passes_accurate} 
            awayValue={statistics.away_passes_accurate} 
          />
          <StatBar 
            label="Pass Accuracy %" 
            homeValue={statistics.home_passes_percentage} 
            awayValue={statistics.away_passes_percentage} 
            isPercentage={true}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Tabs defaultActiveKey="1" items={items} centered />
    </div>
  );
};

export default MatchFacts;
