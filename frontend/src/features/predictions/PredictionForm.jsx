import { useState } from 'react'
import { Button, Form, Input, InputNumber, message } from 'antd'
import api from '../../api'

export default function PredictionForm() {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    setSubmitting(true)
    try {
      await api.post('predictions/', values)
      message.success('Prediction submitted! Refresh the page to see updates.')
    } catch (error) {
      console.error(error)
      message.error('Could not save prediction.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 480 }}>
      <Form.Item
        label="Match ID"
        name="match"
        rules={[{ required: true, message: 'Enter the ID of the match to predict.' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Predicted Winner"
        name="predicted_winner"
        rules={[{ required: true, message: 'Enter the predicted winner.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Confidence" name="confidence" initialValue={60} rules={[{ required: true, message: 'Enter a confidence value.' }]}> 
        <InputNumber min={1} max={100} style={{ width: '100%' }} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={submitting}>
        Save Prediction
      </Button>
    </Form>
  )
}
