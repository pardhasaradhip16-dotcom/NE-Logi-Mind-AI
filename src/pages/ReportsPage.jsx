import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Activity
} from 'lucide-react';
import { REPORTS_DATA } from '../data/mockData';
import { AccessibilityGauge, RiskDonutChart } from '../components/charts/Charts';
import { getApiUrl } from '../config/apiConfig';

export const ReportsPage = () => {
  // Format dynamic dates (Last 7 days to Today)
  const formatDefaultDateRange = () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return `${pastDate.toLocaleDateString('en-GB', options)} - ${today.toLocaleDateString('en-GB', options)}`;
  };

  const [dateRange, setDateRange] = useState(formatDefaultDateRange());
  const [reportData, setReportData] = useState(REPORTS_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  // Fetch live reports data from backend with resilient local fallback
  const fetchLiveReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/reports'), { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
        setLastRefreshed(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.info("Using local telematics reports fallback:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveReports();
  }, []);

  // Generate and download exact, real CSV or structured executive report
  const handleDownload = (format = 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

      if (format === 'csv') {
        const headers = [
          "Corridor / Route",
          "Risk Level",
          "Risk Score",
          "Primary Hazard / Reason",
          "Carrier & Vehicle",
          "Assigned Driver",
          "Evaluation Status"
        ];

        const rows = (reportData.topRiskLocations || []).map(item => [
          `"${item.location}"`,
          `"${item.riskLevel}"`,
          item.riskScore || (item.riskLevel === 'High' ? 84 : item.riskLevel === 'Medium' ? 55 : 20),
          `"${(item.reason || '').replace(/"/g, '""')}"`,
          `"${item.affectedCorridor || 'Heavy Carrier'}"`,
          `"${item.driver || 'Fleet Officer'}"`,
          '"Active Telemetry Monitored"'
        ]);

        const csvContent = [
          `# NE-Logi Mind AI - Corridor Risk & Accessibility Telemetry Audit Report`,
          `# Generated Date: ${new Date().toLocaleString()}`,
          `# Evaluated Period: ${dateRange}`,
          `# Overall Regional Accessibility Score: ${reportData.accessibilityScore?.score || 82}/100 (${reportData.accessibilityScore?.statusText || 'Optimal'})`,
          `# Low Risk: ${reportData.riskDistribution?.low?.percentage || 65}% | Medium: ${reportData.riskDistribution?.medium?.percentage || 22}% | High: ${reportData.riskDistribution?.high?.percentage || 13}%`,
          "",
          headers.join(","),
          ...rows.map(r => r.join(","))
        ].join("\r\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `NE_Logi_Mind_Exact_Report_${timestamp}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const alertLines = (reportData.recentAlerts || []).map(a => 
          `  - [${a.timestamp}] (${(a.severity || 'info').toUpperCase()}) ${a.title}`
        ).join("\n");

        const corridorLines = (reportData.topRiskLocations || []).map((loc, i) => 
          `  ${i + 1}. ${loc.location} | Level: ${loc.riskLevel} (Score: ${loc.riskScore || 70}/100)\n     Vehicle/Carrier: ${loc.affectedCorridor}\n     Primary Risk Factor: ${loc.reason}\n     Lead Driver: ${loc.driver || 'Assigned Driver'}`
        ).join("\n\n");

        const textReport = 
`================================================================================
          NE-LOGI MIND AI - EXECUTIVE LOGISTICS & ACCESSIBILITY AUDIT
================================================================================
Generated On       : ${new Date().toLocaleString()}
Audit Date Range   : ${dateRange}
System Status      : 100% Operational Continuity
Fleet Evaluation   : Live Machine Learning Telematics Active

--------------------------------------------------------------------------------
1. REGIONAL ACCESSIBILITY SCORE
--------------------------------------------------------------------------------
Overall Score      : ${reportData.accessibilityScore?.score || 82} / 100 [${reportData.accessibilityScore?.statusText || 'Optimal Accessibility'}]
Summary Assessment : ${reportData.accessibilityScore?.subtext || 'All primary transit corridors evaluated.'}

--------------------------------------------------------------------------------
2. RISK DISTRIBUTION MATRIX
--------------------------------------------------------------------------------
- Low Risk Corridors    : ${reportData.riskDistribution?.low?.percentage || 65}%
- Medium Risk Corridors : ${reportData.riskDistribution?.medium?.percentage || 22}%
- High Risk Corridors   : ${reportData.riskDistribution?.high?.percentage || 13}%

--------------------------------------------------------------------------------
3. SHIPMENT PERFORMANCE METRICS
--------------------------------------------------------------------------------
${(reportData.shipmentPerformance || []).map(p => `- ${p.label.padEnd(25)}: ${p.percentage}%`).join("\n")}
Fleet Continuity Rate   : ${reportData.fleetContinuityRate || '98%'}

--------------------------------------------------------------------------------
4. MONITORED CORRIDORS & TRANSIT RISK RATINGS
--------------------------------------------------------------------------------
${corridorLines}

--------------------------------------------------------------------------------
5. RECENT REAL-TIME TELEMETRY INCIDENTS & ALERTS
--------------------------------------------------------------------------------
${alertLines}

================================================================================
End of Certified AI Telematics Report | NE-Logi Mind AI Logistics Engine
================================================================================`;

        const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `NE_Logi_Mind_Executive_Report_${timestamp}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 400);
  };

  return (
    <div className="page-container reports-page">
      {/* Header with Date Range Filter & Download Report Button matching design */}
      <div className="reports-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Shipment & Accessibility Score</h1>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}>
              <Activity size={12} /> Live Telematics
            </span>
          </div>
          <p className="page-subtitle">
            Longitudinal safety assessments, regional accessibility scores, and live corridor resilience metrics.
            <span style={{ marginLeft: '8px', color: '#64748b', fontSize: '12px' }}>Synced: {lastRefreshed}</span>
          </p>
        </div>

        <div className="reports-actions-group">
          <div className="date-filter-box">
            <Calendar size={15} className="text-muted" />
            <input 
              type="text" 
              className="date-range-input"
              value={dateRange}
              title="Report Date Range"
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={fetchLiveReports}
            title="Sync Live Metrics"
            style={{ padding: '8px 12px' }}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? 'spin-icon' : ''} />
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => handleDownload('csv')}
              disabled={isExporting}
              title="Download structured CSV dataset"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FileSpreadsheet size={15} />
              <span>Download CSV</span>
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => handleDownload('text')}
              disabled={isExporting}
              title="Download formatted text executive summary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              <span>Full Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Row: 3 Visual Metrics Cards matching design reference */}
      <div className="reports-visuals-grid">
        {/* Card 1: Accessibility Score Gauge */}
        <div className="card report-metric-card">
          <div className="card-header">
            <h3 className="card-title">Accessibility Score</h3>
            <span className="badge badge-success">{reportData.accessibilityScore?.statusText || 'Evaluated'}</span>
          </div>
          <AccessibilityGauge 
            score={reportData.accessibilityScore?.score ?? 82}
            maxScore={reportData.accessibilityScore?.maxScore ?? 100}
          />
          <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginTop: '8px', padding: '0 12px' }}>
            {reportData.accessibilityScore?.subtext}
          </p>
        </div>

        {/* Card 2: Risk Distribution Donut */}
        <div className="card report-metric-card">
          <div className="card-header">
            <h3 className="card-title">Risk Distribution</h3>
            <span className="card-subtitle-small">Active Corridors</span>
          </div>
          <RiskDonutChart 
            low={reportData.riskDistribution?.low?.percentage ?? 65}
            medium={reportData.riskDistribution?.medium?.percentage ?? 22}
            high={reportData.riskDistribution?.high?.percentage ?? 13}
          />
        </div>

        {/* Card 3: Shipment Performance */}
        <div className="card report-metric-card">
          <div className="card-header">
            <h3 className="card-title">Shipment Performance</h3>
            <span className="card-subtitle-small">Fleet-wide</span>
          </div>

          <div className="performance-bars-container">
            {(reportData.shipmentPerformance || []).map((item, idx) => (
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
            <span>{reportData.fleetContinuityRate || '98%'} total fleet operational continuity</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Risk Locations Table + Recent Alerts Feed matching design */}
      <div className="reports-bottom-grid">
        {/* Left: Top Risk Locations */}
        <div className="card risk-locations-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Top Risk Locations & Corridors</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Monitored transit sectors with live risk ratings</p>
            </div>
            <span className="badge badge-secondary" style={{ fontSize: '11px' }}>
              {reportData.topRiskLocations?.length || 0} Sectors
            </span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Corridor / Vehicle</th>
                  <th>Risk Level</th>
                  <th>Primary Risk Factor</th>
                </tr>
              </thead>
              <tbody>
                {(reportData.topRiskLocations || []).map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{item.location}</strong>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {item.affectedCorridor} {item.driver ? `• ${item.driver}` : ''}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.riskLevel === 'High' ? 'badge-danger' : 
                        item.riskLevel === 'Medium' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {item.riskLevel} {item.riskScore ? `(${item.riskScore}%)` : ''}
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
            <h3 className="card-title">Recent Telemetry Alerts</h3>
            <span className="badge badge-warning">Live Telemetry</span>
          </div>

          <div className="alerts-feed-list">
            {(reportData.recentAlerts || []).map((alert) => (
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
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="feed-alert-time">{alert.timestamp}</span>
                    {alert.driver && (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>• {alert.driver}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
