import { useEffect } from 'react'
import { Card, Typography } from 'antd'
import useStore from '../../hooks/useStore'
import MatchList from './MatchList'

export default function MatchesPage() {
  const { matches, loadMatches, loading } = useStore()

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  return (
    <Card title="Matches" loading={loading}>
      <Typography.Paragraph>
        All scheduled and completed matches are listed below. Update scores and statuses as you build the app.
      </Typography.Paragraph>
      <MatchList items={matches} />
    </Card>
  )
}
