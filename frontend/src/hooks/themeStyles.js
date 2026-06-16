import { useTheme } from './ThemeContext';

export const useThemeStyles = () => {
  const { isDarkMode } = useTheme();
  const d = isDarkMode;

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: d
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${d ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0'}`,
    background: d ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
  };

  return {
    isDark: d,

    // --- Backgrounds ---
    contentBg: d ? '#0a0f1e' : '#f8fafc',
    cardBg: d ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
    cardBorder: d ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0',
    surfaceBg: d ? 'rgba(255, 255, 255, 0.02)' : '#f8fafc',

    // --- Text ---
    textPrimary: d ? '#f1f5f9' : '#0f172a',
    textSecondary: d ? '#94a3b8' : '#64748b',
    textMuted: d ? '#64748b' : '#94a3b8',

    // --- Composed card style ---
    cardStyle,

    // --- Command bar (already dark in both modes) ---
    commandBarStyle: {
      ...cardStyle,
      background: '#0f172a',
      borderColor: '#1e293b',
    },

    // --- Chart tooltip ---
    chartTooltipStyle: {
      borderRadius: '12px',
      border: `1px solid ${d ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'}`,
      backgroundColor: d ? '#1e293b' : '#ffffff',
      color: d ? '#e2e8f0' : '#0f172a',
    },

    // --- Stat bar ---
    statBarTrack: d ? 'rgba(255, 255, 255, 0.06)' : '#f0f2f5',
    statBarDivider: d ? '#0f172a' : '#fff',
    statBarText: d ? '#cbd5e1' : '#555',
    statBarLabel: d ? '#64748b' : '#888',

    // --- Match dashboard header ---
    matchHeaderBg: d
      ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(20,184,166,0.05) 100%)'
      : 'linear-gradient(135deg, #fff 0%, #f0fdfa 100%)',

    // --- Dividers & borders ---
    dividerColor: d ? 'rgba(255, 255, 255, 0.06)' : '#e2e8f0',
    dashedBorder: d ? '1px dashed rgba(255, 255, 255, 0.08)' : '1px dashed #e2e8f0',

    // --- Lineup ---
    playerNameColor: d ? '#e2e8f0' : '#0f172a',

    // --- Dashboard card (no gradient) ---
    dashCardBg: d ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
    dashCardBorder: d ? 'none' : '1px solid #e2e8f0',
    dashCardValueColor: d ? '#ffffff' : '#0f172a',
  };
};
