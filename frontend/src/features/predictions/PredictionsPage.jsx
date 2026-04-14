import { useEffect } from 'react'
import { Card, List, Typography } from 'antd'
import useStore from '../../hooks/useStore'
import PredictionForm from './PredictionForm'

export default function PredictionsPage() {
  const { predictions, loadPredictions, loading } = useStore()

  useEffect(() => {
    loadPredictions()
  }, [loadPredictions])

  return (
    <Card title="Predictions" loading={loading}>
      <Typography.Paragraph>
        Create a prediction and review the AI confidence score for each match.
      </Typography.Paragraph>
      <PredictionForm />
      <List
        dataSource={predictions}
        style={{ marginTop: 24 }}
        bordered
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>{item.predicted_winner}</div>
              <div>Confidence: {item.confidence}%</div>
              <div>Match: #{item.match}</div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}
