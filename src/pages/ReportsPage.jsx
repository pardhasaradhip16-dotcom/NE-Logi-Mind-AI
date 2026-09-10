import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { REPORTS_DATA } from '../data/mockData';
import { AccessibilityGauge, RiskDonutChart } from '../components/charts/Charts';

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('10 Jun 2025 - 16 Jun 2025');
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Generate synthetic PDF/CSV trigger
      const element = document.createElement("a");
      const file = new Blob([
        `NE-Logi Mind AI - Executive Accessibility & Disruption Intelligence Report
Date Range: ${dateRange}
Overall Accessibility Score: 78/100 (Good Accessibility)
Low Risk: 68% | Medium Risk: 22% | High Risk: 10%
On-Time Performance: 92% | Delayed: 6% | Cancelled: 2%

TOP RISK CORRIDORS:
1. Tirupati: High Risk (Landslide + Heavy Rainfall - NH71 Ghat Section)
2. Nellore: Medium Risk (Flood Inundation - Pennar Basin)
3. Vijayawada: Medium Risk (Traffic Congestion - NH16 Interchange)
4. Vizag Port Road: Low-Medium Risk (Heavy Container Queue)

RECENT TELEMETRY ALERTS:
- Heavy rainfall alert for Tirupati region (12 Jun, 09:20)
- Road blockage on NH16 (12 Jun, 08:15)
- Delay predicted for SHP003 (12 Jun, 07:30)
- Weather change detected (Kolkata) (11 Jun, 23:45)
`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `NE_Logi_Mind_Report_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 500);
  };

  return (
    <div className="page-container reports-page">
      {/* Header with Date Range Filter & Download Report Button matching design */}
      <div className="reports-header-row">
        <div>
          <h1 className="page-title">Shipment & Accessibility Score</h1>
          <p className="page-subtitle">Longitudinal safety assessments, regional accessibility scores, and corridor resilience metrics.</p>
        </div>

        <div className="reports-actions-group">
          <div className="date-filter-box">
            <Calendar size={15} className="text-muted" />
            <input 
              type="text" 
              className="date-range-input"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="spinner-sm"></span>
            ) : (
              <>
                <Download size={16} />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Row: 3 Visual Metrics Cards matching design reference */}
      <div className="reports-visuals-grid">
        {/* Card 1: Accessibility Score Gauge */}
        <div className="card report-metric-card">
          <div className="card-header">
            <h3 className="card-title">Accessibility Score</h3>
            <span className="badge badge-success">Evaluated</span>
          </div>
          <AccessibilityGauge 
            score={REPORTS_DATA.accessibilityScore.score}
            maxScore={REPORTS_DATA.accessibilityScore.maxScore}
          />
        </div>

        {/* Card 2: Risk Distribution Donut */}
        <div className="card report-metric-card">
          <div className="card-header">
            <h3 className="card-title">Risk Distribution</h3>
            <span className="card-subtitle-small">Active Corridors</span>
          </div>
          <RiskDonutChart 
            low={REPORTS_DATA.riskDistribution.low.percentage}
            medium={REPORTS_DATA.riskDistribution.medium.percentage}
            high={REPORTS_DATA.riskDistribution.high.percentage}
          />
        </div>

        {/* Card 3: Shipment Performance */}
        <div className="card report-metric-card">
          <div className="card-header">
            <h3 className="card-title">Shipment Performance</h3>
            <span className="card-subtitle-small">Fleet-wide</span>
          </div>

          <div className="performance-bars-container">
            {REPORTS_DATA.shipmentPerformance.map((item, idx) => (
              <div key={idx} className="perf-bar-group">
                <div className="perf-bar-labels">
                  <span className="perf-label">{item.label}</span>
                  <span className="perf-pct font-bold" style={{ color: item.color }}>{item.percentage}%</span>
                </div>
                <div className="perf-track">
                  <div 
                    className="perf-fill"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="fleet-stat-badge">
            <CheckCircle size={15} className="text-success" />
            <span>98% total fleet operational continuity</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Risk Locations Table + Recent Alerts Feed matching design */}
      <div className="reports-bottom-grid">
        {/* Left: Top Risk Locations */}
        <div className="card risk-locations-card">
          <div className="card-header">
            <h3 className="card-title">Top Risk Locations</h3>
            <button className="link-btn" onClick={() => alert("Showing all 24 monitored high-risk transit sectors.")}>
              View All
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Risk Level</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {REPORTS_DATA.topRiskLocations.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.location}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.affectedCorridor}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.riskLevel === 'High' ? 'badge-danger' : 
                        item.riskLevel === 'Medium' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span className="reason-text">{item.reason}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Alerts Activity Feed matching design */}
        <div className="card recent-alerts-card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            <span className="badge badge-warning">Live Telemetry</span>
          </div>

          <div className="alerts-feed-list">
            {REPORTS_DATA.recentAlerts.map((alert) => (
              <div key={alert.id} className="feed-alert-item">
                <div className={`feed-icon-pill ${
                  alert.severity === 'high' ? 'icon-red' : 
                  alert.severity === 'medium' ? 'icon-orange' : 
                  alert.severity === 'warning' ? 'icon-amber' : 'icon-blue'
                }`}>
                  <AlertTriangle size={15} />
                </div>
                <div className="feed-alert-content">
                  <p className="feed-alert-title">{alert.title}</p>
                  <span className="feed-alert-time">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
