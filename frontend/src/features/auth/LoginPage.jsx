import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../../hooks/useStore';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Welcome back!');
      navigate('/');
    } catch (error) {
      // Error handled by store/message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Pitch markings background */}
      <div style={styles.pitchOverlay}>
        <div style={styles.centerCircle} />
        <div style={styles.halfwayLine} />
        <div style={styles.penaltyArcTop} />
        <div style={styles.penaltyArcBottom} />
      </div>

      {/* Floating particles for depth */}
      <div style={styles.particlesContainer}>
        <div style={{ ...styles.particle, top: '15%', left: '10%', animationDelay: '0s' }} />
        <div style={{ ...styles.particle, top: '70%', left: '80%', animationDelay: '2s' }} />
        <div style={{ ...styles.particle, top: '40%', left: '65%', animationDelay: '4s' }} />
        <div style={{ ...styles.particle, top: '85%', left: '25%', animationDelay: '1s' }} />
        <div style={{ ...styles.particle, top: '25%', left: '90%', animationDelay: '3s' }} />
      </div>

      {/* Main content */}
      <div style={styles.contentWrapper}>
        {/* Branding */}
        <div style={styles.brandSection}>
          <Title level={2} style={styles.brandTitle}>
            Football Prediction Dashboard
          </Title>
          <Text style={styles.brandSubtitle}>
            Predictive Intelligence Platform
          </Text>
        </div>

        {/* Form card */}
        <div style={styles.formCard}>
          <div style={styles.cardAccent} />
          
          <div style={{ padding: '40px 36px 36px' }}>
            <div style={{ marginBottom: '28px' }}>
              <Title level={3} style={styles.formTitle}>Welcome Back</Title>
              <Text style={styles.formSubtitle}>
                Sign in to access the command center
              </Text>
            </div>

            <Form name="login" onFinish={onFinish} layout="vertical" size="large">
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#64748b' }} />} 
                  placeholder="Username"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#64748b' }} />} 
                  placeholder="Password"
                  style={styles.input}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '16px', marginTop: '8px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={styles.submitButton}
                >
                  Sign In
                </Button>
              </Form.Item>
              
              <div style={styles.footerText}>
                <Text style={{ color: '#94a3b8', fontSize: '14px' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={styles.link}>
                    Create one
                  </Link>
                </Text>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.3; }
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.06; }
          50% { transform: translate(-50%, -50%) scale(1.02); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.06; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ant-input::placeholder,
        .ant-input-password .ant-input::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
        }
        .ant-input-affix-wrapper {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .ant-input {
          background: transparent !important;
          color: #e2e8f0 !important;
        }
        .ant-input-password-icon {
          color: #64748b !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #0a0f1e 0%, #0f172a 40%, #0d1f2d 100%)',
    overflow: 'hidden',
  },

  // --- Pitch markings (subtle, background) ---
  pitchOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    border: '1px solid rgba(20, 184, 166, 0.06)',
    animation: 'pulse-ring 6s ease-in-out infinite',
  },
  halfwayLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '1px',
    background: 'linear-gradient(to bottom, transparent 10%, rgba(20, 184, 166, 0.05) 30%, rgba(20, 184, 166, 0.05) 70%, transparent 90%)',
  },
  penaltyArcTop: {
    position: 'absolute',
    top: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '120px',
    borderRadius: '0 0 50% 50%',
    border: '1px solid rgba(20, 184, 166, 0.04)',
    borderTop: 'none',
  },
  penaltyArcBottom: {
    position: 'absolute',
    bottom: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '120px',
    borderRadius: '50% 50% 0 0',
    border: '1px solid rgba(20, 184, 166, 0.04)',
    borderBottom: 'none',
  },

  // --- Floating particles ---
  particlesContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#14b8a6',
    opacity: 0.15,
    animation: 'float 6s ease-in-out infinite',
  },

  // --- Content ---
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '420px',
    padding: '0 24px',
  },
  brandSection: {
    textAlign: 'center',
    marginBottom: '36px',
  },

  brandTitle: {
    margin: 0,
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '24px',
    letterSpacing: '1.5px',
  },
  brandSubtitle: {
    color: '#64748b',
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: 500,
  },

  // --- Form card ---
  formCard: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardAccent: {
    height: '3px',
    background: 'linear-gradient(90deg, transparent, #14b8a6, transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 4s linear infinite',
  },
  formTitle: {
    margin: 0,
    color: '#f1f5f9',
    fontWeight: 700,
    fontSize: '22px',
  },
  formSubtitle: {
    color: '#64748b',
    fontSize: '14px',
    display: 'block',
    marginTop: '4px',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    color: '#e2e8f0',
    height: '46px',
  },
  submitButton: {
    width: '100%',
    height: '46px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '15px',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    border: 'none',
    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
  },
  footerText: {
    textAlign: 'center',
    paddingTop: '4px',
  },
  link: {
    color: '#14b8a6',
    fontWeight: 600,
  },
};

export default LoginPage;
