import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  ArrowRight,
  Shield,
  Zap,
  Leaf,
  Sparkles,
  User,
  Truck
} from 'lucide-react';
import { KPI_METRICS } from '../data/mockData';
import { DRIVER_PROFILES } from '../data/driversData';
import { CorridorMap } from '../components/map/CorridorMap';

export const DashboardPage = ({ onNavigateTab, onSelectShipment }) => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [liveDrivers, setLiveDrivers] = useState([]);

  useEffect(() => {
    // Load drivers locally for dashboard display
    // Map them into the shape expected by the table
    const mappedDrivers = DRIVER_PROFILES.map(d => ({
      driverId: d.id,
      name: d.name,
      shipmentId: d.assignedShipmentId,
      origin: d.route.originCity,
      destination: d.route.destinationCity,
      status: d.assignedShipmentId === "NE-SHP-003" ? "Delayed" : "On Time",
      phone: d.phone,
      licenseNumber: d.licenseNumber,
      vehicle: d.vehicle.model,
      routeWaypoints: d.route.waypoints,
      currentCoords: d.route.checkpoints.find(c => c.status === 'current')?.coords || d.route.waypoints[Math.floor(d.route.waypoints.length / 2)]
    }));
    setLiveDrivers(mappedDrivers);
  }, []);

  const handleRowClick = (driver) => {
    setSelectedShipment(driver);
    if (onSelectShipment) onSelectShipment(driver);
  };

  return (
    <div className="page-container dashboard-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Real-time insights for smarter and safer logistics.</p>
      </div>

      {/* 4 KPI Metrics Grid matching design reference */}
      <div className="kpi-grid">
        {/* Metric 1: Total Shipments */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active NE Fleet</span>
            <div className="kpi-icon-pill" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Truck size={18} />
            </div>
          </div>
          <div className="kpi-value">{liveDrivers.length || 4}</div>
          <div className="kpi-subtext">
            <span className="trend-up">
              <TrendingUp size={13} style={{ display: 'inline', marginRight: 2 }} />
              100%
            </span>
            <span>deployment active</span>
          </div>
        </div>

        {/* Metric 2: On-Time Deliveries */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">On-Time Deliveries</span>
            <div className="kpi-icon-pill" style={{ background: '#ecfeff', color: '#06b6d4' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="kpi-value">{KPI_METRICS.onTimeDeliveries.value}</div>
          <div className="kpi-subtext">
            <span className="trend-up">
              <TrendingUp size={13} style={{ display: 'inline', marginRight: 2 }} />
              {KPI_METRICS.onTimeDeliveries.change}
            </span>
            <span>{KPI_METRICS.onTimeDeliveries.period}</span>
          </div>
        </div>

        {/* Metric 3: Avg Delay Risk */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Avg Delay Risk</span>
            <div className="kpi-icon-pill" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">{KPI_METRICS.avgDelayHours.value}<span>{KPI_METRICS.avgDelayHours.unit}</span></div>
          <div className="kpi-subtext">
            <span className="trend-up">
              <TrendingDown size={13} style={{ display: 'inline', marginRight: 2 }} />
              {KPI_METRICS.avgDelayHours.change}
            </span>
            <span>{KPI_METRICS.avgDelayHours.period}</span>
          </div>
        </div>

        {/* Metric 4: Live Threat Alerts */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Live Threat Alerts</span>
            <div className="kpi-icon-pill" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value">{KPI_METRICS.riskAlerts.value}</div>
          <div className="kpi-subtext" style={{ color: '#f59e0b' }}>
            <span>{KPI_METRICS.riskAlerts.subtext}</span>
          </div>
        </div>
      </div>

      <div className="main-content-grid">
        {/* Map Panel */}
        <div className="map-panel card">
          <div className="card-header">
            <h3>Live NE India Network</h3>
            <span className="live-pulse">
              <span className="pulse-dot"></span> Live GPS
            </span>
          </div>
          <div className="map-container">
            {/* Map the driver coords correctly to the CorridorMap */}
            <CorridorMap 
               customCorridors={liveDrivers.map(d => {
                  let color = '#10b981'; // Green for On Time
                  if (d.status === 'Delayed') color = '#f59e0b';
                  if (d.status === 'High-Risk') color = '#ef4444';
                  
                  return {
                     points: d.routeWaypoints,
                     color: color,
                     dashArray: null,
                     status: d.status
                  };
               })}
               customCities={liveDrivers.flatMap(d => {
                  // Only add start and end points as cities to avoid clutter
                  const waypoints = d.routeWaypoints;
                  if (!waypoints || waypoints.length < 2) return [];
                  
                  let color = '#10b981';
                  if (d.status === 'Delayed') color = '#f59e0b';
                  if (d.status === 'High-Risk') color = '#ef4444';
                  
                  return [
                     { name: d.origin, coords: waypoints[0], color },
                     { name: d.destination, coords: waypoints[waypoints.length - 1], color }
                  ];
               })}
               shipments={liveDrivers.map(d => ({
                  id: d.shipmentId,
                  from: d.origin,
                  to: d.destination,
                  carrier: d.name,
                  eta: "In Transit",
                  status: d.status || "On Time",
                  currentCoords: d.currentCoords || d.routeWaypoints[0]
               }))} 
               onSelectShipment={(s) => {
                  const driver = liveDrivers.find(d => d.shipmentId === s.id);
                  if (driver) handleRowClick(driver);
               }} 
            />
          </div>
        </div>

        {/* Active Drivers List */}
        <div className="shipments-panel card">
          <div className="card-header">
            <h3>Active Drivers & Shipments</h3>
            <button className="btn-tiny">View All</button>
          </div>
          
          <div className="table-responsive">
            <table className="nelogi-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Corridor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {liveDrivers.length === 0 ? (
                  <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px'}}>No live drivers found.</td></tr>
                ) : liveDrivers.map((driver) => (
                  <tr 
                    key={driver.driverId} 
                    onClick={() => handleRowClick(driver)}
                    className={selectedShipment?.driverId === driver.driverId ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#e2e8f0', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={14} color="#475569" />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.85rem' }}>{driver.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{driver.shipmentId}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="corridor-text" style={{ fontSize: '0.75rem' }}>
                        <span>{driver.origin}</span>
                        <span className="route-arrow">→</span>
                        <span>{driver.destination}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        driver.status === 'On Time' ? 'badge-success' : 
                        driver.status === 'Delayed' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {driver.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Selected Driver Preview */}
          {selectedShipment && (
            <div className="selected-shipment-banner" style={{ marginTop: '1rem', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div className="sel-shp-left" style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.9rem' }}>{selectedShipment.name}</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#475569' }}>{selectedShipment.phone} • {selectedShipment.licenseNumber}</span>
              </div>
              <div className="sel-shp-right" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cargo-type" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>{selectedShipment.vehicle}</span>
                <button 
                  className="btn-tiny"
                  onClick={() => onNavigateTab('cockpit')}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Enter Cockpit →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Value Banner matching bottom right design */}
      <div className="why-nelogi-banner">
        <div className="banner-top-row">
          <div className="banner-title-box">
            <span className="banner-tag">NE-Logi Mind Intelligence</span>
            <h2>Why NE-Logi Mind AI?</h2>
            <p>Smarter technology. Safer logistics. Greater impact.</p>
          </div>
          <div className="banner-features-strip">
            <div className="b-feature">
              <Zap size={16} className="b-icon text-primary" />
              <div>
                <strong>Predict</strong>
                <span>Detect delays & risks before they happen</span>
              </div>
            </div>
            <div className="b-feature">
              <Shield size={16} className="b-icon text-warning" />
              <div>
                <strong>Explain</strong>
                <span>Know the reason behind every risk</span>
              </div>
            </div>
            <div className="b-feature">
              <Sparkles size={16} className="b-icon text-success" />
              <div>
                <strong>Recommend</strong>
                <span>Get the best route for your needs</span>
              </div>
            </div>
            <div className="b-feature">
              <Leaf size={16} className="b-icon text-info" />
              <div>
                <strong>Simulate</strong>
                <span>Test what-if digital twin scenarios</span>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-bottom-strip">
          <div className="pill-badges-group">
            <span className="pill-badge">⚡ Faster Decisions</span>
            <span className="pill-badge">💰 Reduced Costs</span>
            <span className="pill-badge">🛡️ Safer Routes</span>
            <span className="pill-badge">♿ Greater Accessibility</span>
            <span className="pill-badge">🌱 Sustainable Future</span>
          </div>
          <div className="mission-quote">
            From reacting to delays after they happen → To predicting and preventing disruption before it happens.
          </div>
        </div>
      </div>
    </div>
  );
};
