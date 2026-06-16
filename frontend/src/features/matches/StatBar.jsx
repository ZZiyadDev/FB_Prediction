import React from 'react';
import { useThemeStyles } from '../../hooks/themeStyles';

const StatBar = ({ label, homeValue, awayValue, isPercentage = false }) => {
  const ts = useThemeStyles();

  const hVal = parseFloat(homeValue) || 0;
  const aVal = parseFloat(awayValue) || 0;
  const total = hVal + aVal;

  const homePercent = total > 0 ? (hVal / total) * 100 : 50;
  const awayPercent = total > 0 ? (aVal / total) * 100 : 50;

  const formatValue = (val) => {
    if (isPercentage) return `${val}%`;
    return val;
  };

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '4px',
        fontWeight: 500,
        fontSize: '14px',
        color: ts.statBarText
      }}>
        <span style={{ width: '40px', textAlign: 'left' }}>{formatValue(homeValue)}</span>
        <span style={{ flex: 1, textAlign: 'center', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', color: ts.statBarLabel }}>
          {label}
        </span>
        <span style={{ width: '40px', textAlign: 'right' }}>{formatValue(awayValue)}</span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        height: '8px', 
        backgroundColor: ts.statBarTrack, 
        borderRadius: '4px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Home Side (expanding from center to left) */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'flex-end',
          backgroundColor: ts.statBarTrack 
        }}>
          <div style={{ 
            width: `${homePercent}%`, 
            height: '100%', 
            backgroundColor: '#14b8a6', // Turquoise
            transition: 'width 0.5s ease-out'
          }} />
        </div>

        
        {/* Center Divider */}
        <div style={{ width: '2px', backgroundColor: ts.statBarDivider, zIndex: 1 }} />
        
        {/* Away Side (expanding from center to right) */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'flex-start',
          backgroundColor: ts.statBarTrack 
        }}>
          <div style={{ 
            width: `${awayPercent}%`, 
            height: '100%', 
            backgroundColor: '#434343', // Dark Grey/Charcoal
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
};

export default StatBar;
