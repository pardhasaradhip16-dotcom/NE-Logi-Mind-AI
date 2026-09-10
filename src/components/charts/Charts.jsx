import React from 'react';

// Semi-circular Accessibility Gauge (0 - 100)
export const AccessibilityGauge = ({ score = 78, maxScore = 100 }) => {
  const radius = 65;
  const circumference = Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const strokeDashoffset = circumference - (normalizedScore / maxScore) * circumference;

  return (
    <div className="gauge-wrapper">
      <div className="gauge-svg-container">
        <svg viewBox="0 0 160 95" className="gauge-svg">
          {/* Background Arc */}
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Active Gradient Arc */}
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="gauge-center-text">
          <span className="gauge-score">{score}</span>
          <span className="gauge-max">/{maxScore}</span>
        </div>
      </div>
      <div className="gauge-info">
        <div className="gauge-status-badge">Good Accessibility</div>
        <p className="gauge-subtext">Most routes are accessible, with minor risk in 2 regions.</p>
      </div>
    </div>
  );
};

// Donut Chart for Risk Distribution
export const RiskDonutChart = ({
  low = 68,
  medium = 22,
  high = 10,
}) => {
  // SVG Donut calculation with r=45, circumference = 2 * PI * 45 = 282.74
  const c = 282.74;
  const offsetLow = 0;
  const strokeLow = (low / 100) * c;
  const strokeMed = (medium / 100) * c;
  const strokeHigh = (high / 100) * c;

  const offsetMed = -(strokeLow);
  const offsetHigh = -(strokeLow + strokeMed);

  return (
    <div className="donut-container">
      <div className="donut-svg-wrapper">
        <svg viewBox="0 0 120 120" className="donut-svg">
          {/* Low Risk Segment (Green) */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
            strokeDasharray={`${strokeLow} ${c - strokeLow}`}
            strokeDashoffset={offsetLow}
            transform="rotate(-90 60 60)"
          />
          {/* Medium Risk Segment (Amber) */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
            strokeDasharray={`${strokeMed} ${c - strokeMed}`}
            strokeDashoffset={offsetMed}
            transform="rotate(-90 60 60)"
          />
          {/* High Risk Segment (Red) */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#ef4444"
            strokeWidth="16"
            strokeDasharray={`${strokeHigh} ${c - strokeHigh}`}
            strokeDashoffset={offsetHigh}
            transform="rotate(-90 60 60)"
          />
          {/* Inner cutout for smooth donut */}
          <circle cx="60" cy="60" r="37" fill="#ffffff" />
        </svg>
      </div>
      <div className="donut-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
          <span className="legend-label">Low Risk</span>
          <span className="legend-val">{low}%</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
          <span className="legend-label">Medium Risk</span>
          <span className="legend-val">{medium}%</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
          <span className="legend-label">High Risk</span>
          <span className="legend-val">{high}%</span>
        </div>
      </div>
    </div>
  );
};

// Delay Probability Area Chart (matches Predictive Analytics curve)
export const DelayProbabilityChart = ({ data }) => {
  const points = data || [
    { hour: "0h", probability: 12 },
    { hour: "4h", probability: 28 },
    { hour: "8h", probability: 42 },
    { hour: "12h", probability: 68 },
    { hour: "16h", probability: 54 },
    { hour: "20h", probability: 36 },
    { hour: "24h", probability: 22 },
  ];

  const width = 360;
  const height = 140;
  const padX = 30;
  const padY = 20;

  // Map coordinates
  const coords = points.map((pt, idx) => {
    const x = padX + (idx / (points.length - 1)) * (width - 2 * padX);
    const y = height - padY - (pt.probability / 100) * (height - 2 * padY);
    return { x, y, ...pt };
  });

  // Construct smooth SVG path
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

  // Peak point
  const peakPt = coords.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);

  return (
    <div className="prob-chart-container">
      <div className="prob-chart-header">
        <h4 className="chart-title">Delay Probability</h4>
        <span className="peak-tag">Peak: {peakPt.probability}% @ {peakPt.hour}</span>
      </div>
      <div className="svg-responsive-box">
        <svg viewBox={`0 0 ${width} ${height}`} className="curve-svg">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#e2e8f0" />

          {/* Fill Area */}
          <path d={areaD} fill="url(#areaGrad)" />

          {/* Stroke Line */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />

          {/* Peak Highlight */}
          <circle cx={peakPt.x} cy={peakPt.y} r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          <g transform={`translate(${peakPt.x - 18}, ${peakPt.y - 24})`}>
            <rect width="36" height="18" rx="4" fill="#1e293b" />
            <text x="18" y="12" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">{peakPt.probability}%</text>
          </g>

          {/* X Axis Labels */}
          {coords.map((pt, i) => (
            <text
              key={i}
              x={pt.x}
              y={height - 4}
              fontSize="9"
              fill="#94a3b8"
              textAnchor="middle"
              fontWeight="500"
            >
              {pt.hour}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
