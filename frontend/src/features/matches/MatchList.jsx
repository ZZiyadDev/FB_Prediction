import { List, Tag } from 'antd'

export default function MatchList({ items }) {
  return (
    <List
      dataSource={items}
      bordered
      renderItem={(item) => (
        <List.Item>
          <div style={{ width: '100%' }}>
            <div style={{ fontWeight: 600 }}>{item.home_team} vs {item.away_team}</div>
            <div>
              {item.score_home ?? '-'} : {item.score_away ?? '-'} • {new Date(item.match_date).toLocaleString()}
            </div>
            <Tag color={item.status === 'scheduled' ? 'blue' : 'green'}>{item.status}</Tag>
          </div>
        </List.Item>
      )}
    />
  )
}
