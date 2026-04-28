import React, { useState, useEffect } from 'react';
import { Typography, Progress, Spin, message, Card } from 'antd';
import { RobotOutlined, TrophyOutlined } from '@ant-design/icons';
import PredictionForm from './PredictionForm';

const { Title, Text } = Typography;

const PredictionsPage = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  
  // New state to hold the real database matches
  const [matchOptions, setMatchOptions] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Fetch real matches from Django on component mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/matches/');
        const data = await response.json();
        
        // Transform the Django data into the format Ant Design's <Select> needs
        const formattedOptions = data.map(match => ({
          value: match.id,
          label: `${match.home_team.name} vs ${match.away_team.name} (${new Date(match.match_date).toLocaleDateString()})`
        }));
        
        setMatchOptions(formattedOptions);
      } catch (error) {
        message.error("Failed to load matches from database.");
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, []);

  const handlePredict = async () => {
    if (!selectedMatch) {
      message.warning("Please select a match first!");
      return;
    }

    setLoading(true);
    setPredictionData(null); 
    
    try {
      const response = await fetch(`http://localhost:8000/api/predictions/${selectedMatch}/predict/`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch prediction');
      
      setPredictionData(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}><RobotOutlined /> AI Match Predictor</Title>
      
      {/* Pass the real matches to the form */}
      <PredictionForm 
        upcomingMatches={matchOptions}
        onMatchSelect={(value) => setSelectedMatch(value)}
        onPredict={handlePredict}
        loading={loading || loadingMatches}
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="Running XGBoost algorithms..." />
        </div>
      )}

      {predictionData && !loading && (
        <Card 
          title={<Text strong style={{ fontSize: '18px' }}>{predictionData.match}</Text>}
          bordered={false}
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Text type="secondary">Most Likely Outcome</Text>
            <Title level={1} style={{ margin: 0, color: '#1890ff' }}>
              <TrophyOutlined /> {
                predictionData.prediction === 'H' ? 'Home Win' : 
                predictionData.prediction === 'A' ? 'Away Win' : 'Draw'
              }
            </Title>
          </div>

          <Title level={5}>Confidence Analysis</Title>
          
          <div style={{ marginBottom: '16px' }}>
            <Text>Home Win</Text>
            <Progress 
              percent={predictionData.confidence_scores.H} 
              status="active" 
              strokeColor="#52c41a" 
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Text>Draw</Text>
            <Progress 
              percent={predictionData.confidence_scores.D} 
              status="active" 
              strokeColor="#faad14" 
            />
          </div>
          
          <div>
            <Text>Away Win</Text>
            <Progress 
              percent={predictionData.confidence_scores.A} 
              status="active" 
              strokeColor="#f5222d" 
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default PredictionsPage;
