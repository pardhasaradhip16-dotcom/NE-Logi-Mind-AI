import React, { useEffect } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  ShieldAlert, 
  Navigation, 
  Gauge, 
  Fuel, 
  Thermometer, 
  Radio, 
  FileText,
  Calendar,
  Share2,
  Cpu
} from 'lucide-react';

export const ShipmentDetailModal = ({ shipment, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!shipment) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'On Time': return 'badge-success';
      case 'Delayed': return 'badge-danger';
      case 'At Risk': return 'badge-warning';
      case 'Delivered': return 'badge-info';
      default: return 'badge-info';
    }
  };

  const getRiskScoreClass = (score) => {
    if (score >= 70) return { color: '#ef4444', bg: '#fef2f2', label: 'High Risk' };
    if (score >= 40) return { color: '#f59e0b', bg: '#fffbeb', label: 'Medium Risk' };
    return { color: '#10b981', bg: '#ecfdf5', label: 'Low Risk' };
  };

  const riskMeta = getRiskScoreClass(shipment.riskScore);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card shipment-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', width: '92%' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-top-tags">
              <span className="tracking-code-badge">{shipment.trackingNumber}</span>
              <span className={`badge ${getStatusBadgeClass(shipment.status)}`}>
                {shipment.status}
              </span>
              <span 
                className="badge" 
                style={{ backgroundColor: riskMeta.bg, color: riskMeta.color, border: `1px solid ${riskMeta.color}40` }}
              >
                Risk Score: {shipment.riskScore}/100 ({riskMeta.label})
              </span>
            </div>
            <h2 className="modal-shipment-title">
              Shipment {shipment.id} • {shipment.origin.city} to {shipment.destination.city}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body shipment-modal-body">
          {/* 1. Corridor Route Progress Stepper */}
          <div className="shipment-progress-stepper-card">
            <div className="stepper-track-line">
              <div 
                className="stepper-fill-line" 
                style={{ 
                  width: `${shipment.progress}%`,
                  backgroundColor: shipment.status === 'On Time' ? '#10b981' : shipment.status === 'Delayed' ? '#ef4444' : '#f59e0b'
                }}
              ></div>
            </div>

            <div className="stepper-nodes-row">
              {/* Origin Node */}
              <div className="stepper-node done">
                <div className="node-icon-circle bg-success">
                  <CheckCircle2 size={15} color="#ffffff" />
                </div>
                <div className="node-info">
                  <span className="node-type">Origin</span>
                  <strong>{shipment.origin.city}</strong>
                  <span className="node-sub">{shipment.origin.name}</span>
                  <span className="node-time">{shipment.origin.departureTime}</span>
                </div>
              </div>

              {/* Current Location Node */}
              <div className="stepper-node current">
                <div className="node-icon-circle bg-primary pulsating-node">
                  <Truck size={15} color="#ffffff" />
                </div>
                <div className="node-info text-center">
                  <span className="node-type text-primary">Current Location</span>
                  <strong>{shipment.currentLocation.name}</strong>
                  <span className="node-sub">Speed: {shipment.currentLocation.speedKmH} km/h • {shipment.currentLocation.lastUpdated}</span>
                  <span className="simulated-pill-tag">
                    {shipment.currentLocation.isSimulated ? "Simulated Telematics" : "Live GPS Lock"}
                  </span>
                </div>
              </div>

              {/* Destination Node */}
              <div className={`stepper-node ${shipment.status === 'Delivered' ? 'done' : 'pending'}`}>
                <div className={`node-icon-circle ${shipment.status === 'Delivered' ? 'bg-success' : 'bg-muted'}`}>
                  <MapPin size={15} color="#ffffff" />
                </div>
                <div className="node-info text-right">
                  <span className="node-type">Destination</span>
                  <strong>{shipment.destination.city}</strong>
                  <span className="node-sub">{shipment.destination.name}</span>
                  <span className="node-time">ETA: {shipment.eta}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Key Metrics Grid (Distance, ETA, Delays, Risk) */}
          <div className="shipment-key-metrics-grid">
            {/* ETA */}
            <div className="modal-metric-card">
              <div className="m-metric-header">
                <Clock size={16} className="text-primary" />
                <span>Estimated Arrival</span>
              </div>
              <div className="m-metric-value">{shipment.eta}</div>
              <div className="m-metric-subtext">Scheduled: {shipment.destination.scheduledEta}</div>
            </div>

            {/* Distance Remaining */}
            <div className="modal-metric-card">
              <div className="m-metric-header">
                <Navigation size={16} className="text-success" />
                <span>Distance Remaining</span>
              </div>
              <div className="m-metric-value">{shipment.distanceRemainingKm} km</div>
              <div className="m-metric-subtext">Total Corridor: {shipment.totalDistanceKm} km ({shipment.progress}% complete)</div>
            </div>

            {/* Delay Information */}
            <div className="modal-metric-card">
              <div className="m-metric-header">
                <AlertTriangle size={16} className={shipment.delayInformation.delayHours > 0 ? "text-danger" : "text-success"} />
                <span>Delay Status</span>
              </div>
              <div className={`m-metric-value ${shipment.delayInformation.delayHours > 0 ? "text-danger" : "text-success"}`}>
                {shipment.delayInformation.statusLabel}
              </div>
              <div className="m-metric-subtext" title={shipment.delayInformation.reason}>
                {shipment.delayInformation.reason.length > 45 
                  ? shipment.delayInformation.reason.slice(0, 45) + "..." 
                  : shipment.delayInformation.reason}
              </div>
            </div>

            {/* Risk Score */}
            <div className="modal-metric-card">
              <div className="m-metric-header">
                <ShieldAlert size={16} style={{ color: riskMeta.color }} />
                <span>Risk & Accessibility</span>
              </div>
              <div className="m-metric-value" style={{ color: riskMeta.color }}>
                {shipment.riskScore}/100
              </div>
              <div className="m-metric-subtext">Level: {riskMeta.label}</div>
            </div>
          </div>

          {/* 3. Two Column Details: Left Vehicle/Driver, Right Risk Factors */}
          <div className="shipment-detail-split-row">
            {/* Left: Vehicle & Driver Information */}
            <div className="card-sub-block">
              <h4 className="sub-block-title">
                <Truck size={16} className="text-primary" />
                <span>Vehicle & Telemetry Information</span>
              </h4>
              <div className="spec-table">
                <div className="spec-table-row">
                  <span className="st-label">Vehicle Model</span>
                  <span className="st-val">{shipment.vehicle.model}</span>
                </div>
                <div className="spec-table-row">
                  <span className="st-label">Registration</span>
                  <span className="st-val font-mono">{shipment.vehicle.regNumber}</span>
                </div>
                <div className="spec-table-row">
                  <span className="st-label">Fleet Carrier</span>
                  <span className="st-val">{shipment.vehicle.carrier}</span>
                </div>
                <div className="spec-table-row">
                  <span className="st-label">Payload / Consignment</span>
                  <span className="st-val">{shipment.vehicle.payloadKg}</span>
                </div>
                <div className="spec-table-row">
                  <span className="st-label">Reefer Cold-Chain</span>
                  <span className="st-val text-primary">{shipment.vehicle.reeferTemp}</span>
                </div>
                <div className="spec-table-row">
                  <span className="st-label">OBD-II Fuel Level</span>
                  <span className="st-val text-success">{shipment.vehicle.fuelLevelPercent}% Tank Capacity</span>
                </div>
              </div>

              {/* Driver Contact Box */}
              <div className="driver-modal-box">
                <div className="d-avatar-circle">
                  {shipment.driver.name.charAt(0)}
                </div>
                <div className="d-details">
                  <strong>{shipment.driver.name}</strong>
                  <span>Lic: {shipment.driver.licenseNumber} • Rating: ★ {shipment.driver.rating}</span>
                </div>
                <a 
                  href={`tel:${shipment.driver.phone}`} 
                  className="btn btn-primary btn-sm"
                  onClick={(e) => { e.preventDefault(); alert(`Connecting audio call to driver: ${shipment.driver.phone}`); }}
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
              </div>
            </div>

            {/* Right: Risk Factor Assessment & Delay Analysis */}
            <div className="card-sub-block">
              <h4 className="sub-block-title">
                <ShieldAlert size={16} style={{ color: riskMeta.color }} />
                <span>Route Risk & Factor Breakdown</span>
              </h4>

              <div className="risk-factors-modal-list">
                {shipment.riskFactors.map((factor, idx) => (
                  <div key={idx} className="risk-factor-item">
                    <span className="rf-bullet" style={{ backgroundColor: riskMeta.color }}></span>
                    <span className="rf-text">{factor}</span>
                  </div>
                ))}
              </div>

              <div className="delay-intel-box">
                <span className="delay-intel-title">Delay Cause Telemetry</span>
                <p className="delay-intel-desc">{shipment.delayInformation.reason}</p>
                {shipment.delayInformation.delayHours > 0 && (
                  <div className="delay-action-prompt">
                    <Radio size={14} className="text-danger" />
                    <span>Reroute available: Save up to 1.8 hrs via state bypass corridor</span>
                  </div>
                )}
              </div>

              {/* Scikit-Learn ML Model Intelligence Card */}
              {shipment.aiIntelligence && (
                <div className="ai-modal-intelligence-banner">
                  <div className="ai-banner-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Cpu size={15} color="var(--color-primary)" />
                      <span>Machine Learning Model Assessment</span>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      20k Records
                    </span>
                  </div>
                  <div className="ai-metrics-mini-grid">
                    <div className="ai-mini-stat">
                      <span>Model Pipeline</span>
                      <strong>HistGradBoosting</strong>
                    </div>
                    <div className="ai-mini-stat">
                      <span>Test Accuracy</span>
                      <strong>{shipment.aiIntelligence.classifierAccuracy || '83.25%'}</strong>
                    </div>
                    <div className="ai-mini-stat">
                      <span>ROC-AUC</span>
                      <strong>{shipment.aiIntelligence.classifierRocAuc || '0.9045'}</strong>
                    </div>
                    <div className="ai-mini-stat">
                      <span>Delay Probability</span>
                      <strong style={{ color: shipment.aiIntelligence.delayProbability > 0.5 ? '#ef4444' : '#10b981' }}>
                        {Math.round((shipment.aiIntelligence.delayProbability || 0) * 100)}%
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => {
              const report = `Shipment Telematics Export - ${shipment.id}\nTracking: ${shipment.trackingNumber}\nOrigin: ${shipment.origin.city}\nDestination: ${shipment.destination.city}\nStatus: ${shipment.status}\nETA: ${shipment.eta}\nSpeed: ${shipment.currentLocation.speedKmH} km/h\nDriver: ${shipment.driver.name} (${shipment.driver.phone})`;
              const blob = new Blob([report], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Waybill_${shipment.id}.txt`;
              a.click();
            }}
          >
            <FileText size={15} />
            <span>Export Waybill</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
