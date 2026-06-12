import React, { useState } from 'react';
import { Card, Row, Col, List, Avatar, Divider, Tag, Empty, Space, Segmented } from 'antd';
import { UserOutlined, TableOutlined, AimOutlined } from '@ant-design/icons';
import SoccerLineUp from '@chris-baur/react-soccer-lineup';

const PlayerItem = ({ player, side }) => {
  const [imgError, setImgError] = useState(false);
  const photoUrl = player?.id ? `https://media.api-sports.io/football/players/${player.id}.png` : null;

  return (
    <List.Item style={{ border: 'none', padding: '4px 0', flexDirection: side === 'right' ? 'row-reverse' : 'row' }}>
      <Space style={{ flexDirection: side === 'right' ? 'row-reverse' : 'row', width: '100%', justifyContent: side === 'right' ? 'flex-start' : 'flex-start' }}>
        <Avatar 
          size="large" 
          src={!imgError && photoUrl ? photoUrl : null}
          onError={() => { setImgError(true); return false; }}
          style={{ 
            backgroundColor: side === 'right' ? '#3b82f6' : '#14b8a6',
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {imgError || !photoUrl ? (player.number || <UserOutlined />) : null}
        </Avatar>
        <div style={{ textAlign: side === 'right' ? 'right' : 'left' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{player.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: side === 'right' ? 'flex-end' : 'flex-start' }}>
            <span style={{ fontWeight: 700, color: side === 'right' ? '#3b82f6' : '#14b8a6' }}>{player.number}</span> 
            <span>•</span> 
            <span>{player.pos}</span>
          </div>
        </div>
      </Space>
    </List.Item>
  );
};

const LineupSection = ({ teamName, formation, players, substitutes, side }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexDirection: side === 'right' ? 'row-reverse' : 'row' }}>
      <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>{teamName}</h4>
      <Tag color="default" style={{ fontWeight: 600 }}>{formation}</Tag>
    </div>
    
    <Divider orientation={side === 'right' ? 'right' : 'left'} style={{ margin: '12px 0', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
      Starting XI
    </Divider>
    <List
      dataSource={players}
      renderItem={(player) => <PlayerItem player={player} side={side} />}
    />

    <Divider orientation={side === 'right' ? 'right' : 'left'} style={{ margin: '24px 0 12px 0', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
      Substitutes
    </Divider>
    <List
      dataSource={substitutes}
      renderItem={(player) => (
        <div style={{ 
          fontSize: '12px', 
          color: '#64748b', 
          padding: '2px 0', 
          textAlign: side === 'right' ? 'right' : 'left' 
        }}>
          {player.name} <span style={{ opacity: 0.6, fontSize: '10px' }}>({player.pos})</span>
        </div>
      )}
    />
  </div>
);

// --- UTILITY TO MAP API DATA TO SOCCER LINEUP FORMAT ---
const mapSquad = (players) => {
  if (!players || !Array.isArray(players)) return {};
  
  const squad = {
    gk: null,
    df: [],
    cm: [],
    fw: []
  };

  players.forEach(p => {
    const playerObj = {
      name: p.name,
      number: p.number
    };

    if (p.pos === 'G') squad.gk = playerObj;
    else if (p.pos === 'D') squad.df.push(playerObj);
    else if (p.pos === 'M') squad.cm.push(playerObj);
    else if (p.pos === 'F') squad.fw.push(playerObj);
  });

  return squad;
};

const MatchLineup = ({ lineup, homeTeamName, awayTeamName }) => {
  const [viewMode, setViewViewMode] = useState('Pitch');

  if (!lineup) return <Empty description="Lineup data not yet available for this match." image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  const homeSquad = mapSquad(lineup.home_xi);
  const awaySquad = mapSquad(lineup.away_xi);

  return (
    <Card 
      bordered={false} 
      style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}
      title={
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '8px 0' }}>
          <Segmented
            value={viewMode}
            onChange={setViewViewMode}
            options={[
              { label: 'Tactical Pitch', value: 'Pitch', icon: <AimOutlined /> },
              { label: 'Starting List', value: 'List', icon: <TableOutlined /> },
            ]}
          />
        </div>
      }
    >
      {viewMode === 'Pitch' ? (
        <div style={{ width: '100%', minHeight: '500px', padding: '20px 0' }}>
          <SoccerLineUp
            size="responsive"
            color="#14b8a6"
            pattern="lines"
            homeTeam={{
              name: homeTeamName,
              squad: homeSquad,
              style: {
                color: '#0f172a', // Navy
                numberColor: '#ffffff',
                nameColor: '#0f172a'
              }
            }}
            awayTeam={{
              name: awayTeamName,
              squad: awaySquad,
              style: {
                color: '#3b82f6', // Blue
                numberColor: '#ffffff',
                nameColor: '#3b82f6'
              }
            }}
          />
          
          <Divider style={{ margin: '32px 0 16px 0', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Match Reserves
          </Divider>
          <Row gutter={24}>
            <Col span={12}>
               <div style={{ fontWeight: 700, fontSize: '10px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>{homeTeamName} SUBS</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {lineup.home_substitutes?.map(p => <Tag key={p.id || p.name} style={{ fontSize: '11px', borderRadius: '4px' }}>{p.name}</Tag>)}
               </div>
            </Col>
            <Col span={12} style={{ borderLeft: '1px dashed #e2e8f0' }}>
               <div style={{ fontWeight: 700, fontSize: '10px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>{awayTeamName} SUBS</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {lineup.away_substitutes?.map(p => <Tag key={p.id || p.name} style={{ fontSize: '11px', borderRadius: '4px' }}>{p.name}</Tag>)}
               </div>
            </Col>
          </Row>
        </div>
      ) : (
        <Row gutter={48}>
          <Col span={12}>
            <LineupSection 
              teamName={homeTeamName} 
              formation={lineup.home_formation} 
              players={lineup.home_xi} 
              substitutes={lineup.home_substitutes}
              side="left"
            />
          </Col>
          <Col span={12} style={{ borderLeft: '1px dashed #e2e8f0' }}>
            <LineupSection 
              teamName={awayTeamName} 
              formation={lineup.away_formation} 
              players={lineup.away_xi} 
              substitutes={lineup.away_substitutes}
              side="right"
            />
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default MatchLineup;
